"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { X, Cookie, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface CookieConsentProps {
  className?: string;
}

export default function CookieConsent({ className }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  const t = useTranslations("cookieConsent");

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    } else {
      const preferences = JSON.parse(consent);
      setCookiePreferences(preferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setCookiePreferences(preferences);
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setCookiePreferences(preferences);
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(cookiePreferences));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleTogglePreference = (key: keyof typeof cookiePreferences) => {
    if (key === "necessary") return; // Cannot disable necessary cookies
    setCookiePreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-2xl",
        className,
      )}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Cookie Icon and Content */}
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2">{t("title")}</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-2">
                {t("description")}
              </p>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-sm text-primary hover:underline flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {t("managePreferences")}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {!showSettings ? (
              <>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleAcceptNecessary}
                  className="w-full sm:w-auto text-base px-6 py-2"
                >
                  {t("acceptNecessary")}
                </Button>
                <Button
                  size="default"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto text-base px-6 py-2"
                >
                  {t("acceptAll")}
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <Button
                  size="default"
                  onClick={handleSavePreferences}
                  className="w-full sm:w-auto text-base px-6 py-2"
                >
                  {t("savePreferences")}
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowSettings(false)}
                  className="w-full sm:w-auto text-base px-6 py-2"
                >
                  {t("cancel")}
                </Button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="default"
            onClick={handleAcceptNecessary}
            className="absolute top-3 right-3 h-8 w-8 p-0 lg:relative lg:top-auto lg:right-auto"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cookie Settings */}
        {showSettings && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-lg mb-4">{t("cookieSettings")}</h4>
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-base">
                    {t("necessary.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("necessary.description")}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-base">
                    {t("analytics.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("analytics.description")}
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePreference("analytics")}
                  className={cn(
                    "w-12 h-6 rounded-full flex items-center transition-colors",
                    cookiePreferences.analytics
                      ? "bg-primary justify-end px-1"
                      : "bg-muted justify-start px-1",
                  )}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-base">
                    {t("marketing.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("marketing.description")}
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePreference("marketing")}
                  className={cn(
                    "w-12 h-6 rounded-full flex items-center transition-colors",
                    cookiePreferences.marketing
                      ? "bg-primary justify-end px-1"
                      : "bg-muted justify-start px-1",
                  )}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
