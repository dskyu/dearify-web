import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getSimilarApps } from "@/services/store";
import { AppChannel } from "@/types/store";
import { getUserUuid } from "@/services/user";
import { similarAppsCreateOrUpdate } from "@/models/history";

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

    // Validate required parameters
    if (!channel) {
      return respErr("channel is required");
    }

    if (!app_id) {
      return respErr("app_id is required");
    }

    if (!["apple", "google"].includes(channel)) {
      return respErr("invalid channel value");
    }

    // Call the service
    const apps = await getSimilarApps({
      channel,
      app_id,
    });

    for (const app of apps) {
      await similarAppsCreateOrUpdate({
        channel,
        app_id,
        app_name: app.title,
        similar_app_id: app.app_id,
        similar_app_name: app.title,
      });
    }

    return respData({ apps });
  } catch (error) {
    console.error("App similar API error:", error);
    return respErr("Internal server error");
  }
}
