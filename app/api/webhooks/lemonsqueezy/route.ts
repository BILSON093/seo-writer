import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { addCredits } from "@/lib/usage";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  // 订单完成事件
  if (event.meta?.event_name === "order_created") {
    const userId = event.data?.attributes?.custom_data?.user_id;
    const variantId = event.data?.attributes?.first_order_item?.variant_id;

    if (userId && variantId) {
      // 根据 variantId 确定积分数量
      const packages: Record<string, number> = {
        [process.env.LEMONSQUEEZY_VARIANT_STARTER || ""]: 10,
        [process.env.LEMONSQUEEZY_VARIANT_PRO || ""]: 50,
        [process.env.LEMONSQUEEZY_VARIANT_BUSINESS || ""]: 100,
      };

      const credits = packages[variantId] || 0;
      if (credits > 0) {
        await addCredits(userId, credits);
        console.log(`Added ${credits} credits to ${userId}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
