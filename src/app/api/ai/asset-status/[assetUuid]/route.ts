import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserAsset, updateUserAsset } from "@/models/user-asset";
import { ProviderFactory } from "@/aisdk/providers";

interface RouteParams {
  params: Promise<{ assetUuid: string }>;
}

// GET /api/ai/asset-status/[assetUuid] - Get asset status
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.uuid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { assetUuid } = await params;

    // Get the asset
    const asset = await getUserAsset(assetUuid);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Check if user owns this asset
    if (asset.user_uuid !== session.user.uuid) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // If asset is processing and has a provider job ID, check the status
    if (asset.status === "processing" && asset.provider_job_id) {
      try {
        // Get the appropriate provider client based on the asset's provider
        const providerClient = ProviderFactory.getClient(asset.provider);
        const prediction = await providerClient.getPrediction(
          asset.provider_job_id,
        );

        if (prediction) {
          if (prediction.status === "succeeded") {
            // Update asset with successful result
            await updateUserAsset(assetUuid, {
              status: "completed",
              resultUrl: prediction.output,
              resultDetail: {
                predictionId: prediction.id,
                output: prediction.output,
                logs: prediction.logs,
                completedAt: prediction.completed_at,
              },
              finishedAt: new Date(),
            });

            return NextResponse.json({
              success: true,
              status: "completed",
              resultUrl: prediction.output,
              resultDetail: {
                predictionId: prediction.id,
                output: prediction.output,
                logs: prediction.logs,
                completedAt: prediction.completed_at,
              },
            });
          } else if (
            prediction.status === "failed" ||
            prediction.status === "canceled"
          ) {
            // Update asset with failed result
            await updateUserAsset(assetUuid, {
              status: "failed",
              resultDetail: {
                predictionId: prediction.id,
                error: prediction.error,
                logs: prediction.logs,
                completedAt: prediction.completed_at,
              },
              finishedAt: new Date(),
            });

            return NextResponse.json({
              success: true,
              status: "failed",
              error: prediction.error,
              resultDetail: {
                predictionId: prediction.id,
                error: prediction.error,
                logs: prediction.logs,
                completedAt: prediction.completed_at,
              },
            });
          } else {
            // Still processing
            return NextResponse.json({
              success: true,
              status: "processing",
              message: "Generation in progress",
            });
          }
        }
      } catch (error) {
        console.error("Error checking prediction status:", error);
        // Don't fail the request, just return current status
      }
    }

    // Return current asset status
    return NextResponse.json({
      success: true,
      status: asset.status,
      resultUrl: asset.result_url,
      resultDetail: asset.result_detail,
      createdAt: asset.created_at,
      finishedAt: asset.finished_at,
    });
  } catch (error) {
    console.error("Get asset status error:", error);
    return NextResponse.json(
      { error: "Failed to get asset status" },
      { status: 500 },
    );
  }
}

// POST /api/ai/asset-status/[assetUuid] - Update asset status (for webhooks or manual updates)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.uuid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { assetUuid } = await params;
    const { status, resultUrl, resultDetail } = await request.json();

    // Get the asset
    const asset = await getUserAsset(assetUuid);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Check if user owns this asset
    if (asset.user_uuid !== session.user.uuid) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update the asset
    const updatedAsset = await updateUserAsset(assetUuid, {
      status,
      resultUrl,
      resultDetail,
      finishedAt:
        status === "completed" || status === "failed" ? new Date() : undefined,
    });

    if (!updatedAsset) {
      return NextResponse.json(
        { error: "Failed to update asset" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      asset: updatedAsset,
    });
  } catch (error) {
    console.error("Update asset status error:", error);
    return NextResponse.json(
      { error: "Failed to update asset status" },
      { status: 500 },
    );
  }
}
