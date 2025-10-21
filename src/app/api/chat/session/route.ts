import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";

import { getUserUuid } from "@/services/user";

export async function POST(req: NextRequest) {
  try {
    // 验证用户身份
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const { type, icon, name, details } = await req.json();

    if (!icon || !name || !details) {
      return respErr("icon, name and details are required");
    }

    return respData({
      session_uuid: "",
    });
  } catch (error) {
    console.error("Get chat session error:", error);
    return respErr("Internal server error");
  }
}

export async function GET(req: NextRequest) {
  try {
    // 验证用户身份
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    // 获取查询参数
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // 获取用户的聊天会话列表
    const sessions = await [];

    return respData(sessions);
  } catch (error) {
    console.error("Get chat sessions error:", error);
    return respErr("Internal server error");
  }
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
