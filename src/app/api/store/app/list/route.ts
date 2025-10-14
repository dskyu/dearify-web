import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getAppList } from "@/services/store";
import { AppChannel, AppleAppCategory, AppleAppCollection, GoogleAppCategory, GoogleAppCollection } from "@/types/store";
import { CountryCode, LanguageCode } from "@/types/language";
import { getUserUuid } from "@/services/user";

export async function GET(request: NextRequest) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const channel = searchParams.get("channel") as AppChannel;
    const apple_category = searchParams.get("apple_category") as AppleAppCategory | null;
    const apple_collection = searchParams.get("apple_collection") as AppleAppCollection | null;
    const google_category = searchParams.get("google_category") as GoogleAppCategory | null;
    const google_collection = searchParams.get("google_collection") as GoogleAppCollection | null;
    const country = searchParams.get("country") as CountryCode | null;
    const language = searchParams.get("language") as LanguageCode | null;

    // Validate required parameters
    if (!channel) {
      return respErr("channel is required");
    }

    if (!["apple", "google"].includes(channel)) {
      return respErr("invalid channel value");
    }

    const apps = await getAppList({
      channel,
      apple_category: apple_category || undefined,
      apple_collection: apple_collection || undefined,
      google_category: google_category || undefined,
      google_collection: google_collection || undefined,
      country: country || undefined,
      language: language || undefined,
    });

    return respData({ apps });
  } catch (error) {
    console.error("App list API error:", error);
    return respErr("Internal server error");
  }
}
