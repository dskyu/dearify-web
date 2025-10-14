import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { checkAndResetSubscriptionCredits } from "@/services/credit";
import { getUsersNeedingSubscriptionReset } from "@/models/credit";

export async function POST(req: NextRequest) {
  try {
    const { user_uuid } = await req.json();

    if (user_uuid) {
      // Reset credits for specific user
      await checkAndResetSubscriptionCredits(user_uuid);
      return respData({ message: "Subscription credits reset successfully" });
    } else {
      // Reset credits for all users who need it
      const usersNeedingReset = await getUsersNeedingSubscriptionReset();

      if (!usersNeedingReset || usersNeedingReset.length === 0) {
        return respData({ message: "No users need subscription reset", reset_count: 0 });
      }

      let resetCount = 0;
      for (const user of usersNeedingReset) {
        try {
          await checkAndResetSubscriptionCredits(user.uuid);
          resetCount++;
        } catch (error) {
          console.error(`Failed to reset credits for user ${user.uuid}:`, error);
        }
      }

      return respData({
        message: `Reset subscription credits for ${resetCount} users`,
        reset_count: resetCount,
      });
    }
  } catch (e: any) {
    console.log("subscription reset failed: ", e);
    return respErr("subscription reset failed: " + e.message);
  }
}

export async function GET() {
  try {
    const usersNeedingReset = await getUsersNeedingSubscriptionReset();

    return respData({
      users_needing_reset: usersNeedingReset?.length || 0,
      users: usersNeedingReset || [],
    });
  } catch (e: any) {
    console.log("get users needing reset failed: ", e);
    return respErr("get users needing reset failed: " + e.message);
  }
}
