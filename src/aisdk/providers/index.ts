import { replicateClient } from "../replicate";

export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  seed?: number;
  referenceImage?: string;
  negativePrompt?: string;
  scheduler?: string;
  aspectRatio?: string;
  enhanceQuality?: boolean;
  watermark?: boolean;
  style?: string;
}

export interface GenerationResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    model: string;
    duration?: number;
    credits?: number;
    predictionId?: string;
    jobId?: string;
  };
}

export interface PredictionStatus {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: any;
  error?: string;
  logs?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface ProviderClient {
  generateImage(
    model: string,
    options: ImageGenerationOptions,
  ): Promise<GenerationResult>;
  getPrediction(predictionId: string): Promise<PredictionStatus | null>;
  waitForPrediction?(
    predictionId: string,
    maxWaitTime?: number,
    pollInterval?: number,
  ): Promise<PredictionStatus | null>;
  cancelPrediction?(predictionId: string): Promise<boolean>;
}

// Provider factory
export class ProviderFactory {
  static getClient(provider: string): ProviderClient {
    switch (provider) {
      case "replicate":
        return replicateClient;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  static getSupportedProviders(): string[] {
    return ["replicate"];
  }
}
