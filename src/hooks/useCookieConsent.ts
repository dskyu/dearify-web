"use client";

import { useState, useEffect } from "react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent) {
      const parsedPreferences = JSON.parse(consent);
      setPreferences(parsedPreferences);
      setHasConsent(true);
    }
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
    setHasConsent(true);
  };

  const clearConsent = () => {
    localStorage.removeItem("cookie-consent");
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    setHasConsent(false);
  };

  return {
    preferences,
    hasConsent,
    updatePreferences,
    clearConsent,
  };
}
