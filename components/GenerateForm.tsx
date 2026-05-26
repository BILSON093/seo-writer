"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GenerateFormProps {
  remaining: number;
  isPro: boolean;
}

export default function GenerateForm({ remaining, isPro }: GenerateFormProps) {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<"article" | "meta" | "titles">("article");
  const [language, setLanguage] = useState("Chinese");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const t = useTranslations("dashboard.generate");
  const tCommon = useTranslations("common");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, type, language, length }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data.content);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${keyword.replace(/\s+/g, "-")}-${type}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("title")}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {isPro ? (
                <span className="text-green-600 font-medium">{t("proUnlimited")}</span>
              ) : (
                t("freeLeft", { count: remaining })
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">{t("keyword")}</Label>
              <Input
                id="keyword"
                placeholder={t("keywordPlaceholder")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t("contentType")}</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                >
                  <option value="article">{t("article")}</option>
                  <option value="meta">{t("meta")}</option>
                  <option value="titles">{t("titles")}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>{t("language")}</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="Chinese">中文</option>
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                  <option value="Japanese">日本語</option>
                  <option value="Korean">한국어</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>{t("length")}</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={length}
                  onChange={(e) => setLength(e.target.value as typeof length)}
                >
                  <option value="short">{t("short")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="long">{t("long")}</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || (!isPro && remaining <= 0)}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("generating")}
                </span>
              ) : !isPro && remaining <= 0 ? (
                t("limitReached")
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">{t("result")}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {tCommon("copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                {tCommon("download")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[400px] font-mono text-sm"
              value={result}
              readOnly
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
