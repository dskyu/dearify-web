"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { toast } from "sonner";

interface BillingPortalButtonProps {
  name?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function BillingPortalButton({ name = "Manage Billing", variant = "outline", size = "sm", className = "" }: BillingPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleBillingPortal = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing-portal");
      const data = await response.json();

      if (response.ok) {
        window.open(data.data.url, "_blank");
      } else {
        toast.error(data.error || "Failed to open billing portal");
      }
    } catch (error) {
      console.error("Billing portal error:", error);
      toast.error("Failed to open billing portal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleBillingPortal} variant={variant} size={size} className={className} disabled={isLoading}>
      <Settings className="h-4 w-4 mr-2" />
      {isLoading ? "Loading..." : name}
    </Button>
  );
}
