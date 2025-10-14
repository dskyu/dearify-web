import { AppInfo, AppReview, AppChannel, AppleAppCategory, AppleAppCollection, GoogleAppCategory, GoogleAppCollection, AppDeveloper } from "@/types/store";
import { CountryCode, getPrimaryOfficialLanguage, LanguageCode } from "@/types/language";

export interface AppListParams {
  channel: AppChannel;
  apple_category?: AppleAppCategory;
  apple_collection?: AppleAppCollection;
  google_category?: GoogleAppCategory;
  google_collection?: GoogleAppCollection;
  country?: CountryCode;
  language?: LanguageCode;
}

export interface AppSearchParams {
  channel: AppChannel;
  keyword: string;
  country?: CountryCode;
  language?: LanguageCode;
}

export interface AppDetailParams {
  channel: AppChannel;
  app_id: string;
  country?: CountryCode;
  language?: LanguageCode;
}

export interface AppReviewParams {
  channel: AppChannel;
  app_id: string;
  country?: CountryCode;
  language?: LanguageCode;
}

export interface AppSimilarParams {
  channel: AppChannel;
  app_id: string;
}

async function httpGet(path: string, params: Record<string, string>) {
  const url = "https://reviewapi.snstracker.com/v1" + path;

  // Build URL with query parameters
  const urlObj = new URL(url);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlObj.searchParams.append(key, value);
    }
  });

  // Make the HTTP request
  try {
    const res = await fetch(urlObj.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("HTTP GET request failed:", error);
    throw error;
  }
}

// App List API
export async function getAppList(params: AppListParams): Promise<AppInfo[]> {
  const apiParams: Record<string, string> = {
    channel: params.channel,
  };

  if (params.country) {
    apiParams.country = params.country;
  } else {
    apiParams.country = "US";
  }
  if (params.language) {
    apiParams.language = params.language;
  } else {
    apiParams.language = getPrimaryOfficialLanguage(apiParams.country as CountryCode);
  }

  if (params.apple_category !== undefined) {
    apiParams.apple_category = String(params.apple_category);
  }
  if (params.apple_collection) {
    apiParams.apple_collection = params.apple_collection;
  }
  if (params.google_category) {
    apiParams.google_category = params.google_category;
  }
  if (params.google_collection) {
    apiParams.google_collection = params.google_collection;
  }

  try {
    const response = await httpGet("/app/list", apiParams);
    return response.data.apps || [];
  } catch (error) {
    console.error("Failed to fetch app list:", error);
    throw error;
  }
}

// App Search API
export async function searchApps(params: AppSearchParams): Promise<AppInfo[]> {
  const apiParams: Record<string, string> = {
    channel: params.channel,
    keyword: params.keyword,
  };

  if (params.country) {
    apiParams.country = params.country;
  } else {
    apiParams.country = "US";
  }
  if (params.language) {
    apiParams.language = params.language;
  } else {
    apiParams.language = getPrimaryOfficialLanguage(apiParams.country as CountryCode);
  }

  try {
    const response = await httpGet("/app/search", apiParams);
    return response.data.apps || [];
  } catch (error) {
    console.error("Failed to search apps:", error);
    // Fallback to mock data in case of API failure
    throw error;
  }
}

// App Detail API
export async function getAppDetail(params: AppDetailParams): Promise<AppInfo | null> {
  const apiParams: Record<string, string> = {
    channel: params.channel,
    app_id: params.app_id,
  };

  if (params.country) {
    apiParams.country = params.country;
  } else {
    apiParams.country = "US";
  }
  if (params.language) {
    apiParams.language = params.language;
  } else {
    apiParams.language = getPrimaryOfficialLanguage(apiParams.country as CountryCode);
  }

  try {
    const response = await httpGet(`/app/${params.app_id}`, apiParams);
    return response.data.app || null;
  } catch (error) {
    console.error("Failed to fetch app detail:", error);
    throw error;
  }
}

// App Reviews API
export async function getAppReviews(params: AppReviewParams): Promise<AppReview[]> {
  const apiParams: Record<string, string> = {
    channel: params.channel,
    app_id: params.app_id,
  };

  if (params.country) {
    apiParams.country = params.country;
  } else {
    apiParams.country = "US";
  }
  if (params.language) {
    apiParams.language = params.language;
  } else {
    apiParams.language = getPrimaryOfficialLanguage(apiParams.country as CountryCode);
  }

  try {
    const response = await httpGet(`/app/${params.app_id}/reviews`, apiParams);
    return response.data.reviews || [];
  } catch (error) {
    console.error("Failed to fetch app reviews:", error);
    throw error;
  }
}

// App Similar API
export async function getSimilarApps(params: AppSimilarParams): Promise<AppInfo[]> {
  const apiParams: Record<string, string> = {
    channel: params.channel,
    app_id: params.app_id,
  };

  try {
    const response = await httpGet(`/app/${params.app_id}/similar`, apiParams);
    return response.data.apps || [];
  } catch (error) {
    console.error("Failed to fetch similar apps:", error);
    throw error;
  }
}
