import Stripe from "stripe";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });
}

export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "入门包",
    nameEn: "Starter",
    credits: 10,
    price: "$4.99",
    priceId: process.env.STRIPE_PRICE_STARTER || "",
    popular: false,
  },
  {
    id: "pro",
    name: "专业包",
    nameEn: "Pro",
    credits: 50,
    price: "$19.99",
    priceId: process.env.STRIPE_PRICE_PRO || "",
    popular: true,
  },
  {
    id: "business",
    name: "商业包",
    nameEn: "Business",
    credits: 100,
    price: "$29.99",
    priceId: process.env.STRIPE_PRICE_BUSINESS || "",
    popular: false,
  },
];
