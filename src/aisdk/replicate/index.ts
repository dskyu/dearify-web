import Replicate from "replicate";

export interface ReplicateConfig {
  apiToken?: string;
  userAgent?: string;
  timeout?: number;
}

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

// Predefined image generation models
export const IMAGE_MODELS = {
  "stable-diffusion": {
    id: "stability-ai/stable-diffusion",
    name: "Stable Diffusion",
    description: "High-quality image generation",
    credits: 3,
  },
  "flux-schnell": {
    id: "black-forest-labs/flux-schnell:latest",
    name: "Flux Schnell",
    description: "High-quality, fast image generation",
    credits: 3,
  },
  "flux-dev": {
    id: "black-forest-labs/flux-dev:latest",
    name: "Flux Dev",
    description: "Advanced image generation with more control",
    credits: 8,
  },
  "dall-e-3": {
    id: "openai/dall-e-3:latest",
    name: "DALL-E 3",
    description: "OpenAI's advanced image generation model",
    credits: 8,
  },
} as const;

export class ReplicateClient {
  private client: Replicate;
  private config: ReplicateConfig;

  constructor(config: ReplicateConfig = {}) {
    this.config = {
      apiToken: process.env.REPLICATE_API_TOKEN,
      userAgent: "dearify-web/1.0.0",
      timeout: 30000,
      ...config,
    };

    if (!this.config.apiToken) {
      throw new Error("REPLICATE_API_TOKEN environment variable is required");
    }

    this.client = new Replicate({
      auth: this.config.apiToken,
      userAgent: this.config.userAgent,
    });
  }

  /**
   * Generate an image using Replicate
   */
  async generateImage(
    modelId: keyof typeof IMAGE_MODELS,
    options: ImageGenerationOptions,
  ): Promise<GenerationResult> {
    try {
      const model = IMAGE_MODELS[modelId];
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }

      const input = {
        prompt: options.prompt,
        width: options.width || 1024,
        height: options.height || 1024,
        num_outputs: options.numOutputs || 1,
        guidance_scale: options.guidanceScale || 7.5,
        num_inference_steps: options.numInferenceSteps || 50,
        ...(options.seed && { seed: options.seed }),
        ...(options.referenceImage && { image: options.referenceImage }),
        ...(options.negativePrompt && {
          negative_prompt: options.negativePrompt,
        }),
        ...(options.scheduler && { scheduler: options.scheduler }),
      };

      const prediction = await this.client.predictions.create({
        model: model.id,
        input,
      });

      return {
        success: true,
        data: prediction,
        metadata: {
          model: modelId,
          credits: model.credits,
          predictionId: prediction.id,
        },
      };
    } catch (error) {
      console.error("Image generation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get prediction status and result
   */
  async getPrediction(predictionId: string): Promise<PredictionStatus | null> {
    try {
      const prediction = await this.client.predictions.get(predictionId);
      return {
        id: prediction.id,
        status: prediction.status as any,
        output: prediction.output,
        error: prediction.error as string | undefined,
        logs: prediction.logs as string | undefined,
        created_at: prediction.created_at,
        started_at: prediction.started_at,
        completed_at: prediction.completed_at,
      };
    } catch (error) {
      console.error("Get prediction error:", error);
      return null;
    }
  }

  /**
   * Wait for prediction to complete
   */
  async waitForPrediction(
    predictionId: string,
    maxWaitTime: number = 300000, // 5 minutes
    pollInterval: number = 2000, // 2 seconds
  ): Promise<PredictionStatus | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const prediction = await this.getPrediction(predictionId);

      if (!prediction) {
        return null;
      }

      if (
        prediction.status === "succeeded" ||
        prediction.status === "failed" ||
        prediction.status === "canceled"
      ) {
        return prediction;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error("Prediction timeout");
  }

  /**
   * Cancel a prediction
   */
  async cancelPrediction(predictionId: string): Promise<boolean> {
    try {
      await this.client.predictions.cancel(predictionId);
      return true;
    } catch (error) {
      console.error("Cancel prediction error:", error);
      return false;
    }
  }

  /**
   * Get model information
   */
  getModelInfo(modelId: keyof typeof IMAGE_MODELS) {
    return IMAGE_MODELS[modelId] || null;
  }

  /**
   * List all available image models
   */
  listModels() {
    return Object.entries(IMAGE_MODELS).map(([modelId, model]) => ({
      modelId,
      ...model,
    }));
  }
}

// Create a singleton instance
export const replicateClient = new ReplicateClient();

// Export convenience functions
export const generateImage = (
  modelId: keyof typeof IMAGE_MODELS,
  options: ImageGenerationOptions,
) => replicateClient.generateImage(modelId, options);

export const getPrediction = (predictionId: string) =>
  replicateClient.getPrediction(predictionId);

export const waitForPrediction = (
  predictionId: string,
  maxWaitTime?: number,
  pollInterval?: number,
) => replicateClient.waitForPrediction(predictionId, maxWaitTime, pollInterval);

export const cancelPrediction = (predictionId: string) =>
  replicateClient.cancelPrediction(predictionId);

export const getModelInfo = (modelId: keyof typeof IMAGE_MODELS) =>
  replicateClient.getModelInfo(modelId);

export const listModels = () => replicateClient.listModels();
