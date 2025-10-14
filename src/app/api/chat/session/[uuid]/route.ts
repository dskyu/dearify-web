import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { respData, respErr } from "@/lib/resp";
import { chatSessionGetByUuid, chatHistoryGetBySession, chatHistoryCreate } from "@/models/chat";
import { getUserUuid } from "@/services/user";
import { ChatSessionAppInfo, ChatSessionCompareDetails } from "@/types/chat";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uuid: string }> }) {
  try {
    // 验证用户身份
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const sessionUuid = (await params).uuid;
    const limit = parseInt(new URL(req.url).searchParams.get("limit") || "100");

    if (!sessionUuid) {
      return respErr("Session UUID is required");
    }

    // 获取会话信息
    const sessionInfo = await chatSessionGetByUuid(sessionUuid);
    if (!sessionInfo) {
      return respErr("Session not found");
    }

    // 验证会话属于当前用户
    if (sessionInfo.user_uuid !== user_uuid) {
      return respErr("Unauthorized");
    }

    // 获取会话的聊天历史
    const chatHistory = await chatHistoryGetBySession(sessionUuid, user_uuid, limit);

    // 格式化消息
    const messages = chatHistory.map((record) => ({
      id: record.uuid,
      role: record.role,
      content: record.content,
      message_type: record.message_type,
      created_at: record.created_at,
    }));

    return respData({
      session: {
        uuid: sessionInfo.uuid,
        type: sessionInfo.type,
        icon: sessionInfo.icon,
        name: sessionInfo.name,
        details: sessionInfo.details as ChatSessionAppInfo | ChatSessionCompareDetails | undefined,
      },
      messages: messages,
      total_messages: messages.length,
    });
  } catch (error) {
    console.error("Get chat session error:", error);
    return respErr("Internal server error");
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ uuid: string }> }) {
  try {
    // 验证用户身份
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const sessionUuid = (await params).uuid;

    if (!sessionUuid) {
      return respErr("Session UUID is required");
    }

    // 获取会话信息
    const sessionInfo = await chatSessionGetByUuid(sessionUuid);
    if (!sessionInfo) {
      return respErr("Session not found");
    }

    // 验证会话属于当前用户
    if (sessionInfo.user_uuid !== user_uuid) {
      return respErr("Unauthorized");
    }

    // 删除会话和相关的聊天历史
    const { chatSessionDelete, chatHistoryDeleteBySession } = await import("@/models/chat");
    await chatHistoryDeleteBySession(sessionUuid, user_uuid);
    await chatSessionDelete(sessionUuid, user_uuid);

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Delete chat session error:", error);
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
