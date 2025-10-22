import Replicate from "replicate";

export interface ReplicateConfig {
  apiToken?: string;
  userAgent?: string;
  timeout?: number;
}

export interface GenerationOptions {
  prompt: string;
  image_input?: string[];
  aspect_ratio?: string;
  output_format?: "png" | "jpg";
}

export interface GenerationResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    model: string;
    predictionId?: string;
  };
}

export interface RunResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: any;
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
  "nano-banana": {
    id: "google/nano-banana",
    name: "Nano Banana",
    description:
      "Google's advanced image editing model, unmatched character consistency",
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
    options: GenerationOptions,
  ): Promise<GenerationResult> {
    let model: any;
    let input: any;

    try {
      model = IMAGE_MODELS[modelId];
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }

      input = {
        prompt: options.prompt,
        image_input: options.image_input,
        aspect_ratio: options.aspect_ratio,
        output_format: options.output_format,
      };

      const prediction = await this.client.predictions.create({
        model: model.id,
        input,
      });

      console.log("Prediction:", prediction);

      return {
        success: true,
        data: prediction,
        metadata: {
          model: modelId,
          predictionId: prediction.id,
        },
      };
    } catch (error) {
      console.error("Image generation error:", error);
      if (model) {
        console.error("Model ID used:", model.id);
      }
      if (input) {
        console.error("Input parameters:", input);
      }
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
    maxWaitTime: number = 60000, // 1 minute
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

  async imageUpscale(image: string): Promise<RunResult> {
    try {
      const output = await this.client.run("recraft-ai/recraft-crisp-upscale", {
        input: { image },
      });
      return {
        success: true,
        data: output,
      };
    } catch (error) {
      console.error("Image upscale error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Create a singleton instance
export const replicateClient = new ReplicateClient();

// Export convenience functions
export const generateImage = (
  modelId: keyof typeof IMAGE_MODELS,
  options: GenerationOptions,
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

export const imageUpscale = (image: string) =>
  replicateClient.imageUpscale(image);
