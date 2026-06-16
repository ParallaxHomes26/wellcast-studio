import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { getStripe, getAppUrl } from "../lib/stripeClient";
import { supabaseAdmin } from "../lib/supabaseAdmin";

const router: IRouter = Router();

const CreateCustomerBody = z.object({ user_id: z.string() });
const CreateCheckoutBody = z.object({
  user_id: z.string(),
  price_id: z.string(),
  is_founding_member: z.boolean().optional().default(false),
});
const BillingPortalBody = z.object({ user_id: z.string() });

router.post("/stripe/create-customer", async (req, res): Promise<void> => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { user_id } = parsed.data;
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id, email, first_name")
    .eq("id", user_id)
    .single();
  if (profileError || !profile) {
    req.log.error({ user_id, profileError: profileError?.message, profile }, "Profile not found in create-customer");
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  if (profile.stripe_customer_id) {
    res.json({ customer_id: profile.stripe_customer_id });
    return;
  }
  const customer = await getStripe().customers.create({
    email: profile.email ?? undefined,
    name: profile.first_name ?? undefined,
    metadata: { supabase_user_id: user_id },
  });
  await supabaseAdmin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", user_id);
  res.json({ customer_id: customer.id });
});

router.post("/stripe/create-checkout", async (req, res): Promise<void> => {
  const parsed = CreateCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { user_id, price_id, is_founding_member } = parsed.data;
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id, email, first_name")
    .eq("id", user_id)
    .single();
  if (profileError || !profile) {
    req.log.error({ user_id, profileError: profileError?.message, profile }, "Profile not found in create-checkout");
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  let customerId = profile.stripe_customer_id;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: profile.email ?? undefined,
      name: profile.first_name ?? undefined,
      metadata: { supabase_user_id: user_id },
    });
    customerId = customer.id;
    await supabaseAdmin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user_id);
  }
  const appUrl = getAppUrl();
  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: price_id, quantity: 1 }],
    mode: "subscription",
    subscription_data: { trial_period_days: 7 },
    success_url: `${appUrl}/dashboard?subscription=success`,
    cancel_url: `${appUrl}/pricing`,
    metadata: {
      user_id,
      is_founding_member: String(is_founding_member),
    },
  });
  res.json({ url: session.url });
});

router.post("/stripe/billing-portal", async (req, res): Promise<void> => {
  const parsed = BillingPortalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { user_id } = parsed.data;
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user_id)
    .single();
  if (profileError || !profile?.stripe_customer_id) {
    res.status(400).json({ error: "No billing account found" });
    return;
  }
  const appUrl = getAppUrl();
  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/account`,
  });
  res.json({ url: portalSession.url });
});

export default router;