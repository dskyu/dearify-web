import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUserAsset, updateUserAsset } from "@/models/user-asset";
import { auth } from "@/auth";
import { ProviderFactory } from "@/aisdk/providers";

// Request validation schema
const GenerateImageAsyncSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  model: z
    .enum(["stable-diffusion", "flux-schnell", "flux-dev", "dall-e-3"])
    .default("stable-diffusion"),
  width: z.number().min(64).max(2048).default(1024),
  height: z.number().min(64).max(2048).default(1024),
  numOutputs: z.number().min(1).max(4).default(1),
  guidanceScale: z.number().min(1).max(20).default(7.5),
  numInferenceSteps: z.number().min(1).max(100).default(50),
  seed: z.number().optional(),
  referenceImage: z.string().url().optional(),
  negativePrompt: z.string().optional(),
  scheduler: z.string().optional(),
  aspectRatio: z.string().optional(),
  enhanceQuality: z.boolean().optional(),
  watermark: z.boolean().optional(),
  style: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.uuid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = GenerateImageAsyncSchema.parse(body);

    const {
      prompt,
      model,
      width,
      height,
      numOutputs,
      guidanceScale,
      numInferenceSteps,
      seed,
      referenceImage,
      negativePrompt,
      scheduler,
      aspectRatio,
      enhanceQuality,
      watermark,
      style,
    } = validatedData;

    // Always use Replicate as the provider
    const provider = "replicate";

    // Create user asset record first
    const userAsset = await createUserAsset({
      userUuid: session.user.uuid,
      type: "image",
      setupOptions: {
        model,
        width,
        height,
        numOutputs,
        guidanceScale,
        numInferenceSteps,
        seed,
        referenceImage,
        negativePrompt,
        scheduler,
        aspectRatio,
        enhanceQuality,
        watermark,
        style,
      },
      setupUrls: referenceImage ? [referenceImage] : undefined,
      prompt,
      negativePrompt,
      provider,
    });

    // Start the generation process asynchronously
    try {
      // Get the appropriate provider client
      const providerClient = ProviderFactory.getClient(provider);

      const options = {
        prompt,
        width,
        height,
        numOutputs,
        guidanceScale,
        numInferenceSteps,
        ...(seed && { seed }),
        ...(referenceImage && { referenceImage }),
        ...(negativePrompt && { negativePrompt }),
        ...(scheduler && { scheduler }),
        ...(aspectRatio && { aspectRatio }),
        ...(enhanceQuality !== undefined && { enhanceQuality }),
        ...(watermark !== undefined && { watermark }),
        ...(style && { style }),
      };

      // Start the prediction using the appropriate provider
      const result = await providerClient.generateImage(model, options);

      if (!result.success) {
        // Update asset status to failed
        await updateUserAsset(userAsset.asset_uuid, {
          status: "failed",
          resultDetail: { error: result.error },
          finishedAt: new Date(),
        });

        return NextResponse.json(
          {
            error: result.error || "Failed to start image generation",
            assetUuid: userAsset.asset_uuid,
          },
          { status: 500 },
        );
      }

      // Update asset with provider job ID
      await updateUserAsset(userAsset.asset_uuid, {
        status: "processing",
        resultDetail: {
          providerJobId:
            result.metadata?.predictionId || result.metadata?.jobId,
        },
      });

      return NextResponse.json({
        success: true,
        assetUuid: userAsset.asset_uuid,
        status: "processing",
        predictionId: result.metadata?.predictionId || result.metadata?.jobId,
        message: "Image generation started",
      });
    } catch (error) {
      // Update asset status to failed
      await updateUserAsset(userAsset.asset_uuid, {
        status: "failed",
        resultDetail: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        finishedAt: new Date(),
      });

      console.error("Image generation error:", error);
      return NextResponse.json(
        {
          error: "Failed to start image generation",
          assetUuid: userAsset.asset_uuid,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Async image generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
