import type { Express } from "express";
import { isAuthenticated } from "../auth";
import { stripe, PLANS, type PlanKey } from "./stripe";
import { db } from "../db";
import { subscriptions, usage, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User } from "@shared/models/auth";

export function registerBillingRoutes(app: Express) {
  // ─── Get current subscription ───────────────────────────────
  app.get("/api/billing/subscription", isAuthenticated, async (req, res) => {
    const userId = (req.user as User).id;
    const sub = await getUserSubscription(userId);
    const userUsage = await getUserUsage(userId);

    const plan = (sub?.plan || "free") as PlanKey;
    const limit = PLANS[plan]?.generationsPerMonth ?? PLANS.free.generationsPerMonth;

    res.json({
      plan,
      status: sub?.status || "active",
      currentPeriodEnd: sub?.currentPeriodEnd || null,
      usage: {
        generations: userUsage?.generationsCount || 0,
        limit: limit === Infinity ? null : limit, // null = unlimited
        periodStart: userUsage?.periodStart || null,
      },
    });
  });

  // ─── Create checkout session ────────────────────────────────
  app.post("/api/billing/checkout", isAuthenticated, async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Billing not configured" });
    }

    const { plan } = req.body as { plan: PlanKey };
    const priceId = PLANS[plan]?.priceId;

    if (!priceId) {
      return res.status(400).json({ message: "Invalid plan or price not configured" });
    }

    const user = req.user as User;
    let customerId = await getOrCreateStripeCustomer(user);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getBaseUrl(req)}/settings?billing=success`,
      cancel_url: `${getBaseUrl(req)}/pricing`,
      metadata: { userId: user.id, plan },
    });

    res.json({ url: session.url });
  });

  // ─── Customer portal ────────────────────────────────────────
  app.post("/api/billing/portal", isAuthenticated, async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Billing not configured" });
    }

    const userId = (req.user as User).id;
    const sub = await getUserSubscription(userId);

    if (!sub?.stripeCustomerId) {
      return res.status(400).json({ message: "No billing account found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${getBaseUrl(req)}/settings`,
    });

    res.json({ url: session.url });
  });

  // ─── Stripe webhook ─────────────────────────────────────────
  app.post("/api/webhooks/stripe", async (req, res) => {
    if (!stripe) {
      return res.status(503).send("Billing not configured");
    }

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not set");
      return res.status(500).send("Webhook secret not configured");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody as Buffer, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan || "pro";
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;

          if (userId && subscriptionId) {
            // Get subscription details for period end
            const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
            await db
              .insert(subscriptions)
              .values({
                id: subscriptionId,
                userId,
                stripeCustomerId: customerId,
                plan,
                status: "active",
                currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
              })
              .onConflictDoUpdate({
                target: subscriptions.userId,
                set: {
                  id: subscriptionId,
                  stripeCustomerId: customerId,
                  plan,
                  status: "active",
                  currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                  updatedAt: new Date(),
                },
              });

            // Reset usage on new subscription
            await db
              .insert(usage)
              .values({ userId, generationsCount: 0, periodStart: new Date() })
              .onConflictDoUpdate({
                target: usage.userId,
                set: { generationsCount: 0, periodStart: new Date() },
              });
          }
          break;
        }

        case "customer.subscription.updated": {
          const sub = event.data.object;
          const existingSub = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.id, sub.id));

          if (existingSub.length > 0) {
            await db
              .update(subscriptions)
              .set({
                status: sub.status === "active" ? "active" : sub.status === "past_due" ? "past_due" : "canceled",
                currentPeriodEnd: new Date(sub.current_period_end * 1000),
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.id, sub.id));
          }
          break;
        }

        case "customer.subscription.deleted": {
          const sub = event.data.object;
          await db
            .update(subscriptions)
            .set({ status: "canceled", plan: "free", updatedAt: new Date() })
            .where(eq(subscriptions.id, sub.id));
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          const subId = invoice.subscription as string;
          if (subId) {
            await db
              .update(subscriptions)
              .set({ status: "past_due", updatedAt: new Date() })
              .where(eq(subscriptions.id, subId));
          }
          break;
        }
      }
    } catch (err) {
      console.error("Webhook handler error:", err);
      return res.status(500).send("Webhook handler failed");
    }

    res.json({ received: true });
  });
}

// ─── Helpers ──────────────────────────────────────────────────

export async function getUserSubscription(userId: string) {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  return sub || null;
}

export async function getUserUsage(userId: string) {
  const [u] = await db.select().from(usage).where(eq(usage.userId, userId));

  // Auto-reset if period is older than 30 days
  if (u && u.periodStart) {
    const daysSincePeriodStart = (Date.now() - u.periodStart.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePeriodStart >= 30) {
      const [reset] = await db
        .update(usage)
        .set({ generationsCount: 0, periodStart: new Date() })
        .where(eq(usage.userId, userId))
        .returning();
      return reset;
    }
  }

  return u || null;
}

async function getOrCreateStripeCustomer(user: User): Promise<string> {
  // Check if user already has a subscription with a customer ID
  const sub = await getUserSubscription(user.id);
  if (sub?.stripeCustomerId) return sub.stripeCustomerId;

  // Create new Stripe customer
  const customer = await stripe!.customers.create({
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
    metadata: { userId: user.id },
  });

  return customer.id;
}

function getBaseUrl(req: any): string {
  return process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
}
