import type { RequestHandler } from "express";
import Stripe from "stripe";
import { getStripe } from "../lib/stripeClient";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { logger } from "../lib/logger";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

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
        if (!userId) break;

        const subscriptionId = session.subscription as string | null;
        const customerId = session.customer as string | null;

        // Fetch the full subscription so we can read price ID and period end
        let priceId: string | null = null;
        let currentPeriodEnd: string | null = null;
        if (subscriptionId) {
          try {
            const sub = await getStripe().subscriptions.retrieve(subscriptionId);
            priceId = sub.items.data[0]?.price?.id ?? null;
            const periodEndTs = sub.current_period_end;
            if (periodEndTs && typeof periodEndTs === "number" && periodEndTs > 0) {
              currentPeriodEnd = new Date(periodEndTs * 1000).toISOString();
            }
          } catch (err) {
            logger.warn({ err, subscriptionId }, "Failed to retrieve subscription for checkout.session.completed");
          }
        }

        // Use actual Stripe subscription status — during trial it's "trialing",
        // not "active". getSubscriptionTier handles paid-trialing correctly.
        let subscriptionStatus = "active";
        if (subscriptionId) {
          try {
            const statusSub = await getStripe().subscriptions.retrieve(subscriptionId);
            subscriptionStatus = statusSub.status;
          } catch {
            // already retrieved above; use "active" as safe fallback
          }
        }

        const profileFields = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: subscriptionStatus,
          subscription_price_id: priceId,
          current_period_end: currentPeriodEnd,
          ...(isFoundingMember ? { founding_member: true } : {}),
        };

        // Try update first; Supabase returns no error even on 0 rows matched,
        // so we use .select() to detect a miss and fall back to upsert.
        const { data: updated, error: updateError } = await supabaseAdmin
          .from("profiles")
          .update(profileFields)
          .eq("id", userId)
          .select("id");

        if (updateError) {
          logger.error({ userId, error: updateError.message }, "Profile update failed on checkout.session.completed");
        } else if (!updated || updated.length === 0) {
          // No existing row matched — upsert to create it
          logger.warn({ userId }, "No profile row found for update — upserting");
          const { error: upsertError } = await supabaseAdmin
            .from("profiles")
            .upsert({ id: userId, ...profileFields }, { onConflict: "id" });
          if (upsertError) {
            logger.error({ userId, error: upsertError.message }, "Profile upsert failed on checkout.session.completed");
          } else {
            logger.info({ userId, subscriptionId, priceId }, "Profile upserted after checkout.session.completed");
          }
        } else {
          logger.info({ userId, subscriptionId, priceId }, "Profile updated after checkout.session.completed");
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id ?? null;
        const periodEndTs = sub.current_period_end;
        const currentPeriodEndStr =
          periodEndTs && typeof periodEndTs === "number" && periodEndTs > 0
            ? new Date(periodEndTs * 1000).toISOString()
            : null;

        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: sub.status,
            subscription_price_id: priceId,
            current_period_end: currentPeriodEndStr,
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "canceled" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as unknown as { subscription: string }).subscription;
        if (subId) {
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
