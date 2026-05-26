import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Writer",
  description: "AI SEO Content Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
