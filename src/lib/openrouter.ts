import { OpenRouterModel, ChatMessage } from "../types/openrouter";

export class OpenRouterService {
  async getModels(): Promise<OpenRouterModel[]> {
    try {
      const response = await fetch("/api/models", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.code !== 0) {
        throw new Error(result.message || "Failed to fetch models");
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching OpenRouter models:", error);
      return [];
    }
  }

  async *streamChat(
    model: string,
    messages: ChatMessage[],
    headers: Record<string, string>,
    onChunk?: (chunk: string) => void
  ): AsyncGenerator<string, void, unknown> {
    try {
      const requestBody = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if it's an insufficient credits error
        if (response.status === 400 || response.status === 422) {
          const errorMessage = errorData.message || "";
          if (
            errorMessage.toLowerCase().includes("insufficient credits") ||
            errorMessage.toLowerCase().includes("not enough credits") ||
            errorMessage.toLowerCase().includes("积分不足")
          ) {
            // Dispatch insufficient credits event
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("show-insufficient-credits-modal"));
            }
          }
        }

        throw new Error(errorData.message || `Chat API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();
      let buffer = "";

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
              return;
            }

            try {
              const chunk = JSON.parse(data);
              const content = chunk.content;
              if (content) {
                onChunk?.(content);
                yield content;
              }

              // Check for credits update signal
              if (chunk.type === "credits-updated") {
                // Dispatch credits update event
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("credits-updated", {
                      detail: { credits_consumed: chunk.credits_consumed },
                    })
                  );
                }
              }

              // Check for error signal (like insufficient credits)
              if (chunk.type === "error") {
                if (chunk.insufficient_credits || (chunk.message && chunk.message.toLowerCase().includes("insufficient credits"))) {
                  // Dispatch insufficient credits event
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("show-insufficient-credits-modal"));
                  }
                }
                throw new Error(chunk.message || "An error occurred");
              }
            } catch (error) {
              console.warn("Failed to parse chunk:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in streamChat:", error);
      throw error;
    }
  }

  async reportChatHistory(sessionId: string, messages: ChatMessage[], model: string, appInfo?: any): Promise<void> {
    try {
      // This would typically send to your analytics/logging service
      const reportData = {
        sessionId,
        timestamp: new Date().toISOString(),
        model,
        messageCount: messages.length,
        appInfo: appInfo
          ? {
              id: appInfo.id,
              title: appInfo.title,
              country: appInfo.country,
            }
          : null,
        // Don't send actual message content for privacy, just metadata
        conversationMetadata: {
          userMessages: messages.filter((m) => m.role === "user").length,
          assistantMessages: messages.filter((m) => m.role === "assistant").length,
          totalTokensEstimate: messages.reduce((acc, msg) => acc + msg.content.length, 0),
        },
      };

      console.log("Chat history report:", reportData);

      // In a real implementation, you would send this to your analytics endpoint
      // await fetch('/api/analytics/chat-history', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reportData)
      // });
    } catch (error) {
      console.error("Failed to report chat history:", error);
    }
  }
}

export const openRouterService = new OpenRouterService();
