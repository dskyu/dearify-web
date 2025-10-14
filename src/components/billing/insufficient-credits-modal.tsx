"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard } from "lucide-react";

interface InsufficientCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToBilling: () => void;
  title?: string;
  description?: string;
}

export default function InsufficientCreditsModal({
  open,
  onOpenChange,
  onGoToBilling,
  title = "Insufficient Credits",
  description = "Your credit balance is insufficient to complete this operation. Please recharge and try again.",
}: InsufficientCreditsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Credit Recharge Required</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">You can purchase credit packages or subscription plans on the billing page to get more credits.</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onGoToBilling} className="min-w-[100px]">
              <CreditCard className="mr-2 h-4 w-4" />
              Recharge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
