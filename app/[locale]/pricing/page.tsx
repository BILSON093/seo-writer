"use client";

import { useSession, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import PricingCard from "@/components/PricingCard";

export default function Pricing() {
  const { data: session } = useSession();
  const t = useTranslations("pricingSection");

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
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Start for free, upgrade when you need more. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <PricingCard
          title={t("free.title")}
          price="Free"
          description={t("free.desc")}
          features={t.raw("free.features")}
          cta={t("free.cta")}
          onClick={() => signIn()}
        />
        <PricingCard
          title={t("pro.title")}
          price="$9.99"
          description={t("pro.desc")}
          features={t.raw("pro.features")}
          popular
          cta={t("pro.cta")}
          onClick={handleCheckout}
        />
      </div>
    </div>
  );
}
