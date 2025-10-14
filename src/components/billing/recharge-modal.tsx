"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Loader } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";
import { PricingItem } from "@/types/blocks/pricing";

interface RechargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: PricingItem[];
}

export default function RechargeModal({ open, onOpenChange, options }: RechargeModalProps) {
  const { user, setShowSignModal } = useAppContext();
  const [selectedOption, setSelectedOption] = useState<PricingItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const handleRecharge = async () => {
    if (!selectedOption) {
      toast.error(t("billing.recharge_modal.select_plan_error"));
      return;
    }

    try {
      if (!user) {
        setShowSignModal(true);
        onOpenChange(false);
        return;
      }

      if (selectedOption === null) {
        toast.error(t("billing.recharge_modal.select_plan_error"));
        return;
      }

      setIsLoading(true);

      const params = {
        product_id: selectedOption.product_id,
        product_name: selectedOption.product_name,
        credits: selectedOption.credits,
        interval: selectedOption.interval,
        amount: selectedOption.amount,
        currency: selectedOption.currency,
        valid_months: selectedOption.valid_months,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setShowSignModal(true);
        onOpenChange(false);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      const { public_key, session_id } = data;

      const stripe = await loadStripe(public_key);
      if (!stripe) {
        toast.error(t("billing.recharge_modal.checkout_failed"));
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        // 支付成功后关闭弹窗
        onOpenChange(false);
        setSelectedOption(null);
      }
    } catch (e) {
      console.log("Recharge failed: ", e);
      toast.error(t("billing.recharge_modal.recharge_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t("billing.recharge_modal.recharge_title")}</DialogTitle>
          <DialogDescription>{t("billing.recharge_modal.recharge_description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {options.map((option) => (
              <Card
                key={option.product_id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedOption?.product_id === option.product_id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{option.price}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">{option.features_title}</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {option.features?.map((feature) => (
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedOption?.product_id === option.product_id && (
                    <div className="flex items-center justify-center pt-2">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedOption && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("billing.recharge_modal.selected_plan")}</span>
                <span className="font-semibold">{selectedOption.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("billing.recharge_modal.credits")}</span>
                <span className="font-semibold">{selectedOption.credits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("billing.recharge_modal.price")}</span>
                <span className="font-semibold text-lg">{selectedOption.price}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {t("billing.recharge_modal.cancel")}
            </Button>
            <Button onClick={handleRecharge} disabled={!selectedOption || isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {t("billing.recharge_modal.processing")}
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t("billing.recharge_modal.recharge")}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
