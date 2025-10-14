import { respData, respErr } from "@/lib/resp";
import { findUserByUuid, updateUserProfile } from "@/models/user";
import { getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  try {
    const { nickname, avatar_url } = await req.json();

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const user_info = await findUserByUuid(user_uuid);
    if (!user_info) {
      return respErr("user not found");
    }

    // Validate nickname if provided
    if (nickname !== undefined) {
      if (nickname.length < 3 || nickname.length > 30) {
        return respErr("nickname must be between 3 and 30 characters");
      }
    }

    // Update user profile
    const updatedUser = await updateUserProfile(user_uuid, {
      nickname,
      avatar_url,
    });

    if (!updatedUser) {
      return respErr("failed to update profile");
    }

    return respData(updatedUser);
  } catch (e) {
    console.log("update profile failed", e);
    return respErr("update profile failed");
  }
}
