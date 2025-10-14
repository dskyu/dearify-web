import { NextRequest, NextResponse } from "next/server";
import { respErr } from "@/lib/resp";
import { SUPPORTED_LANGUAGES } from "@/types/language";
import { getUserUuid } from "@/services/user";
import { chatHistoryCreate, chatSessionGetByUuid, chatSessionUpdate } from "@/models/chat";
import { ChatSessionAppInfo } from "@/types/chat";
import { AppRecord, appRecordCache } from "@/models/history";
import { decreaseCredits, CreditsTransType, getUserCredits } from "@/services/credit";
import { calculateCost, estimateMessagesTokens } from "@/lib/tokens";
import { createSystemPrompt } from "../route";
import { appSummaryCreate } from "@/models/summary";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

const defaultSummaryPrompt = `You are a professional product analyst. Based on the user review data provided, generate a comprehensive app analysis report.

Please analyze from the following dimensions and provide your response in valid JSON format:

## Analysis Structure
Your response must be a valid JSON object with the following structure:

{
  "user_satisfaction": {
    "overall_satisfaction": "string - overall user satisfaction level",
    "satisfied_features": [
      {
        "feature": "string - feature users are satisfied with",
        "reason": "string - reason why users are satisfied with this feature, and quote at least one relevant user review as evidence, e.g. 'Users appreciate the fast loading speed, as one review states: \"The app opens instantly every time!\"'"
      }
      // ... more objects, list all features that users are satisfied with, at least 1 feature or get user's positive sentiment
    ],
    "dissatisfied_features": [
      {
        "feature": "string - feature users are least satisfied with",
        "reason": "string - reason for dissatisfaction with this feature, and quote at least one relevant user review as evidence, e.g. 'Many users dislike the frequent ads, as one review complains: \"Too many ads interrupt my experience.\"'"
      }
      // ... more objects, list all features that users are least satisfied with
    ]
  },
  "pain_points": [
    {
      "title": "string - concise description of the pain point",
      "severity": "Critical | High | Medium | Low",
      "mentions": "string - number of mentions and sentiment, e.g. '1,247 mentions • 89% negative sentiment'",
      "reviews": ["array of reviews that mention the pain point"],
      "impact": "string - impact of the pain point, e.g. 'Impact: High user churn, 1-star reviews'"
    }
    // ... more objects, each representing a key pain point from user reviews
  ],
  "opportunities": [
    {
      "title": "string - concise description of the opportunity",
      "impact": "string - impact level (e.g., High Impact, Medium Impact, Quick Win)",
      "requests": "string - number of feature requests and user interest (e.g., '2,156 feature requests • 94% positive interest')",
      "reviews": ["array of reviews that mention the opportunity"],
      "interest": "string - user interest percentage (e.g., '94% positive interest')",
      "revenue": "string - revenue or business opportunity (e.g., 'Revenue opportunity: Premium feature tier')"
    }
    // ... more objects
  ],
  "risks": [
    {
      "title": "string - concise description of the risk",
      "severity": "Critical | High | Medium | Low",
      "mentions": "string - number of mentions and sentiment, e.g. '1,247 mentions • 89% negative sentiment'",
      "reviews": ["array of reviews that mention the risk"],
      "impact": "string - impact of the risk, e.g. 'Impact: High user churn, 1-star reviews'"
    }
    // ... more objects
  ],
  "actions": {
    "immediate_actions": ["array of immediate actions to take"],
    "short_term_actions": ["array of short-term actions to take"],
    "long_term_actions": ["array of long-term actions to take"]
  }
}

## Analysis Guidelines
1. Be data-driven and base analysis on actual user feedback
2. Provide objective analysis balancing pros and cons
3. Include actionable recommendations
4. Use clear, concise language
5. Reference specific user feedback when possible
6. Ensure all arrays contain meaningful, specific items
7. Provide comprehensive analysis covering all dimensions

Please analyze the provided review data and return a valid JSON response following the structure above.
`;

