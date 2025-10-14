import { CreditsTransType, decreaseCredits, getUserCredits } from "@/services/credit";
import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  try {
    const { amount, description } = await req.json();

    // Validate input
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return respErr("Invalid amount. Must be a positive number.");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    // Get current credits before consumption
    const creditsBefore = await getUserCredits(user_uuid);

    // Check if user has enough credits
    if (creditsBefore.left_credits < amount) {
      return respErr(`Insufficient credits. Required: ${amount}, Available: ${creditsBefore.left_credits}`);
    }

    // Consume credits
    await decreaseCredits({
      user_uuid,
      trans_type: CreditsTransType.Consume,
      credits: amount,
      description: description || `Test consumption: ${amount} credits`,
    });

    // Get updated credits
    const creditsAfter = await getUserCredits(user_uuid);

    return respData({
      success: true,
      consumed: amount,
      credits_before: creditsBefore,
      credits_after: creditsAfter,
      message: `Successfully consumed ${amount} credits`,
      credits_updated: true, // Signal for client to update credits
    });
  } catch (e) {
    console.log("consume credits failed:", e);
    return respErr("consume credits failed");
  }
}

export async function GET(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const credits = await getUserCredits(user_uuid);

    return respData({
      credits,
      message: "Current credits information",
    });
  } catch (e) {
    console.log("get credits failed:", e);
    return respErr("get credits failed");
  }
}
