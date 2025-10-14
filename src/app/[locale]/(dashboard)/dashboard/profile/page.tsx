"use client";

import { User } from "lucide-react";
import { Upload } from "lucide-react";
import { useAppContext } from "@/contexts/app";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export default function () {
  const { user, setUser } = useAppContext();

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  useEffect(() => {
    // 当用户数据加载完成时，停止显示骨架屏
    if (user !== undefined) {
      setIsUserLoading(false);
      setNickname(user?.nickname || "");
    }
  }, [user]);

  // 骨架屏组件
  const ProfileSkeleton = () => (
    <div className="space-y-8">
      {/* 页面标题和描述 */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 头像设置卡片 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />

          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>

          <Skeleton className="h-3 w-48" />
        </div>

        {/* 昵称设置卡片 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-56 mb-6" />

          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );

  // 如果用户数据正在加载，显示骨架屏
  if (isUserLoading) {
    return <ProfileSkeleton />;
  }

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.code !== 0) {
        throw new Error(result.message);
      }

      // Update user profile with new avatar URL
      const updateResponse = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar_url: result.data.avatar_url,
        }),
      });

      const updateResult = await updateResponse.json();

      if (updateResult.code !== 0) {
        throw new Error(updateResult.message);
      }

      // Update local user state
      if (setUser) {
        setUser({ ...user, avatar_url: result.data.avatar_url });
      }

      toast.success(t("profile.messages.avatar_updated"));
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(t("profile.messages.avatar_upload_failed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!nickname.trim()) {
      toast.error(t("profile.messages.nickname_required"));
      return;
    }

    if (nickname.length < 3 || nickname.length > 30) {
      toast.error(t("profile.messages.nickname_length"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname.trim(),
        }),
      });

      const result = await response.json();

      if (result.code !== 0) {
        throw new Error(result.message);
      }

      // Update local user state
      if (setUser) {
        setUser({ ...user, nickname: nickname.trim() });
      }

      toast.success(t("profile.messages.profile_updated"));
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(t("profile.messages.profile_update_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t("profile.title")}</h1>
        <p className="text-gray-600">{t("profile.description")}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("profile.avatar.title")}</h3>
          <p className="text-sm text-gray-600 mb-6">{t("profile.avatar.description")}</p>

          <div className="flex items-center space-x-4 mb-6">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? t("profile.avatar.uploading") : t("profile.avatar.upload")}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>

          <p className="text-xs text-gray-500">{t("profile.avatar.optional_tip")}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("profile.name.title")}</h3>
          <p className="text-sm text-gray-600 mb-6">{t("profile.name.description")}</p>

          <div className="space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t("profile.name.placeholder")}
            />
            <p className="text-xs text-gray-500">{t("profile.name.validation_tip")}</p>

            <button
              onClick={handleSaveProfile}
              disabled={isLoading || !nickname.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("profile.name.saving") : t("profile.name.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
