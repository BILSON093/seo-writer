"use client";

import { useSession, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const packages = [
  { id: "starter", credits: 10, price: "$4.99", perCredit: "$0.50" },
  { id: "pro", credits: 50, price: "$19.99", perCredit: "$0.40", popular: true },
  { id: "business", credits: 100, price: "$29.99", perCredit: "$0.30" },
];

export default function Pricing() {
  const { data: session } = useSession();
  const t = useTranslations("pricingSection");
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (packageId: string) => {
    if (!session) {
      signIn();
      return;
    }

    setLoading(packageId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {/* Free Card */}
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("free.title")}</CardTitle>
            <div className="mt-3">
              <span className="text-3xl font-bold">{t("free.cta") === "免费开始" ? "免费" : "Free"}</span>
            </div>
            <CardDescription>{t("free.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-2 flex-1 text-sm">
              {t.raw("free.features").map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full mt-4" onClick={() => signIn()}>
              {t("free.cta")}
            </Button>
          </CardContent>
        </Card>

        {/* Paid Packages */}
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`relative flex flex-col ${pkg.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}>
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                {t("popular")}
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t(`${pkg.id}.title`)}</CardTitle>
              <div className="mt-3">
                <span className="text-3xl font-bold">{pkg.price}</span>
              </div>
              <CardDescription>
                {pkg.credits} {t("credits")} · {pkg.perCredit}/{t("perCredit")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 flex-1 text-sm">
                {t.raw(`${pkg.id}.features`).map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-4"
                variant={pkg.popular ? "default" : "outline"}
                onClick={() => handleBuy(pkg.id)}
                disabled={loading === pkg.id}
              >
                {loading === pkg.id ? "..." : t("buyNow")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        {t("subtitle")}
      </p>
    </div>
  );
}
