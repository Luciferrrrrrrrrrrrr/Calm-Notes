import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { LogOut, CreditCard, User, Sparkles, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user, logout } = useAuth();
  const { plan, isPro, usage, openPortal, isOpeningPortal } = useSubscription();

  const usagePercent = usage?.limit ? Math.round((usage.generations / usage.limit) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-heading font-bold">Settings</h1>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile
            </CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                {user?.firstName?.[0] || "U"}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <Button variant="destructive" onClick={() => logout()} className="w-full sm:w-auto gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Billing & Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Subscription
            </CardTitle>
            <CardDescription>Manage your plan and billing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold font-heading capitalize">{plan}</span>
                  <Badge variant={isPro ? "default" : "secondary"} className={isPro ? "bg-primary" : ""}>
                    {isPro ? "Active" : "Free Tier"}
                  </Badge>
                </div>
              </div>
              {isPro ? (
                <Button
                  variant="outline"
                  onClick={() => openPortal()}
                  disabled={isOpeningPortal}
                  className="gap-2"
                >
                  {isOpeningPortal && <Loader2 className="w-4 h-4 animate-spin" />}
                  Manage Billing
                </Button>
              ) : (
                <Link href="/pricing">
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Sparkles className="w-4 h-4" /> Upgrade
                  </Button>
                </Link>
              )}
            </div>

            {/* Usage */}
            {usage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Generations This Month</span>
                  <span className="font-medium">
                    {usage.generations} / {usage.limit ?? "∞"}
                  </span>
                </div>
                {usage.limit && (
                  <Progress value={usagePercent} className="h-2" />
                )}
                {usage.limit && usagePercent >= 80 && (
                  <p className="text-xs text-destructive">
                    {usagePercent >= 100
                      ? "Limit reached. Upgrade for unlimited generations."
                      : "Approaching limit. Consider upgrading."}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
