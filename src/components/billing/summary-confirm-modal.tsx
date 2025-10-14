"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles, CreditCard } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { User } from "@/types/user";

interface SummaryConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  user: User | null;
  title?: string;
  description?: string;
}

export default function SummaryConfirmModal({ open, onOpenChange, onConfirm, user, title, description }: SummaryConfirmModalProps) {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = React.useState(false);

  // Use translations or fallback to props
  const modalTitle = title || t("summary.title");
  const modalDescription = description || t("summary.description");

  // Check if user has active subscription
  const hasActiveSubscription = user?.subscription_status === "active" && user?.subscription_credits && user.subscription_credits > 0;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Summary generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToBilling = () => {
    onOpenChange(false);
    router.push("/dashboard/billing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>{modalTitle}</span>
          </DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!hasActiveSubscription && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">{t("summary.subscription_required")}</span>
              </div>
              <p className="text-xs text-yellow-700">{t("summary.subscription_required_desc")}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {t("summary.cancel")}
            </Button>
            {hasActiveSubscription ? (
              <Button onClick={handleConfirm} disabled={isLoading} className="min-w-[100px]">
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("summary.generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("summary.generate")}
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleGoToBilling} className="min-w-[100px]">
                <CreditCard className="mr-2 h-4 w-4" />
                {t("summary.upgrade")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
