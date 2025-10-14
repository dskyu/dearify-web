"use client";

import React, { useState, useEffect } from "react";
import { Search, Smartphone, Globe, Sparkles, ChevronDown, ArrowRight, Apple, ChevronDownIcon } from "lucide-react";
import { Country, CountryCode, StoreType } from "@/types/language";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiAppstore } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";

interface RecentApp {
  id: string;
  name: string;
  icon: string;
  analyzedAt: string;
  platforms: string[];
}

interface SearchStepProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;
  selectedStore: StoreType;
  setSelectedStore: (store: StoreType) => void;
  onSearch: () => void;
  isLoading: boolean;
  countries: readonly Country[];
}

export const SearchStep: React.FC<SearchStepProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCountry,
  setSelectedCountry,
  selectedStore,
  setSelectedStore,
  onSearch,
  isLoading,
  countries,
}) => {
  const [recentApps, setRecentApps] = useState<RecentApp[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover App Insights with AI</h2>
        <p className="text-gray-600">Enter any app name to analyze user reviews, sentiment, and discover hidden opportunities across different markets</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Analyze Any App</h2>
          </div>

          {/* Search bar layout */}
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Store selection + Country selection */}
            <div className="flex items-stretch h-full">
              {/* Store selection */}
              <Select value={selectedStore} onValueChange={(value) => setSelectedStore(value as StoreType)}>
                <SelectTrigger
                  size="sm"
                  className="w-10 h-full pl-8 pr-8 rounded-l-xl shadow-sm rounded-r-none border text-2xl flex items-center relative"
                  style={{ height: "62px" }}
                >
                  <SelectValue>
                    {mounted && (
                      <>
                        {selectedStore === "apple" ? (
                          <SiAppstore className="absolute left-4 h-10 w-10 text-blue-500" style={{ height: "24px", width: "24px" }} />
                        ) : (
                          <BsGooglePlay className="absolute left-4 h-10 w-10 text-green-500" style={{ height: "24px", width: "24px" }} />
                        )}
                      </>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="apple" className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg">
                    <SiAppstore className="h-5 w-5 text-blue-500" /> App Store
                  </SelectItem>
                  <SelectItem value="google" className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg">
                    <BsGooglePlay className="h-5 w-5 text-green-500" /> Google Play
                  </SelectItem>
                </SelectContent>
              </Select>
              {/* Country selection */}
              <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value as CountryCode)}>
                <SelectTrigger
                  className="h-full w-16 rounded-none border-l-0  bg-transparent shadow-sm text-2xl flex items-center relative gap-0"
                  style={{ height: "62px" }}
                >
                  {mounted && <span style={{ fontSize: "30px" }}>{countries.find((c) => c.code === selectedCountry)?.flag}</span>}
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-120 overflow-y-auto">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg">
                      <span>{country.flag}</span> {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Right: Input field and button */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <input
                  id="appName"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-l-0 border-gray-300 rounded-xl rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg"
                  placeholder="Enter app name or keyword"
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={onSearch}
                disabled={!searchTerm.trim() || isLoading}
                className="w-50 group relative flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="w-5 h-5 mr-3" />
                    Search
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Apps */}
      {recentApps.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Analyzed Apps</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentApps.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{app.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{app.name}</h4>
                    <p className="text-sm text-gray-500">{new Date(app.analyzedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {app.platforms.slice(0, 3).map((platform) => (
                    <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {platform}
                    </span>
                  ))}
                  {app.platforms.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">+{app.platforms.length - 3}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
