"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const t = useTranslations();
  const tHero = useTranslations("hero");
  const tFeatures = useTranslations("features");
  const tHow = useTranslations("howItWorks");
  const tPricing = useTranslations("pricingSection");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      signIn("credentials", { email, callbackUrl: "/dashboard" });
    }
  };

  return (
    <div className="flex flex-col">
      <section className="py-20 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {tHero("title1")}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tHero("title2")}
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {tHero("subtitle")}
          </p>
          <form onSubmit={handleLogin} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder={tHero("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              required
            />
            <Button size="lg" type="submit" className="text-base px-8">
              {tHero("cta")}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            {tHero("noCard")}
          </p>
        </div>
      </section>

      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{tFeatures("title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📝", key: "seoArticles" },
              { icon: "🏷️", key: "metaTags" },
              { icon: "💡", key: "titleIdeas" },
            ].map((feature) => (
              <div key={feature.key} className="bg-background rounded-lg p-6 shadow-sm border">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tFeatures(`${feature.key}.title`)}</h3>
                <p className="text-muted-foreground">{tFeatures(`${feature.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{tHow("title")}</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {["step1", "step2", "step3"].map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{tHow(`${step}.title`)}</h3>
                <p className="text-muted-foreground">{tHow(`${step}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{tPricing("title")}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <PricingCard
              title={tPricing("free.title")}
              price={t("common.free")}
              description={tPricing("free.desc")}
              features={tPricing.raw("free.features")}
              cta={tPricing("free.cta")}
              onClick={() => {
                const el = document.querySelector("input[type=email]") as HTMLInputElement;
                if (el) el.focus();
              }}
            />
            <PricingCard
              title={tPricing("pro.title")}
              price="$9.99"
              description={tPricing("pro.desc")}
              features={tPricing.raw("pro.features")}
              popular
              cta={tPricing("pro.cta")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
