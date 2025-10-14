"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Button size="sm" onClick={() => router.push("/auth/signin")} className="cursor-pointer bg-black text-white rounded-full border-none hover:bg-gray-800">
      {t("user.sign_in")}
    </Button>
  );
}
