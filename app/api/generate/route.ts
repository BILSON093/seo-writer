import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContent } from "@/lib/mimo";
import { checkUsage, logUsage, getCredits } from "@/lib/usage";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { keyword, type, language, length } = body;

  if (!keyword || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const usage = await checkUsage(session.user.email);

  if (!usage.allowed) {
    return NextResponse.json(
      { error: "次数已用完，请购买更多次数。" },
      { status: 403 }
    );
  }

  try {
    const content = await generateContent(
      keyword,
      type,
      language || "Chinese",
      length || "medium"
    );

    await logUsage(session.user.email);

    const credits = await getCredits(session.user.email);

    return NextResponse.json({
      content,
      credits,
      freeRemaining: credits > 0 ? 0 : usage.freeRemaining - 1,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Content generation failed. Please try again." },
      { status: 500 }
    );
  }
}
