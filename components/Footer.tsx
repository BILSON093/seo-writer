"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SEO Writer. {t("rights")}</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">{t("terms")}</a>
          <a href="#" className="hover:text-foreground transition-colors">{t("privacy")}</a>
          <a href="mailto:support@example.com" className="hover:text-foreground transition-colors">{t("contact")}</a>
        </div>
      </div>
    </footer>
  );
}
