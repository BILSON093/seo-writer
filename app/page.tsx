"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: "📝",
    title: "SEO Articles",
    description: "Generate comprehensive, keyword-optimized articles that rank on Google.",
  },
  {
    icon: "🏷️",
    title: "Meta Tags",
    description: "Create compelling title tags and meta descriptions that boost click-through rates.",
  },
  {
    icon: "💡",
    title: "Title Ideas",
    description: "Get 20+ creative title suggestions optimized for search and social media.",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");

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
      {/* Hero */}
      <section className="py-20 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Write SEO Content
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              10x Faster with AI
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate SEO-optimized articles, meta tags, and title ideas in seconds.
            Boost your search rankings without the writing struggle.
          </p>
          <form onSubmit={handleLogin} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email to start"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              required
            />
            <Button size="lg" type="submit" className="text-base px-8">
              Start Free
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. 3 free generations daily.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for SEO Content
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background rounded-lg p-6 shadow-sm border"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", title: "Enter Keyword", desc: "Type your target keyword or topic." },
              { step: "2", title: "Choose Type", desc: "Select article, meta tags, or title ideas." },
              { step: "3", title: "Get Content", desc: "AI generates SEO-optimized content instantly." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <PricingCard
              title="Free"
              price="Free"
              description="Perfect for trying out"
              features={[
                "3 generations per day",
                "All content types",
                "All languages",
                "Copy & download",
              ]}
              cta="Get Started"
              onClick={() => {
                const el = document.querySelector("input[type=email]") as HTMLInputElement;
                if (el) el.focus();
              }}
            />
            <PricingCard
              title="Pro"
              price="$9.99"
              description="For serious content creators"
              features={[
                "Unlimited generations",
                "All content types",
                "All languages",
                "Priority generation",
                "Export to multiple formats",
              ]}
              popular
              cta="Coming Soon"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
