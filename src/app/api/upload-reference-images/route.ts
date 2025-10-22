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

    // Collect files under key "files"
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "files" && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return respErr("no files provided");
    }

    if (files.length > 10) {
      return respErr("too many files");
    }

    const storage = newStorage();

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        if (!file.type.startsWith("image/")) {
          throw new Error("file must be an image");
        }

        // Max 10MB per file
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("file size must be less than 10MB");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split(".").pop() || "jpg";
        const filename = `reference-images/${user_uuid}_${getUuid()}.${fileExtension}`;

        const res = await storage.uploadFile({
          body: buffer,
          key: filename,
          contentType: file.type,
          disposition: "inline",
        });

        return res.url;
      }),
    );

    return respData({ urls: uploadResults });
  } catch (e) {
    console.log("upload reference images failed", e);
    return respErr("upload reference images failed");
  }
}
