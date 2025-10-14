import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { respErr } from "@/lib/resp";
import { AppInfo, AppReview } from "@/types/store";
import { SUPPORTED_COUNTRIES } from "@/types/language";
import { getUserUuid } from "@/services/user";
import { chatHistoryCreate, chatSessionGetByUuid, chatSessionUpdate } from "@/models/chat";
import { ChatSessionAppInfo, ChatSessionCompareDetails } from "@/types/chat";
import { AppRecord, appRecordCache } from "@/models/history";
import { decreaseCredits, CreditsTransType, getUserCredits } from "@/services/credit";
import { calculateCost, estimateMessagesTokens, estimateTokens, SUPPORTED_MODELS } from "@/lib/tokens";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

export const createSystemPrompt = (app: AppInfo, reviews: AppReview[], country: string): string => {
  const reviewsText = reviews
    .map(
      (review) =>
        `Rating: ${review.rating}/5, Title: "${review.title}", Content: "${review.content}", Author: ${review.username}, Date: ${new Date(review.updated).toLocaleDateString()}`
    )
    .join("\n\n");

  // Use appDetails if available for more comprehensive information
  const appInfo = app;

  return `You are an expert app review analyst. You have been provided with ${reviews.length} reviews for the ${appInfo.channel} app "${appInfo.title}" from ${SUPPORTED_COUNTRIES.find((c) => c.code === country)?.name}.

App Information:
- Title: ${appInfo.title}
- Developer: ${appInfo.developer.name}
- Category: ${appInfo.category_name}
- Current Rating: ${appInfo.rating}/5 (${Object.values(appInfo.histogram).reduce((a, b) => a + b, 0)} ratings)
- Rating Distribution: ${Object.entries(appInfo.histogram)
    .map(([rating, count]) => `${rating}★: ${count}`)
    .join(", ")}
- Version: ${appInfo.version}
- Country: ${SUPPORTED_COUNTRIES.find((c) => c.code === country)?.name}
- Description: ${appInfo.description || "Not available"}
- Price: ${appInfo.is_free ? "Free" : `${appInfo.price} ${appInfo.currency}`}
- Size: ${appInfo.size > 0 ? `${(appInfo.size / 1024 / 1024).toFixed(1)} MB` : "Not available"}
- Release Date: ${appInfo.release_date || "Not available"}
- Last Updated: ${appInfo.updated_at || "Not available"}

Reviews Data:
${reviewsText}

Your role is to analyze these reviews and provide insights about:
1. Overall user sentiment and satisfaction
2. Common issues and complaints - when mentioning issues, quote specific user reviews that highlight these problems
3. Frequently praised features - when discussing positive features, include direct quotes from user reviews that praise these aspects
4. Suggestions for improvement
5. Trends in user feedback
6. Competitive analysis insights
7. Response by input language, unless the inputer specify the language.

When referencing user feedback, always include the actual review content in quotes to support your analysis.

Please provide helpful, accurate, and actionable insights based on the actual review data provided. Be specific and reference actual user feedback when possible.`;
};

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

