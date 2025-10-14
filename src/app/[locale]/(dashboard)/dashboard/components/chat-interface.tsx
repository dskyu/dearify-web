"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MessageSquare, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { ModelSelector } from "./model-selector";
import ConfirmCreditModal from "@/components/billing/confirm-credit-modal";
import SummaryConfirmModal from "@/components/billing/summary-confirm-modal";
import { SummaryMessage } from "./summary-message";

import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAppContext } from "@/contexts/app";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  message_type: "text" | "summary";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  chatMessages: ChatMessage[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onSendMessage: (input: string) => void;
  isAiResponding: boolean;
  reviews?: any[]; // 添加评论数据
  onSummaryClicked?: () => void; // 添加消息的回调函数
}

const PRESET_QUESTIONS = [
  {
    category: "User Needs Analysis",
    icon: "🎯",
    questions: [
      "What features do users most want this app to add?",
      "What are the biggest pain points users encounter during usage?",
      "Which features are users most satisfied with? Why?",
      "What are the common themes in user improvement suggestions?",
    ],
  },
  {
    category: "Product Optimization",
    icon: "🚀",
    questions: [
      "Based on user feedback, what issues should the product prioritize?",
      "What aspects of user experience can be improved?",
      "What are users' opinions on interface design and usability?",
      "Which features do users consider redundant or impractical?",
    ],
  },
  {
    category: "Competitive Analysis",
    icon: "⚔️",
    questions: [
      "What competitors do users mention in reviews?",
      "What advantages do users think this app has over competitors?",
      "What features do users want to borrow from competitors?",
      "What are users' views on pricing strategy?",
    ],
  },
  {
    category: "User Persona",
    icon: "👥",
    questions: [
      "What type of users are most satisfied with this app?",
      "How do different user groups' needs differ?",
      "How do new users' and veteran users' feedback differ?",
      "What are the main usage scenarios for users?",
    ],
  },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatMessages,
  selectedModel,
  setSelectedModel,
  onSendMessage,
  isAiResponding,
  reviews = [],
  onSummaryClicked,
}) => {
  const [chatInput, setChatInput] = useState("");
  const [showPresetQuestions, setShowPresetQuestions] = useState(false);
  const [showSummaryConfirmModal, setShowSummaryConfirmModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAppContext();
  const router = useRouter();

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Update preset questions visibility based on chat messages
  useEffect(() => {
    setShowPresetQuestions(chatMessages.length <= 1);
  }, [chatMessages.length]);

  const handlePresetQuestion = (question: string) => {
    setChatInput(question);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput("");
  };

  const handleSummary = async () => {
    if (!selectedModel) {
      toast.error("Please select an AI model first");
      return;
    }
    if (reviews.length === 0) {
      toast.error("No review data available for analysis");
      return;
    }
    setShowSummaryConfirmModal(true);
  };

  const handleSummaryConfirm = async () => {
    onSummaryClicked?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Review Analyzer</h3>
            <p className="text-sm text-gray-600">{selectedModel ? `Using ${selectedModel.split("/").pop()}` : "Select a model to start"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-600">Model</p>
          <div className="w-80">
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </div>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatMessages
          chatMessages={chatMessages}
          user={user}
          onViewSummary={(content) => {
            try {
              window.open(`/app/summary/${content}`, "_blank");
            } catch (error) {
              console.error("Failed to parse summary data:", error);
              toast.error("Failed to load summary data");
            }
          }}
        />
      </div>

      <div className="border-t p-4">
        {/* Preset Questions - Now positioned above input */}
        {selectedModel && PRESET_QUESTIONS.length > 0 && (
          <div className="mb-4 space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => setShowPresetQuestions(!showPresetQuestions)}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
                <MessageSquare className="w-4 h-4" />
                <span>Recommended Questions - Click to ask quickly</span>
              </div>
              <div
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title={showPresetQuestions ? "Collapse recommended questions" : "Expand recommended questions"}
              >
                {showPresetQuestions ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
              </div>
            </div>

            {showPresetQuestions && (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="space-y-4">
                  {PRESET_QUESTIONS.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-2">
                      <h4 className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                        <span>{category.icon}</span>
                        <span>{category.category}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {category.questions.map((question, questionIndex) => (
                          <button
                            key={`${categoryIndex}-${questionIndex}`}
                            onClick={() => handlePresetQuestion(question)}
                            className="text-left p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-xs text-gray-700 hover:text-blue-700 min-h-[2.5rem] flex items-center"
                            title={question}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder={selectedModel ? "Ask me about the reviews..." : "Select a model first..."}
            disabled={!selectedModel || isAiResponding}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || !selectedModel || isAiResponding}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={handleSummary}
            disabled={!selectedModel || isAiResponding || reviews.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Generate Enhanced Report"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
        {!selectedModel && <p className="text-xs text-gray-500 mt-2">Please select an AI model to start chatting.</p>}
      </div>

      {/* Summary Confirm Modal */}
      <SummaryConfirmModal open={showSummaryConfirmModal} onOpenChange={setShowSummaryConfirmModal} onConfirm={handleSummaryConfirm} user={user} />
    </div>
  );
};

const ChatMessages = React.memo(
  ({ chatMessages, user, onViewSummary }: { chatMessages: ChatMessage[]; user: any; onViewSummary: (content: string) => void }) => {
    return (
      <>
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex space-x-2 max-w-3xl ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              {message.type === "user" ? (
                user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.nickname || "User"} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              {message.message_type === "summary" ? (
                <SummaryMessage id={message.id} content={message.content} isGenerating={message.isStreaming} onViewSummary={onViewSummary} />
              ) : (
                <div className={`px-4 py-2 rounded-2xl ${message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.isStreaming && <div className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    );
  }
);
ChatMessages.displayName = "ChatMessages";
