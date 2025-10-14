"use client";

import React from "react";
import { Star, Users } from "lucide-react";
import { Country, CountryCode, StoreType } from "@/types/language";
import { AppInfo } from "@/types/store";
import { SiAppstore } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";
import RetryImage from "@/components/ui/retry-image";

interface AppSelectionStepProps {
  apps: AppInfo[];
  selectedCountry: CountryCode;
  countries: readonly Country[];
  store: StoreType;
  onAppSelect: (app: AppInfo) => void;
}

export const AppSelectionStep: React.FC<AppSelectionStepProps> = ({ apps, selectedCountry, countries, store, onAppSelect }) => {
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(score) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select an App</h2>
        <p className="text-gray-600">
          {store === "apple"
            ? `App Store search results for ${countries.find((c) => c.code === selectedCountry)?.name.split(" (")[0]}`
            : `Google Play search results for ${countries.find((c) => c.code === selectedCountry)?.name.split(" (")[0]}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {apps.map((app) => (
          <div
            key={app.app_id}
            onClick={() => onAppSelect(app)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                {app.icon ? (
                  <RetryImage src={app.icon} alt={app.title} className="w-full h-full object-cover" fallback="/imgs/placeholder.png" maxRetry={1} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {app.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{app.title}</h3>
                <p className="text-gray-600 text-sm mb-2 truncate">{app.developer.name}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">{renderStars(parseInt(app.score))}</div>
                  <span className="text-sm text-gray-600">{app.score}</span>
                </div>
                {store === "apple" && (
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{app.reviews.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    {store === "apple" ? <SiAppstore className="w-4 h-4 text-blue-500" /> : <BsGooglePlay className="w-4 h-4 text-green-500" />}
                    <span className="text-sm flex items-center">
                      <div className="mt-1">{countries.find((c) => c.code === selectedCountry)?.flag}</div>
                      <div className="ml-1">{countries.find((c) => c.code === selectedCountry)?.name.split(" (")[0]}</div>
                    </span>
                  </div>
                  {app.size > 0 && <div className="text-xs text-gray-500">Size: {formatFileSize(app.size)}</div>}
                </div>
              </div>
            </div>
            {app.summary && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-3">{app.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