export async function POST(req: NextRequest) {
  try {
    // 验证用户身份
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const { model, messages, temperature = 0.7, max_tokens = 8000 } = await req.json();

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

    // 构建系统提示和完整消息数组
    const systemPrompt = createSystemPrompt(app.details, app.reviews, app.country);
    const allMessages = [{ role: "system", content: systemPrompt }, ...messages];

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
      // 发送积分不足的错误信息
      const errorData = `data: ${JSON.stringify({
        type: "error",
        message: `Insufficient credits. Required: ${estimatedCredits}, Available: ${totalAvailableCredits}. Please top up your account.`,
        insufficient_credits: true,
        required_credits: estimatedCredits,
        available_credits: totalAvailableCredits,
      })}\n\n`;

      const errorStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(errorData));
          controller.close();
        },
      });

      return new NextResponse(errorStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 构建OpenRouter请求
    const requestBody = {
      model,
      messages: allMessages,
      stream: true,
      temperature,
      max_tokens,
    };

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

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error("Failed to get response reader"));
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let fullResponse = "";
        const startTime = Date.now();
        let actualPromptTokens = 0;
        let actualCompletionTokens = 0;

        // 尝试从响应头获取token使用信息
        const openRouterUsage = response.headers.get("x-usage");
        if (openRouterUsage) {
          try {
            const usage = JSON.parse(openRouterUsage);
            actualPromptTokens = usage.prompt_tokens || 0;
            actualCompletionTokens = usage.completion_tokens || 0;
          } catch (error) {
            console.warn("Failed to parse usage header:", error);
          }
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  // 流式输出结束，记录AI助手的回复
                  const processingTime = Date.now() - startTime;

                  // 使用实际的token数量，如果没有获取到则使用估算值
                  const finalPromptTokens = actualPromptTokens > 0 ? actualPromptTokens : inputEstimateTokens;
                  const finalCompletionTokens = actualCompletionTokens > 0 ? actualCompletionTokens : estimateTokens(fullResponse, model);
                  const creditsToConsume = calculateCost(model, finalPromptTokens, finalCompletionTokens);

                  try {
                    // 消耗积分
                    await decreaseCredits({
                      user_uuid,
                      trans_type: CreditsTransType.Consume,
                      credits: creditsToConsume,
                      description: `${app.details.title} Analysis - ${creditsToConsume} credits`,
                    });

                    if (messages.length > 0) {
                      // 记录用户消息
                      await chatHistoryCreate({
                        uuid: "",
                        user_uuid: user_uuid,
                        session_uuid: sessionUuid,
                        role: "user",
                        content: messages[messages.length - 1].content,
                        message_type: "text",
                        input_tokens: 0,
                        output_tokens: 0,
                        model: "",
                      });
                    }

                    // 记录AI助手的回复
                    await chatHistoryCreate({
                      uuid: "",
                      user_uuid: user_uuid,
                      session_uuid: sessionUuid,
                      role: "assistant",
                      content: fullResponse,
                      message_type: "text",
                      input_tokens: finalPromptTokens,
                      output_tokens: finalCompletionTokens,
                      model: model,
                      processing_time: processingTime,
                      credits_consumed: creditsToConsume,
                    });

                    await chatSessionUpdate(sessionUuid, {
                      updated_at: new Date(),
                    });

                    // Send credits update signal with actual token usage
                    const creditsUpdateData = `data: ${JSON.stringify({
                      type: "credits-updated",
                      credits_consumed: creditsToConsume,
                      prompt_tokens: finalPromptTokens,
                      completion_tokens: finalCompletionTokens,
                    })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(creditsUpdateData));
                  } catch (error) {
                    console.error("Failed to save assistant message or consume credits:", error);

                    // Check if it's an insufficient credits error
                    if (error instanceof Error && error.message.includes("Insufficient credits")) {
                      const errorData = `data: ${JSON.stringify({
                        type: "error",
                        message: "Insufficient credits. Please top up your account.",
                        insufficient_credits: true,
                      })}\n\n`;
                      controller.enqueue(new TextEncoder().encode(errorData));
                    }
                  }

                  controller.close();
                  return;
                }

                try {
                  const chunk = JSON.parse(data);

                  // 检查是否包含token使用信息（在最后一个数据块中）
                  if (chunk.usage) {
                    actualPromptTokens = chunk.usage.prompt_tokens || 0;
                    actualCompletionTokens = chunk.usage.completion_tokens || 0;
                    console.log("Token usage found:", chunk.usage);
                  }

                  const content = chunk.choices[0]?.delta?.content;
                  if (content) {
                    fullResponse += content;
                    // 发送数据块
                    const chunkData = `data: ${JSON.stringify({ content })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(chunkData));
                  }
                } catch (error) {
                  console.warn("Failed to parse chunk:", error);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error reading stream:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return respErr("Internal server error");
  }
}
