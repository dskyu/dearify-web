"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Zap, Brain, Sparkles } from "lucide-react";
import { OpenRouterModel } from "@/types/openrouter";
import { openRouterService } from "@/lib/openrouter";
import { SUPPORTED_MODELS } from "@/lib/tokens";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const FEATURED_MODELS = Object.keys(SUPPORTED_MODELS);
export const DEFAULT_MODEL = SUPPORTED_MODELS["google/gemini-2.5-flash"];

const getModelIcon = (modelId: string) => {
  if (modelId.includes("claude")) return <Brain className="w-4 h-4" />;
  if (modelId.includes("gpt")) return <Sparkles className="w-4 h-4" />;
  if (modelId.includes("gemini")) return <Zap className="w-4 h-4" />;
  return <Zap className="w-4 h-4" />;
};

const getModelDisplayName = (model: OpenRouterModel) => {
  // Custom display names for better UX
  const customNames: { [key: string]: string } = {
    "google/gemini-2.5-flash": "Gemini 2.5 Flash",
    "openai/gpt-4o-mini": "GPT-4o Mini",
    "openai/gpt-4o": "GPT-4o",
    // "deepseek/deepseek-chat": "DeepSeek V3",
  };

  return customNames[model.id] || model.name || model.id.split("/").pop() || model.id;
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        let availableModels = await openRouterService.getModels();
        availableModels = availableModels.filter((m) => FEATURED_MODELS.includes(m.id));
        setModels(availableModels);

        if (!selectedModel && availableModels.length > 0) {
          onModelChange(DEFAULT_MODEL.id);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);

        setModels([DEFAULT_MODEL]);
        if (!selectedModel) {
          onModelChange(DEFAULT_MODEL.id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [selectedModel, onModelChange]);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span>Loading models...</span>
      </div>
    );
  }

  const handleToggle = () => {
    if (!isOpen) {
      // Calculate if dropdown should open upward
      const button = document.activeElement as HTMLElement;
      if (button) {
        const rect = button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 320; // max-h-80 = 320px
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-2">
          {selectedModelData && getModelIcon(selectedModelData.id)}
          <span className="truncate">{selectedModelData ? getModelDisplayName(selectedModelData) : "Select Model"}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto ${
            dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${selectedModel === model.id ? "bg-blue-50 text-blue-700" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getModelIcon(model.id)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{getModelDisplayName(model)}</div>
                    {/* <div className="text-xs text-gray-500 truncate">{model.context_length.toLocaleString()} tokens</div> */}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
