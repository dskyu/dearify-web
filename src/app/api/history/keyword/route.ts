import { NextRequest, NextResponse } from "next/server";
import { keywordSearchGetPopularKeywords } from "@/models/history";
import { respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";

export async function GET(request: NextRequest) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const records = await keywordSearchGetPopularKeywords(limit);

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Error fetching keyword search history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
