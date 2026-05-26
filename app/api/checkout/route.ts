import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckout, CREDIT_PACKAGES } from "@/lib/lemonsqueezy";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { packageId } = body;

  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg || !pkg.variantId) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  try {
    const checkoutUrl = await createCheckout(
      pkg.variantId,
      session.user.email,
      session.user.email
    );

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
