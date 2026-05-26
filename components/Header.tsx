"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Header() {
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const t = useTranslations();
  const pathname = usePathname();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      signIn("credentials", { email, callbackUrl: "/dashboard" });
    }
  };

  const switchLocale = (locale: string) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    window.location.reload();
  };

  const currentLocale = pathname.startsWith("/en") ? "en" : "zh";

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SEO Writer
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("common.features")}
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("common.pricing")}
          </Link>
          {session && (
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("common.dashboard")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => switchLocale(currentLocale === "zh" ? "en" : "zh")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
          >
            {currentLocale === "zh" ? "EN" : "中文"}
          </button>

          {session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                {t("common.signOut")}
              </Button>
            </>
          ) : showLogin ? (
            <form onSubmit={handleLogin} className="flex gap-2">
              <Input
                type="email"
                placeholder={t("common.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 w-48 text-sm"
                required
                autoFocus
              />
              <Button size="sm" type="submit">{t("common.go")}</Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => setShowLogin(false)}>✕</Button>
            </form>
          ) : (
            <Button size="sm" onClick={() => setShowLogin(true)}>
              {t("common.signIn")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
