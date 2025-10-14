import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { searchApps } from "@/services/store";
import { AppChannel } from "@/types/store";
import { CountryCode, LanguageCode } from "@/types/language";
import { getUserUuid } from "@/services/user";
import { keywordSearchCreateRecord } from "@/models/history";

export async function GET(request: NextRequest) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const channel = searchParams.get("channel") as AppChannel;
    const keyword = searchParams.get("keyword");
    const country = searchParams.get("country") as CountryCode | null;
    const language = searchParams.get("language") as LanguageCode | null;

    // Validate required parameters
    if (!channel) {
      return respErr("channel is required");
    }

    if (!keyword) {
      return respErr("keyword is required");
    }

    if (!["apple", "google"].includes(channel)) {
      return respErr("invalid channel value");
    }

    const apps = await searchApps({
      channel,
      keyword: keyword.trim(),
      country: country || undefined,
      language: language || undefined,
    });

    await keywordSearchCreateRecord({
      user_uuid: user_uuid,
      keyword: keyword.trim(),
    });

    return respData({ apps });
  } catch (error) {
    console.error("App search API error:", error);
    return respErr("Internal server error");
  }
}
