export type ChatSessionType = "app" | "compare";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  message_type: "text" | "summary";
  timestamp: Date;
  isStreaming?: boolean;
}
export interface ChatSessionAppInfo {
  channel: string;
  app_id: string;
  country: string;
  title: string;
  score: string;
}

export interface ChatSessionCompareDetails {
  apps: ChatSessionAppInfo[];
}

export interface ChatSessionRecord {
  id?: number;
  uuid: string;
  user_uuid: string;
  type: ChatSessionType;
  icon: string;
  name: string;
  details?: ChatSessionAppInfo | ChatSessionCompareDetails;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface ChatHistoryRecord {
  id?: number;
  uuid: string;
  user_uuid: string;
  session_uuid: string;
  role: string;
  message_type?: string;
  content: string;
  input_tokens: number;
  output_tokens: number;
  model?: string | null;
  status: string;
  processing_time?: number | null;
  credits_consumed: number;
  created_at?: Date | null;
  updated_at?: Date | null;
}
