import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getAppDetail } from "@/services/store";
import { AppChannel } from "@/types/store";
import { CountryCode, LanguageCode } from "@/types/language";
import { getUserUuid } from "@/services/user";

export async function GET(request: NextRequest, { params }: { params: Promise<{ app_id: string }> }) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const { searchParams } = new URL(request.url);

    // Extract path and query parameters
    const app_id = (await params).app_id;
    const channel = searchParams.get("channel") as AppChannel;
    const country = searchParams.get("country") as CountryCode | null;
    const language = searchParams.get("language") as LanguageCode | null;

    // Validate required parameters
    if (!channel) {
      return respErr("channel is required");
    }

    if (!app_id) {
      return respErr("app_id is required");
    }

    if (!["apple", "google", "all"].includes(channel)) {
      return respErr("invalid channel value");
    }

    // Call the service
    const app = await getAppDetail({
      channel,
      app_id,
      country: country || undefined,
      language: language || undefined,
    });

    if (!app) {
      return respErr("App not found");
    }

    return respData({ app });
  } catch (error) {
    console.error("App detail API error:", error);
    return respErr("Internal server error");
  }
}
