import { useQuery, useMutation } from "@tanstack/react-query";

export interface SubscriptionData {
  plan: "free" | "pro" | "team";
  status: string;
  currentPeriodEnd: string | null;
  usage: {
    generations: number;
    limit: number | null; // null = unlimited
    periodStart: string | null;
  };
}

export function useSubscription() {
  const { data, isLoading } = useQuery<SubscriptionData>({
    queryKey: ["/api/billing/subscription"],
    queryFn: async () => {
      const res = await fetch("/api/billing/subscription", { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json();
    },
    staleTime: 1000 * 60 * 2, // 2 min
  });

  const checkoutMutation = useMutation({
    mutationFn: async (plan: "pro" | "team") => {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Checkout failed");
      }
      const { url } = await res.json();
      window.location.href = url;
    },
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to open billing portal");
      }
      const { url } = await res.json();
      window.location.href = url;
    },
  });

  return {
    subscription: data,
    isLoading,
    plan: data?.plan || "free",
    isPro: data?.plan === "pro" || data?.plan === "team",
    usage: data?.usage,
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
    openPortal: portalMutation.mutate,
    isOpeningPortal: portalMutation.isPending,
  };
}
