import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { respErr, respData } from "@/lib/resp";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    // 验证用户身份
    const session = await auth();
    if (!session?.user) {
      return respErr("Unauthorized");
    }

    if (!OPENROUTER_API_KEY) {
      return respErr("OpenRouter API key not configured");
    }

    // 调用OpenRouter API获取模型列表
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter models API error:", response.status, errorText);
      return respErr(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return respData(data.data || []);
  } catch (error) {
    console.error("Models API error:", error);
    return respErr("Internal server error");
  }
}
