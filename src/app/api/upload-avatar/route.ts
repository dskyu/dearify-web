import { respData, respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
import { newStorage } from "@/lib/storage";
import { getUuid } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return respErr("no file provided");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return respErr("file must be an image");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return respErr("file size must be less than 5MB");
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "jpg";
    const filename = `avatars/${user_uuid}_${getUuid()}.${fileExtension}`;

    // Upload to storage
    const storage = newStorage();
    const uploadResult = await storage.uploadFile({
      body: buffer,
      key: filename,
      contentType: file.type,
      disposition: "inline",
    });

    return respData({
      avatar_url: uploadResult.url,
      filename: uploadResult.filename,
    });
  } catch (e) {
    console.log("upload avatar failed", e);
    return respErr("upload avatar failed");
  }
}
