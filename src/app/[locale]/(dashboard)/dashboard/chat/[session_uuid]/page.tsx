"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatInterface } from "../../components/chat-interface";
import { ReviewsSummary } from "../../components/review-summary";
import { LoadingStep } from "../../components/loading-step";
import { openRouterService } from "@/lib/openrouter";
import { ChatMessage as OpenRouterChatMessage } from "@/types/openrouter";
import { CountryCode, StoreType, SUPPORTED_COUNTRIES } from "@/types/language";
import { AppInfo, AppReview } from "@/types/store";
import { ChatMessage, ChatSessionAppInfo, ChatSessionCompareDetails, ChatSessionRecord } from "@/types/chat";
import { toast } from "sonner";
import { handleInsufficientCredits } from "@/lib/credits";
import { DEFAULT_MODEL } from "../../components/model-selector";

function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const sessionUuid = params.session_uuid as string;
  const locale = params.locale as string;

  const [sessionData, setSessionData] = useState<ChatSessionRecord | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL.id);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingApp, setIsSwitchingApp] = useState(false);

  const [appDetails, setAppDetails] = useState<AppInfo | null>(null);
  const [appReviews, setAppReviews] = useState<AppReview[]>([]);
  const [similarApps, setSimilarApps] = useState<AppInfo[]>([]);

  const streamingMessageRef = useRef<string>("");

  // Load session data
  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionUuid) {
        toast.error("Invalid session");
        router.push("/dashboard");
        return;
      }

      try {
        // Fetch session data
        const sessionResponse = await fetch(`/api/chat/session/${sessionUuid}`);
        if (!sessionResponse.ok) {
          throw new Error("Failed to load session");
        }

        const sessionData = await sessionResponse.json();
        const session = sessionData.data.session as ChatSessionRecord;
        const messages = sessionData.data.messages || [];

        // 立即设置 sessionData，避免竞态条件
        setSessionData(session);

        if (session.type === "app") {
          const appInfo = session.details as ChatSessionAppInfo;

          // Fetch app data
          const appResponse = await fetch(`/api/store/app/${appInfo.app_id}/collect?channel=${appInfo.channel}&country=${appInfo.country}`);

          if (!appResponse.ok) {
            throw new Error("Failed to load app data");
          }

          const appData = await appResponse.json();
          const appReviews = appData.data ? appData.data.appReviews || [] : [];
          const appDetailsData = appData.data ? appData.data.appDetailsData || null : [];
          const similarAppsData = appData.data ? appData.data.similarAppsData || [] : [];

          setAppDetails(appDetailsData);
          setAppReviews(appReviews);
          setSimilarApps(similarAppsData);

          // Convert messages to ChatMessage format
          const chatMessages: ChatMessage[] = messages.map((msg: any) => ({
            id: msg.id,
            type: msg.role,
            content: msg.content,
            message_type: msg.message_type,
            timestamp: new Date(msg.created_at),
          }));

          //   console.log("chatMessages", chatMessages);

          // Initialize with greeting if no messages
          if (chatMessages.length === 0 && appDetailsData) {
            const greetingMessage = `Hello! I've analyzed all reviews for ${appDetailsData.title} from the ${appDetailsData.channel === "apple" ? "App Store" : "Google Play"} in ${SUPPORTED_COUNTRIES.find((c) => c.code === appInfo.country)?.name}. I can help you understand user sentiment, identify common issues, highlight positive feedback, provide competitive insights, and suggest improvements. What would you like to know about these reviews?`;

            chatMessages.push({
              id: Date.now().toString(),
              type: "assistant",
              message_type: "text",
              content: greetingMessage,
              timestamp: new Date(),
            });
          }

          setChatMessages(chatMessages);
        } else if (session.type === "compare") {
          // TODO: 处理 compare 类型的 session
          // 这里也需要设置相应的状态
        }
      } catch (error) {
        console.error("Error loading session:", error);
        toast.error("Failed to load chat session");
        setSessionData(null); // 确保在错误时重置 sessionData
        // router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionUuid, router]);

  const handleSummaryClicked = async () => {
    if (!selectedModel || !sessionData) {
      toast.error("Please select a model and ensure session is loaded");
      return;
    }

    // Create summary message with loading state
    const summaryMessageId = Date.now().toString();
    const summaryMessage: ChatMessage = {
      id: summaryMessageId,
      type: "assistant",
      message_type: "summary",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setChatMessages((prev) => [...prev, summaryMessage]);

    try {
      // Prepare messages for summary API
      const messagesForSummary = chatMessages
        .filter((msg) => msg.message_type === "text" && msg.content.trim() !== "")
        .filter((msg) => msg.type !== "assistant" || !msg.isStreaming)
        .map((msg) => ({
          role: msg.type === "user" ? ("user" as const) : ("assistant" as const),
          content: msg.content,
        }));

      // Call summary API
      const response = await fetch("/api/chat/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SESSION-ID": sessionUuid,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: messagesForSummary,
          language: locale,
          temperature: 0.7,
          max_tokens: 8000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate summary");
      }

      const data = await response.json();

      if (!data.content) {
        // Remove the summary message immediately when no content
        setChatMessages((prev) => prev.filter((msg) => msg.id !== summaryMessageId));
        toast.error("No content received from summary generation");
        return;
      }

      // Update the summary message with the result
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === summaryMessageId
            ? {
                ...msg,
                content: data.content,
                isStreaming: false,
              }
            : msg
        )
      );

      // Trigger credits update event to refresh user credits
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("credits-updated"));
      }

      toast.success("Summary generated successfully!");
    } catch (error) {
      console.error("Error generating summary:", error);

      // Check if it's an insufficient credits error
      if (handleInsufficientCredits(error, router)) {
        // Remove the summary message on error
        setChatMessages((prev) => prev.filter((msg) => msg.id !== summaryMessageId));
        return;
      }

      toast.error("Failed to generate summary. Please try again.");

      // Remove the summary message on error
      setChatMessages((prev) => prev.filter((msg) => msg.id !== summaryMessageId));
    }
  };

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || !selectedModel || !sessionData) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      message_type: "text",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setIsAiResponding(true);

    try {
      // Create AI response message
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        type: "assistant",
        content: "",
        message_type: "text",
        timestamp: new Date(),
        isStreaming: true,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      streamingMessageRef.current = "";

      // Prepare messages for OpenRouter
      const openRouterMessages: OpenRouterChatMessage[] = [
        ...chatMessages
          .filter((msg) => msg.message_type === "text" && msg.content.trim() !== "")
          .filter((msg) => msg.type !== "assistant" || !msg.isStreaming)
          .map((msg) => ({
            role: msg.type === "user" ? ("user" as const) : ("assistant" as const),
            content: msg.content,
          })),
        { role: "user", content: currentInput },
      ];

      // Stream the response
      const stream = openRouterService.streamChat(
        selectedModel,
        openRouterMessages,
        {
          "X-SESSION-ID": sessionUuid,
        },
        (chunk) => {
          streamingMessageRef.current += chunk;
          setChatMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: streamingMessageRef.current } : msg)));
        }
      );

      // Process the stream
      for await (const chunk of stream) {
        // Chunk processing is handled in the onChunk callback
      }

      // Finalize the message
      setChatMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg)));
    } catch (error) {
      console.error("Error sending message:", error);

      // Check if it's an insufficient credits error
      if (handleInsufficientCredits(error, router)) {
        // Remove the streaming message on error
        setChatMessages((prev) => prev.filter((msg) => !msg.isStreaming));
        return; // Error was handled by redirecting to billing page
      }

      toast.error("Failed to get AI response. Please try again.");

      // Remove the streaming message on error
      setChatMessages((prev) => prev.filter((msg) => !msg.isStreaming));
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleSimilarAppSelect = async (app: AppInfo) => {
    if (!sessionData) return;

    setIsSwitchingApp(true);

    try {
      const appInfo = sessionData.details as ChatSessionAppInfo;

      const response = await fetch(`/api/store/app/${app.app_id}/collect?channel=${app.channel}&country=${appInfo.country}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch app data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const appDetailsData = data.data ? data.data.appDetailsData || null : [];

      // Create new session for the similar app
      const newSessionResponse = await fetch(`/api/chat/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "app",
          icon: appDetailsData.icon || "",
          name: appDetailsData.title || "",
          details: {
            channel: appDetailsData.channel,
            app_id: app.app_id,
            country: appInfo.country,
            score: appDetailsData.score,
            title: appDetailsData.title,
          },
        }),
      });

      if (!newSessionResponse.ok) {
        throw new Error(`Failed to create chat session: ${newSessionResponse.status} ${newSessionResponse.statusText}`);
      }

      const newSessionData = await newSessionResponse.json();
      const newSessionUuid = newSessionData.data.session_uuid;

      // Create session object for sidebar
      const newSession = {
        uuid: newSessionUuid,
        name: appDetailsData.title || "",
        icon: appDetailsData.icon || "",
        details: {
          channel: appDetailsData.channel,
          app_id: app.app_id,
          country: appInfo.country,
          score: appDetailsData.score,
          title: appDetailsData.title,
        },
        type: "app" as const,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Dispatch event to notify sidebar
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("session-created", { detail: newSession }));
      }

      // Navigate to new chat session
      router.push(`/dashboard/chat/${newSessionUuid}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to switch to similar app");
    } finally {
      setIsSwitchingApp(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    if (sessionData?.type === "app") {
      const appInfo = sessionData.details as ChatSessionAppInfo;
      return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingStep
            app_name={appInfo.title || ""}
            country_name={SUPPORTED_COUNTRIES.find((c) => c.code === appInfo.country)?.name || ""}
            app_channel={appInfo.channel || ""}
            title="Loading Chat Session"
            description="Please wait while we load your chat session and app data..."
          />
        </div>
      );
    } else if (sessionData?.type === "compare") {
      const compareDetails = sessionData.details as ChatSessionCompareDetails;
      return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingStep
            app_name={compareDetails.apps[0].title || ""}
            country_name={SUPPORTED_COUNTRIES.find((c) => c.code === compareDetails.apps[0].country)?.name || ""}
            app_channel={compareDetails.apps[0].channel || ""}
            title="Loading Chat Session"
            description="Please wait while we load your chat session and app data..."
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingStep title="Loading Chat Session" description="Please wait while we load your chat session and app data..." />
        </div>
      );
    }
  }

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Not Found</h2>
          <p className="text-gray-600 mb-4">The chat session you're looking for doesn't exist.</p>
          <button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (sessionData.type === "app") {
    const appInfo = sessionData.details as ChatSessionAppInfo;

    return (
      <div className="space-y-8">
        <div className="mx-auto px-4 py-4 relative">
          {/* Loading overlay for app switching */}
          {isSwitchingApp && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <LoadingStep
                app_name={appInfo.title || ""}
                country_name={SUPPORTED_COUNTRIES.find((c) => c.code === appInfo.country)?.name || ""}
                app_channel={appInfo.channel || ""}
                title="Switching to New App..."
                description="Please wait while we collect review data..."
                subtitle="Processing app data"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Reviews Summary */}
            <div className="lg:col-span-1">
              <ReviewsSummary
                selectedApp={appDetails as AppInfo}
                reviews={appReviews}
                similarApps={similarApps}
                selectedCountry={appInfo.country as CountryCode}
                countries={SUPPORTED_COUNTRIES}
                onSimilarAppSelect={handleSimilarAppSelect}
                isLoading={isSwitchingApp}
              />
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2 xl:col-span-3">
              <ChatInterface
                chatMessages={chatMessages}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                onSendMessage={handleSendMessage}
                isAiResponding={isAiResponding}
                reviews={appReviews}
                onSummaryClicked={handleSummaryClicked}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (sessionData.type === "compare") {
    return (
      <div className="space-y-8">
        <div className="mx-auto px-4 py-4 relative"></div>
      </div>
    );
  }

  return <div>Invalid session type</div>;
}

export default ChatPage;
