import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { AppChannel, AppInfo, AppReview } from "@/types/store";
import { CountryCode, getPrimaryOfficialLanguage, LanguageCode } from "@/types/language";
import { appRecordCache, appRecordCreateOrUpdate, similarAppsCreateOrUpdate } from "@/models/history";
import { getUserUuid } from "@/services/user";
import { getAppDetail, getAppReviews, getSimilarApps } from "@/services/store";

const fetchReviews = async (app_id: string, channel: AppChannel, country: CountryCode, language: LanguageCode): Promise<AppReview[]> => {
  const reviews = await getAppReviews({
    channel,
    app_id,
    country: country || undefined,
    language: language || undefined,
  });

  return reviews;
};

const fetchAppDetails = async (app_id: string, channel: AppChannel, country: CountryCode, language: LanguageCode): Promise<AppInfo | null> => {
  const app = await getAppDetail({
    channel,
    app_id,
    country: country || undefined,
    language: language || undefined,
  });

  return app;
};

const fetchSimilarApps = async (app_id: string, channel: AppChannel): Promise<AppInfo[]> => {
  const apps = await getSimilarApps({
    channel,
    app_id,
  });

  return apps;
};

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
    const country = searchParams.get("country") as CountryCode | "US";
    const language = (searchParams.get("language") as LanguageCode) || getPrimaryOfficialLanguage(country);

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

    const appRecord = await appRecordCache({
      app_id: app_id,
      channel: channel,
      country: country,
    });

    if (appRecord) {
      return respData({
        appReviews: appRecord.reviews.slice(0, 100),
        appDetailsData: appRecord.details,
        similarAppsData: appRecord.similar_apps,
      });
    }

    const [appReviews, appDetailsData, similarAppsData] = await Promise.all([
      fetchReviews(app_id, channel, country, language),
      fetchAppDetails(app_id, channel, country, language),
      fetchSimilarApps(app_id, channel),
    ]);

    if (!appDetailsData) {
      return respErr("App not found");
    }

    await appRecordCreateOrUpdate({
      app_id: appDetailsData.app_id,
      bundle_id: appDetailsData.bundle_id,
      channel: channel,
      country: country || "US",
      language: language || "EN",
      name: appDetailsData.title,
      category: appDetailsData.category_name,
      category_id: appDetailsData.category_id || "",
      rating: appDetailsData.score || "",
      reviews: appReviews,
      details: appDetailsData,
      similar_apps: similarAppsData,
      report: {},
    });

    for (const app of similarAppsData) {
      await similarAppsCreateOrUpdate({
        channel,
        app_id: appDetailsData.app_id,
        app_name: appDetailsData.title,
        similar_app_id: app.app_id,
        similar_app_name: app.title,
      });
    }

    return respData({ appReviews: appReviews.slice(0, 100), appDetailsData, similarAppsData });
  } catch (error) {
    console.error("App detail API error:", error);
    return respErr("Internal server error");
  }
}
