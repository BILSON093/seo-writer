// LemonSqueezy API 配置
export const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY || "";
export const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || "";
export const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

// 产品配置（在 LemonSqueezy 后台创建产品后填入 Variant ID）
export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "入门包",
    nameEn: "Starter",
    credits: 10,
    price: "$4.99",
    variantId: process.env.LEMONSQUEEZY_VARIANT_STARTER || "",
    popular: false,
  },
  {
    id: "pro",
    name: "专业包",
    nameEn: "Pro",
    credits: 50,
    price: "$19.99",
    variantId: process.env.LEMONSQUEEZY_VARIANT_PRO || "",
    popular: true,
  },
  {
    id: "business",
    name: "商业包",
    nameEn: "Business",
    credits: 100,
    price: "$29.99",
    variantId: process.env.LEMONSQUEEZY_VARIANT_BUSINESS || "",
    popular: false,
  },
];

// 创建结账链接
export async function createCheckout(variantId: string, email: string, userId: string) {
  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email,
            custom: { user_id: userId },
          },
          product_options: {
            redirect_url: `${process.env.NEXTAUTH_URL}/dashboard?purchased=true`,
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: LEMONSQUEEZY_STORE_ID },
          },
          variant: {
            data: { type: "variants", id: variantId },
          },
        },
      },
    }),
  });

  const data = await res.json();
  return data.data?.attributes?.url;
}

// 验证 Webhook 签名
import crypto from "crypto";

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
