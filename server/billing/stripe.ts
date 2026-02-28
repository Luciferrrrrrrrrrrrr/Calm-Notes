import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not set — billing features disabled");
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Plan definitions
export const PLANS = {
  free: {
    name: "Free",
    generationsPerMonth: 10,
    priceId: null,
  },
  pro: {
    name: "Pro",
    generationsPerMonth: Infinity,
    priceId: process.env.STRIPE_PRICE_ID_PRO || null,
  },
  team: {
    name: "Team",
    generationsPerMonth: Infinity,
    priceId: process.env.STRIPE_PRICE_ID_TEAM || null,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
