"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RechargeModal from "@/components/billing/recharge-modal";

interface RechargeButtonProps {
  options: any[];
  name?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function RechargeButton({ options, name = "Recharge", variant = "default", size = "sm", className = "" }: RechargeButtonProps) {
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowRechargeModal(true)} variant={variant} size={size} className={className}>
        {name}
      </Button>

      <RechargeModal open={showRechargeModal} onOpenChange={setShowRechargeModal} options={options} />
    </>
  );
}
