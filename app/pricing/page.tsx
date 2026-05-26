"use client";

import { useSession, signIn } from "next-auth/react";
import PricingCard from "@/components/PricingCard";

export default function Pricing() {
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (!session) {
      signIn();
      return;
    }
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Start for free, upgrade when you need more. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <PricingCard
          title="Free"
          price="Free"
          description="Perfect for trying out"
          features={[
            "3 generations per day",
            "All content types (Article, Meta, Titles)",
            "All languages supported",
            "Copy & download results",
            "Basic support",
          ]}
          cta="Get Started Free"
          onClick={() => signIn()}
        />
        <PricingCard
          title="Pro"
          price="$9.99"
          description="For serious content creators"
          features={[
            "Unlimited generations",
            "All content types",
            "All languages supported",
            "Priority generation speed",
            "Export to Markdown, HTML, TXT",
            "Priority email support",
            "Cancel anytime",
          ]}
          popular
          cta="Upgrade to Pro"
          onClick={handleCheckout}
        />
      </div>
    </div>
  );
}
