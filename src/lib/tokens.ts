import { encodingForModel, TiktokenModel } from "js-tiktoken";
import { GoogleGenAI } from "@google/genai";

export const SUPPORTED_MODELS = {
  "google/gemini-2.5-flash": {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    pricing: { prompt: "0.0000003", completion: "0.0000025" },
    context_length: 1048576,
    architecture: { modality: "text+image->text", tokenizer: "Gemini" },
    top_provider: { context_length: 1048576, max_completion_tokens: 65535 },
  },
  "openai/gpt-4o-mini": {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    pricing: { prompt: "0.00000015", completion: "0.0000006" },
    context_length: 128000,
    architecture: { modality: "text+image->text", tokenizer: "GPT" },
    top_provider: { context_length: 128000, max_completion_tokens: 16384 },
  },
  "openai/gpt-4o": {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    pricing: { prompt: "0.0000025", completion: "0.00001" },
    context_length: 128000,
    architecture: { modality: "text+image->text", tokenizer: "GPT" },
    top_provider: { context_length: 128000, max_completion_tokens: 16384 },
  },
  // "deepseek/deepseek-chat": {
  //   id: "deepseek/deepseek-chat",
  //   name: "DeepSeek: DeepSeek V3",
  //   pricing: { prompt: "0.00000038", completion: "0.00000089" },
  //   context_length: 163840,
  //   architecture: { modality: "text->text", tokenizer: "DeepSeek" },
  //   top_provider: { context_length: 163840, max_completion_tokens: 163840 },
  // },
};

// 使用 tiktoken 进行准确的 token 估算
export const estimateTokens = (text: string, model: string = "gpt-4o"): number => {
  try {
    // 根据模型选择合适的编码器
    const modelName = model.split("/")[1];

    let useModel = modelName;
    if (modelName === "gpt-4o-mini" || modelName === "gpt-4o") {
      useModel = modelName;
    } else if (modelName === "gemini-2.5-flash" || modelName === "gemini-2.5-pro") {
      useModel = "gpt-4o";
    } else {
      useModel = "gpt-4o";
    }

    const encoder = encodingForModel(useModel as TiktokenModel);

    const tokens = encoder.encode(text);
    return tokens.length;
  } catch (error) {
    console.warn("Failed to estimate tokens with tiktoken, falling back to character count:", error);
    // 降级到字符估算（1个token约等于4个字符）
    return Math.ceil(text.length / 4);
  }
};

// 估算消息数组的总 token 数
export const estimateMessagesTokens = (messages: any[], model: string = "gpt-4o"): number => {
  try {
    const modelName = model.split("/")[1];
    let useModel = modelName;
    if (modelName === "gpt-4o-mini" || modelName === "gpt-4o") {
      useModel = modelName;
    } else if (modelName === "gemini-2.5-flash" || modelName === "gemini-2.5-pro") {
      useModel = "gpt-4o";
    } else {
      useModel = "gpt-4o";
    }

    const encoder = encodingForModel(useModel as TiktokenModel);

    let totalTokens = 0;
    for (const message of messages) {
      // 每个消息的格式：<|start|>{role}\n{content}<|end|>
      const messageText = `${message.role}\n${message.content}`;
      const tokens = encoder.encode(messageText);
      totalTokens += tokens.length;
    }

    return totalTokens;
  } catch (error) {
    console.warn("Failed to estimate messages tokens with tiktoken, falling back to character count:", error);
    // 降级到字符估算
    let totalChars = 0;
    for (const message of messages) {
      totalChars += message.content.length;
    }
    return Math.ceil(totalChars / 4);
  }
};

// 根据模型和 token 数量计算消耗金额
export const calculateCost = (model: string, inputTokens: number, outputTokens: number): number => {
  let modelInfo = SUPPORTED_MODELS[model as keyof typeof SUPPORTED_MODELS];

  if (!modelInfo) {
    console.warn(`Model ${model} not found in SUPPORTED_MODELS, using default pricing`);
    modelInfo = SUPPORTED_MODELS["openai/gpt-4o"];
  }

  const promptPrice = parseFloat(modelInfo.pricing.prompt);
  const completionPrice = parseFloat(modelInfo.pricing.completion);

  // 计算输入和输出的成本（以美元为单位）
  const inputCost = inputTokens * promptPrice;
  const outputCost = outputTokens * completionPrice;
  const totalCostUSD = inputCost + outputCost;

  const CREDIT_VALUE_USD = 0.001;
  const creditsToConsume = Math.ceil(totalCostUSD / CREDIT_VALUE_USD);

  // 确保至少消耗1个积分
  return Math.max(1, creditsToConsume);
};
