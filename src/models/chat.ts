import { chatSessions, chatHistory } from "@/db/schema";
import { db } from "@/db";
import { eq, and, desc, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { ChatSessionType, ChatSessionAppInfo, ChatSessionCompareDetails, ChatSessionRecord, ChatHistoryRecord } from "@/types/chat";

export interface CreateChatSessionParams {
  user_uuid: string;
  type: ChatSessionType;
  icon: string;
  name: string;
  details: ChatSessionAppInfo | ChatSessionCompareDetails;
}

export interface UpdateChatSessionParams {
  icon?: string;
  name?: string;
  updated_at?: Date;
}

export interface CreateChatHistoryParams {
  uuid: string;
  user_uuid: string;
  session_uuid: string;
  role: string;
  content: string;
  message_type: string;
  input_tokens?: number;
  output_tokens?: number;
  model?: string;
  status?: string;
  processing_time?: number;
  credits_consumed?: number;
}

// 创建聊天会话
export async function chatSessionCreate(params: CreateChatSessionParams): Promise<ChatSessionRecord> {
  const sessionUuid = uuidv4();

  await db().insert(chatSessions).values({
    uuid: sessionUuid,
    user_uuid: params.user_uuid,
    icon: params.icon,
    name: params.name,
    type: params.type,
    details: params.details,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    uuid: sessionUuid,
    user_uuid: params.user_uuid,
    type: params.type,
    icon: params.icon,
    name: params.name,
    details: params.details,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

// 获取用户的聊天会话列表
export async function chatSessionGetUserSessions(user_uuid: string, limit: number = 20): Promise<ChatSessionRecord[]> {
  const sessions = await db().select().from(chatSessions).where(eq(chatSessions.user_uuid, user_uuid)).orderBy(desc(chatSessions.updated_at)).limit(limit);

  return sessions.map((session) => ({
    ...session,
    type: session.type as ChatSessionType,
    icon: session.icon || "",
    name: session.name || "",
    details: session.details as ChatSessionAppInfo | ChatSessionCompareDetails | undefined,
  }));
}

// 获取特定会话
export async function chatSessionGetByUuid(uuid: string): Promise<ChatSessionRecord | null> {
  const sessions = await db().select().from(chatSessions).where(eq(chatSessions.uuid, uuid)).limit(1);

  if (!sessions[0]) return null;

  return {
    ...sessions[0],
    type: sessions[0].type as ChatSessionType,
    icon: sessions[0].icon || "",
    name: sessions[0].name || "",
    details: sessions[0].details as ChatSessionAppInfo | ChatSessionCompareDetails | undefined,
  };
}

export async function chatSessionUpdate(uuid: string, params: UpdateChatSessionParams): Promise<void> {
  await db()
    .update(chatSessions)
    .set({
      ...params,
      updated_at: new Date(),
    })
    .where(eq(chatSessions.uuid, uuid));
}

// 删除聊天会话
export async function chatSessionDelete(uuid: string, user_uuid: string): Promise<void> {
  await db()
    .delete(chatSessions)
    .where(and(eq(chatSessions.uuid, uuid), eq(chatSessions.user_uuid, user_uuid)));
}

// 创建聊天历史记录
export async function chatHistoryCreate(params: CreateChatHistoryParams): Promise<ChatHistoryRecord> {
  const historyUuid = uuidv4();

  await db()
    .insert(chatHistory)
    .values({
      uuid: historyUuid,
      user_uuid: params.user_uuid,
      session_uuid: params.session_uuid,
      role: params.role,
      message_type: params.message_type || "text",
      content: params.content,
      input_tokens: params.input_tokens || 0,
      output_tokens: params.output_tokens || 0,
      model: params.model,
      status: params.status || "completed",
      processing_time: params.processing_time,
      credits_consumed: params.credits_consumed || 0,
      created_at: new Date(),
      updated_at: new Date(),
    });

  return {
    uuid: historyUuid,
    user_uuid: params.user_uuid,
    session_uuid: params.session_uuid,
    role: params.role,
    message_type: params.message_type || "text",
    content: params.content,
    input_tokens: params.input_tokens || 0,
    output_tokens: params.output_tokens || 0,
    model: params.model,
    status: params.status || "completed",
    processing_time: params.processing_time,
    credits_consumed: params.credits_consumed || 0,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

// 获取会话的聊天历史
export async function chatHistoryGetBySession(session_uuid: string, user_uuid: string, limit: number = 100): Promise<ChatHistoryRecord[]> {
  const history = await db()
    .select()
    .from(chatHistory)
    .where(and(eq(chatHistory.session_uuid, session_uuid), eq(chatHistory.user_uuid, user_uuid)))
    .orderBy(asc(chatHistory.created_at))
    .limit(limit);

  return history;
}

// 删除聊天历史记录
export async function chatHistoryDeleteBySession(session_uuid: string, user_uuid: string): Promise<void> {
  await db()
    .delete(chatHistory)
    .where(and(eq(chatHistory.session_uuid, session_uuid), eq(chatHistory.user_uuid, user_uuid)));
}

// 删除特定聊天记录
export async function chatHistoryDeleteByUuid(uuid: string, user_uuid: string): Promise<void> {
  await db()
    .delete(chatHistory)
    .where(and(eq(chatHistory.uuid, uuid), eq(chatHistory.user_uuid, user_uuid)));
}
