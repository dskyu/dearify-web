import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { checkAndResetSubscriptionCredits } from "@/services/credit";
import { getUsersNeedingSubscriptionReset } from "@/models/credit";

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret to ensure this is called by the cron service
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return respErr("Unauthorized");
    }

    // Get all users who need subscription reset
    const usersNeedingReset = await getUsersNeedingSubscriptionReset();

    if (!usersNeedingReset || usersNeedingReset.length === 0) {
      return respData({
        message: "No users need subscription reset",
        reset_count: 0,
        timestamp: new Date().toISOString(),
      });
    }

    let resetCount = 0;
    let errors: string[] = [];

    for (const user of usersNeedingReset) {
      try {
        await checkAndResetSubscriptionCredits(user.uuid);
        resetCount++;
      } catch (error) {
        const errorMessage = `Failed to reset credits for user ${user.uuid}: ${error}`;
        console.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    return respData({
      message: `Reset subscription credits for ${resetCount} users`,
      reset_count: resetCount,
      total_users: usersNeedingReset.length,
      errors: errors,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    console.log("cron subscription reset failed: ", e);
    return respErr("cron subscription reset failed: " + e.message);
  }
}

export async function GET() {
  try {
    const usersNeedingReset = await getUsersNeedingSubscriptionReset();

    return respData({
      users_needing_reset: usersNeedingReset?.length || 0,
      users: usersNeedingReset || [],
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    console.log("get users needing reset failed: ", e);
    return respErr("get users needing reset failed: " + e.message);
  }
}