export async function POST(req: NextRequest) {
  try {
    // 验证用户身份
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const { model, messages, language, temperature = 0.7, max_tokens = 8000 } = await req.json();

    if (!model || !messages || !Array.isArray(messages)) {
      return respErr("Invalid request parameters");
    }

    if (!OPENROUTER_API_KEY) {
      return respErr("OpenRouter API key not configured");
    }

    const sessionUuid = req.headers.get("X-SESSION-ID");
    if (!sessionUuid) {
      return respErr("session_uuid is required");
    }

    const sessionInfo = await chatSessionGetByUuid(sessionUuid);
    if (!sessionInfo) {
      return respErr("Session not found");
    }

    let app: AppRecord | null = null;
    if (sessionInfo.type === "app") {
      const appInfo = sessionInfo.details as ChatSessionAppInfo;
      app = await appRecordCache({
        channel: appInfo.channel,
        app_id: appInfo.app_id,
        country: appInfo.country,
      });
    } else if (sessionInfo.type === "compare") {
      // TODO
    }

    if (!app) {
      return respErr("App not found");
    }

    let summaryPrompt = defaultSummaryPrompt;
    if (language) {
      // const languageCode = "ZH";
      const languageInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      if (languageInfo) {
        summaryPrompt = defaultSummaryPrompt + `\nUse ${languageInfo.nativeName} language to generate the summary, very important!!!`;
      }
    }

    // 构建系统提示和完整消息数组
    const systemPrompt = createSystemPrompt(app.details, app.reviews, app.country);
    const filteredMessages = messages.filter((msg: { content?: string }) => msg.content && msg.content.trim() !== "");

    const allMessages = [{ role: "system", content: systemPrompt }, ...filteredMessages, { role: "user", content: summaryPrompt }];

    // 估算输入 token 数（包括系统提示和用户消息）
    const inputEstimateTokens = estimateMessagesTokens(allMessages, model);

    // 估算输出 token 数
    const estimatedOutputTokens = inputEstimateTokens / 10;

    // 估算所需积分
    const estimatedCredits = calculateCost(model, inputEstimateTokens, estimatedOutputTokens);

    // 检查用户积分是否足够
    const userCredits = await getUserCredits(user_uuid);
    const totalAvailableCredits = (userCredits.subscription_credits || 0) + (userCredits.one_time_credits || 0);

    if (totalAvailableCredits < estimatedCredits) {
      return respErr(`Insufficient credits. Please top up your account.`);
    }

    // 构建OpenRouter请求 - 移除stream参数
    const requestBody = {
      model,
      messages: allMessages,
      temperature,
      max_tokens,
    };

    const startTime = Date.now();

    // 调用OpenRouter API
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://reviewinsight.app",
        "X-Title": "Review Insight",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return respErr(`OpenRouter API error: ${response.statusText}`);
    }

    // 解析响应
    const responseData = await response.json();
    const fullResponse = responseData.choices[0]?.message?.content;
    const promptTokens = responseData.usage.prompt_tokens;
    const completionTokens = responseData.usage.completion_tokens;

    if (!fullResponse) {
      return respErr("No response content from OpenRouter API");
    }

    const processingTime = Date.now() - startTime;
    const creditsToConsume = calculateCost(model, promptTokens, completionTokens);

    try {
      // 消耗积分
      await decreaseCredits({
        user_uuid,
        trans_type: CreditsTransType.Consume,
        credits: creditsToConsume,
        description: `${app.details.title} Analysis - ${creditsToConsume} credits`,
      });

      // fullResponse 可能被 ```json ``` 包裹，需要去掉，改为提取第一个 { 和最后一个 } 之间的内容
      let cleanedResponse = fullResponse.trim();
      const firstBrace = cleanedResponse.indexOf("{");
      const lastBrace = cleanedResponse.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedResponse = cleanedResponse.slice(firstBrace, lastBrace + 1).trim();
      }

      const summary = await appSummaryCreate({
        user_uuid: user_uuid,
        channel: app.channel,
        country: app.country,
        app_id: app.app_id,
        language: app.language || undefined,
        app_name: app.name || undefined,
        app_icon: app.details.icon || undefined,
        details: app.details,
        summary: JSON.parse(cleanedResponse),
      });

      // 记录AI助手的回复
      await chatHistoryCreate({
        uuid: "",
        user_uuid: user_uuid,
        session_uuid: sessionUuid,
        role: "assistant",
        content: summary.uuid,
        message_type: "summary",
        input_tokens: promptTokens,
        output_tokens: completionTokens,
        model: model,
        processing_time: processingTime,
        credits_consumed: creditsToConsume,
      });

      await chatSessionUpdate(sessionUuid, {
        updated_at: new Date(),
      });

      // 返回非流式响应
      return NextResponse.json({
        success: true,
        content: summary.uuid,
        credits_consumed: creditsToConsume,
        processing_time: processingTime,
      });
    } catch (error) {
      console.error("Failed to save assistant message or consume credits:", error);

      // Check if it's an insufficient credits error
      if (error instanceof Error && error.message.includes("Insufficient credits")) {
        return respErr("Insufficient credits. Please top up your account.");
      }

      return respErr("Failed to process response");
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return respErr("Internal server error");
  }
}
