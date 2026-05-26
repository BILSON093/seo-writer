import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Pro upgrade coming soon! Enjoy free tier for now." },
    { status: 501 }
  );
}
