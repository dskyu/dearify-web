"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Bot, Database, Search, Settings, Smartphone } from "lucide-react";
import { SearchStep } from "./components/search-step";
import { AppSelectionStep } from "./components/app-selection-step";
import { LoadingStep } from "./components/loading-step";
import { CountryCode, StoreType, SUPPORTED_COUNTRIES } from "@/types/language";
import { AppInfo, AppReview } from "@/types/store";
import { toast } from "sonner";

interface HotKeywords {
  id: string;
  name: string;
  icon: string;
  analyzedAt: string;
  platforms: string[];
}

type Step = "search" | "select" | "reviews";

function AnalysisPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchApp = searchParams.get("app") || "";

  const [currentStep, setCurrentStep] = useState<Step>("search");
  const [searchTerm, setSearchTerm] = useState(searchApp);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("dashboard_selectedCountry") as CountryCode) || "US";
    }
    return "US";
  });
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppInfo | null>(null);
  const [appDetails, setAppDetails] = useState<AppInfo | null>(null);
  const [similarApps, setSimilarApps] = useState<AppInfo[]>([]);
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hotKeywords, setHotKeywords] = useState<HotKeywords[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreType>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("dashboard_selectedStore") as StoreType) || "apple";
    }
    return "apple";
  });

  const steps = [
    { id: "search", label: "Search", icon: <Search className="w-4 h-4" /> },
    { id: "select", label: "Select App", icon: <Smartphone className="w-4 h-4" /> },
    { id: "reviews", label: "Collect Reviews", icon: <Database className="w-4 h-4" /> },
    { id: "chat", label: "AI Analysis", icon: <Bot className="w-4 h-4" /> },
  ];

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  const getLanguageForCountry = (countryCode: CountryCode): string => {
    return SUPPORTED_COUNTRIES.find((c) => c.code === countryCode)?.language || "en";
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);

    try {
      const language = getLanguageForCountry(selectedCountry);
      const response = await fetch(
        `/api/store/app/search?keyword=${encodeURIComponent(searchTerm)}&channel=${selectedStore}&country=${selectedCountry}&language=${language}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.data && data.data.apps && Array.isArray(data.data.apps) && data.data.apps.length > 0) {
        setApps(data.data.apps);
        setCurrentStep("select");
      } else {
        toast.error("No apps found for this search term");
        setApps([]);
      }
    } catch (err) {
      toast.error("Failed to search apps");
      setApps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppSelect = async (app: AppInfo) => {
    setSelectedApp(app);
    setIsLoading(true);
    setCurrentStep("reviews");

    try {
      const language = getLanguageForCountry(selectedCountry);
      const response = await fetch(`/api/store/app/${app.app_id}/collect?channel=${selectedStore}&country=${selectedCountry}&language=${language}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch app data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const appReviews = data.data ? data.data.appReviews || [] : [];
      const appDetailsData = data.data ? data.data.appDetailsData || null : null;
      const similarAppsData = data.data ? data.data.similarAppsData || [] : [];

      setReviews(appReviews);
      setAppDetails(appDetailsData);
      setSimilarApps(similarAppsData);

      // Create chat session
      const sessionResponse = await fetch(`/api/chat/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "app",
          icon: appDetailsData.icon || "",
          name: appDetailsData.title || "",
          details: {
            channel: appDetailsData.channel,
            app_id: app.app_id,
            country: selectedCountry,
            score: appDetailsData.score,
            title: appDetailsData.title,
          },
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error(`Failed to create chat session: ${sessionResponse.status} ${sessionResponse.statusText}`);
      }

      const sessionData = await sessionResponse.json();
      const sessionUuid = sessionData.data.session_uuid;

      // Create session object for sidebar
      const newSession = {
        uuid: sessionUuid,
        name: appDetailsData.title || "",
        icon: appDetailsData.icon || "",
        details: {
          channel: appDetailsData.channel,
          app_id: app.app_id,
          country: selectedCountry,
          score: appDetailsData.score,
          title: appDetailsData.title,
        },
        type: "app" as const,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Dispatch event to notify sidebar
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("session-created", { detail: newSession }));
      }

      // Navigate to chat page
      router.push(`/dashboard/chat/${sessionUuid}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch app data");
      setCurrentStep("select");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "select":
        setCurrentStep("search");
        setApps([]);
        // Save current store and country selection to localStorage when going back to search
        if (typeof window !== "undefined") {
          localStorage.setItem("dashboard_selectedCountry", selectedCountry);
          localStorage.setItem("dashboard_selectedStore", selectedStore);
        }
        break;
      case "reviews":
        setCurrentStep("select");
        setSelectedApp(null);
        setAppDetails(null);
        setSimilarApps([]);
        break;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboard_selectedCountry", selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboard_selectedStore", selectedStore);
    }
  }, [selectedStore]);

  return (
    <div className="space-y-8">
      {/* Back Button */}

      <div className="flex items-center justify-center mb-8 relative">
        <div className="flex items-center space-x-4">
          {currentStep !== "search" && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700   transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            </button>
          )}
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  index <= currentIndex ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {step.icon}
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${index < currentIndex ? "bg-indigo-500" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto px-4 py-4">
        {/* Search Step */}
        {currentStep === "search" && (
          <SearchStep
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            onSearch={handleSearch}
            isLoading={isLoading}
            countries={SUPPORTED_COUNTRIES}
          />
        )}

        {/* App Selection Step */}
        {currentStep === "select" && (
          <AppSelectionStep apps={apps} selectedCountry={selectedCountry} countries={SUPPORTED_COUNTRIES} store={selectedStore} onAppSelect={handleAppSelect} />
        )}

        {/* Loading Reviews Step */}
        {currentStep === "reviews" && (
          <LoadingStep
            app_name={selectedApp?.title || ""}
            country_name={SUPPORTED_COUNTRIES.find((c) => c.code === selectedCountry)?.name || ""}
            app_channel={selectedStore}
            title="Fetching Reviews"
          />
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;
