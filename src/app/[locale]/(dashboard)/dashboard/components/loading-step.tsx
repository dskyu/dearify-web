import React from "react";

interface LoadingStepProps {
  app_name?: string;
  app_channel?: string;
  country_name?: string;
  title?: string;
  description?: string;
  subtitle?: string;
}

export const LoadingStep: React.FC<LoadingStepProps> = ({ app_name, country_name, title = "Loading...", description, subtitle, app_channel }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-xl p-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {app_name && country_name && (
          <p className="text-gray-600 mb-4">
            Collecting reviews from <span className="font-bold">{country_name}</span> for <span className="font-bold">{app_name}</span>
          </p>
        )}
        {subtitle && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{subtitle}</span>
            </div>
          </div>
        )}
        {app_channel && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{app_channel === "apple" ? "AppStore" : "Google Play"} Reviews</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
