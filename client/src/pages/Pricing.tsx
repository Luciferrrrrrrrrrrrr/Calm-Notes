import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const plans = [
  {
    key: "free" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with clinical documentation",
    features: [
      "10 AI note generations / month",
      "SOAP, DAP & BIRP formats",
      "Secure cloud storage",
      "Copy to clipboard",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    key: "pro" as const,
    name: "Pro",
    price: "$29",
    period: "/ month",
    description: "For active clinicians who need unlimited access",
    features: [
      "Unlimited AI generations",
      "All documentation formats",
      "Priority AI processing",
      "PDF & DOCX export",
      "Client longitudinal summaries",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    key: "team" as const,
    name: "Team",
    price: "$79",
    period: "/ month",
    description: "For group practices with multiple clinicians",
    features: [
      "Everything in Pro",
      "Up to 10 clinicians",
      "Shared client records",
      "Admin dashboard",
      "HIPAA BAA available",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  const { plan: currentPlan, checkout, isCheckingOut } = useSubscription();
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-3">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you need unlimited AI-powered clinical documentation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.key === currentPlan;
            return (
              <Card
                key={plan.key}
                className={cn(
                  "relative flex flex-col border-border/50",
                  plan.highlighted && "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold font-heading">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button variant="outline" disabled className="w-full rounded-xl">
                      Current Plan
                    </Button>
                  ) : plan.key === "team" ? (
                    <Button variant="outline" className="w-full rounded-xl" asChild>
                      <a href="mailto:support@calmnotes.app">Contact Sales</a>
                    </Button>
                  ) : plan.key === "pro" ? (
                    <Button
                      className={cn(
                        "w-full rounded-xl gap-2",
                        plan.highlighted && "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                      )}
                      onClick={() => checkout("pro")}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full rounded-xl">
                      {plan.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include end-to-end encryption and secure cloud storage. Cancel anytime.
        </p>
      </div>
    </Layout>
  );
}
