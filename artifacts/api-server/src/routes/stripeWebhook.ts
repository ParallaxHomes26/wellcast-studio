import type { RequestHandler } from "express";
import Stripe from "stripe";
import { getStripe, PRICE_IDS } from "../lib/stripeClient";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { logger } from "../lib/logger";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

function tierFromPriceId(priceId: string | null, foundingMember: boolean): string {
  if (foundingMember) return "founding_member";
  if (!priceId) return "trialing";
  if (priceId === PRICE_IDS.FOUNDING_MEMBER) return "founding_member";
  if ([PRICE_IDS.BASIC_MONTHLY, PRICE_IDS.BASIC_ANNUAL].includes(priceId as never)) return "basic";
  if ([PRICE_IDS.STARTER_MONTHLY, PRICE_IDS.STARTER_ANNUAL].includes(priceId as never)) return "starter";
  if ([PRICE_IDS.PRO_MONTHLY, PRICE_IDS.PRO_ANNUAL].includes(priceId as never)) return "pro";
  return "trialing";
}

const stripeWebhookHandler: RequestHandler = async (req, res) => {
  let event: Stripe.Event;

  if (webhookSecret) {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }
    try {
      event = getStripe().webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Webhook verification failed";
      logger.warn({ err }, `Stripe webhook signature verification failed: ${msg}`);
      res.status(400).json({ error: msg });
      return;
    }
  } else {
    logger.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
    event = JSON.parse((req.body as Buffer).toString()) as Stripe.Event;
  }

  logger.info({ type: event.type }, "Stripe webhook received");

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const isFoundingMember = session.metadata?.is_founding_member === "true";

        logger.info(
          {
            userId,
            sessionId: session.id,
            subscriptionId: session.subscription,
            customerId: session.customer,
            metadata: session.metadata,
          },
          "checkout.session.completed: raw session data"
        );

        if (!userId) {
          logger.warn({ sessionId: session.id }, "checkout.session.completed: no user_id in metadata — skipping");
          break;
        }

        const subscriptionId = session.subscription as string | null;
        const customerId = session.customer as string | null;

        // Single subscription retrieve — get status, price, and period end in one call
        let priceId: string | null = null;
        let subscriptionStatus = "active";
        let currentPeriodEnd: string | null = null;

        if (subscriptionId) {
          try {
            const sub = await getStripe().subscriptions.retrieve(subscriptionId);
            priceId = sub.items.data[0]?.price?.id ?? null;
            subscriptionStatus = sub.status;
            // current_period_end exists at runtime but was removed from Stripe v17+ TS types
            const periodEndTs = (sub as unknown as Record<string, unknown>)["current_period_end"] as number | undefined;
            if (periodEndTs && typeof periodEndTs === "number" && periodEndTs > 0) {
              currentPeriodEnd = new Date(periodEndTs * 1000).toISOString();
            }
            logger.info(
              { subscriptionId, priceId, subscriptionStatus, currentPeriodEnd },
              "checkout.session.completed: Stripe subscription retrieved"
            );
          } catch (err) {
            logger.warn({ err, subscriptionId }, "checkout.session.completed: failed to retrieve subscription — using active as fallback");
          }
        }

        const subscriptionTier = tierFromPriceId(priceId, isFoundingMember);

        const profileFields = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: subscriptionStatus,
          subscription_price_id: priceId,
          subscription_tier: subscriptionTier,
          current_period_end: currentPeriodEnd,
          ...(isFoundingMember ? { founding_member: true } : {}),
        };

        logger.info({ userId, profileFields }, "checkout.session.completed: writing to profiles table");

        // Try update first; Supabase returns no error even on 0 rows matched,
        // so we use .select() to detect a miss and fall back to upsert.
        const { data: updated, error: updateError } = await supabaseAdmin
          .from("profiles")
          .update(profileFields)
          .eq("id", userId)
          .select("id");

        logger.info(
          { userId, updatedRows: updated?.length ?? 0, updateError: updateError?.message ?? null },
          "checkout.session.completed: Supabase update result"
        );

        if (updateError) {
          logger.error({ userId, error: updateError.message }, "Profile update failed on checkout.session.completed");
        } else if (!updated || updated.length === 0) {
          logger.warn({ userId }, "No profile row found for update — upserting");
          const { data: upserted, error: upsertError } = await supabaseAdmin
            .from("profiles")
            .upsert({ id: userId, ...profileFields }, { onConflict: "id" })
            .select("id");
          logger.info(
            { userId, upsertedRows: upserted?.length ?? 0, upsertError: upsertError?.message ?? null },
            "checkout.session.completed: Supabase upsert result"
          );
          if (upsertError) {
            logger.error({ userId, error: upsertError.message }, "Profile upsert failed on checkout.session.completed");
          } else {
            logger.info({ userId, subscriptionId, priceId, subscriptionTier }, "Profile upserted after checkout.session.completed");
          }
        } else {
          logger.info({ userId, subscriptionId, priceId, subscriptionTier }, "Profile updated after checkout.session.completed");
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id ?? null;
        // current_period_end exists at runtime but was removed from Stripe v17+ TS types
        const periodEndTs = (sub as unknown as Record<string, unknown>)["current_period_end"] as number | undefined;
        const currentPeriodEndStr =
          periodEndTs && typeof periodEndTs === "number" && periodEndTs > 0
            ? new Date(periodEndTs * 1000).toISOString()
            : null;
        const subscriptionTier = tierFromPriceId(priceId, false);

        logger.info(
          { subscriptionId: sub.id, status: sub.status, priceId, subscriptionTier, currentPeriodEndStr },
          "customer.subscription.updated: updating profile"
        );

        const { data: updated, error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: sub.status,
            subscription_price_id: priceId,
            subscription_tier: subscriptionTier,
            current_period_end: currentPeriodEndStr,
          })
          .eq("stripe_subscription_id", sub.id)
          .select("id");

        logger.info(
          { updatedRows: updated?.length ?? 0, error: error?.message ?? null },
          "customer.subscription.updated: Supabase result"
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        logger.info({ subscriptionId: sub.id }, "customer.subscription.deleted: marking canceled");
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "canceled", subscription_tier: "canceled" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as unknown as { subscription: string }).subscription;
        if (subId) {
          logger.info({ subscriptionId: subId }, "invoice.payment_failed: marking past_due");
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      default:
        logger.info({ type: event.type }, "Unhandled Stripe event type");
    }
  } catch (err) {
    logger.error({ err, type: event.type }, "Error processing Stripe webhook event");
    res.status(500).json({ error: "Webhook handler error" });
    return;
  }

  res.json({ received: true });
};

export default stripeWebhookHandler;
