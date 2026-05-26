import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkUsage } from "@/lib/usage";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await checkUsage(session.user.email);

  return NextResponse.json({
    remaining: usage.remaining,
    isPro: usage.isPro,
  });
}
