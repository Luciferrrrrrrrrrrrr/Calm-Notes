import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey(), // Stripe subscription ID
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  stripeCustomerId: varchar("stripe_customer_id").notNull(),
  plan: varchar("plan").notNull().default("free"), // "free" | "pro" | "team"
  status: varchar("status").notNull().default("active"), // "active" | "canceled" | "past_due" | "trialing"
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usage = pgTable("usage", {
  userId: varchar("user_id")
    .primaryKey()
    .references(() => users.id),
  generationsCount: integer("generations_count").notNull().default(0),
  periodStart: timestamp("period_start").notNull().defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Usage = typeof usage.$inferSelect;
