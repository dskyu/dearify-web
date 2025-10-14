import { useRouter } from "@/i18n/navigation";

/**
 * Handle insufficient credits error
 * Triggers a modal instead of directly redirecting
 */
export const handleInsufficientCredits = (error: any, router: any) => {
  // Check if the error is related to insufficient credits
  const errorMessage = error?.message || error?.toString() || "";
  const isInsufficientCredits =
    errorMessage.toLowerCase().includes("insufficient credits") ||
    errorMessage.toLowerCase().includes("not enough credits") ||
    errorMessage.toLowerCase().includes("积分不足");

  if (isInsufficientCredits) {
    // Trigger insufficient credits modal instead of direct redirect
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("show-insufficient-credits-modal"));
    }
    return true; // Indicates that the error was handled
  }

  return false; // Indicates that the error was not handled
};

/**
 * Check if an error response indicates insufficient credits
 */
export const isInsufficientCreditsError = (response: Response, data?: any): boolean => {
  // Check response status and error message
  if (response.status === 400 || response.status === 422) {
    const errorMessage = data?.message || "";
    return (
      errorMessage.toLowerCase().includes("insufficient credits") ||
      errorMessage.toLowerCase().includes("not enough credits") ||
      errorMessage.toLowerCase().includes("积分不足")
    );
  }

  return false;
};

/**
 * Show insufficient credits modal
 */
export const showInsufficientCreditsModal = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("show-insufficient-credits-modal"));
  }
};
