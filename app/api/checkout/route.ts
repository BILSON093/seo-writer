import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripe, CREDIT_PACKAGES } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { packageId } = body;

  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg || !pkg.priceId) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: "payment",
      payment_method_types: ["card", "alipay", "wechat_pay"],
      payment_method_options: {
        wechat_pay: { client: "web" },
      },
      line_items: [
        {
          price: pkg.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?purchased=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.email,
        credits: pkg.credits.toString(),
        packageId: pkg.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
