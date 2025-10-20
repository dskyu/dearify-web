"use client";

import ReactCompareImage from "react-compare-image";
import { Camera, Sparkles } from "lucide-react";

interface ImageComparisonProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = "Selfie",
  afterLabel = "AI Generated",
}: ImageComparisonProps) {
  // Default placeholder images if no images provided
  const defaultBeforeImage =
    beforeImage ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY5ODAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjUwNTA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNmZjgwMDAiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T3JpZ2luYWw8L3RleHQ+Cjwvc3ZnPg==";

  const defaultAfterImage =
    afterImage ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA3M2ZmO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YzUwZjY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiM2MzY2ZjEiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QUkgR2VuZXJhdGVkPC90ZXh0Pgo8L3N2Zz4=";

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Comparison Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <ReactCompareImage
          leftImage={defaultBeforeImage}
          rightImage={defaultAfterImage}
          sliderPositionPercentage={0.5}
          handleSize={40}
          sliderLineColor="#ffffff"
          sliderLineWidth={2}
        />

        {/* Before Label */}
        <div className="absolute top-4 left-4 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 z-10">
          <Camera className="w-3 h-3" />
          <span>{beforeLabel}</span>
        </div>

        {/* After Label */}
        <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 z-10">
          <Sparkles className="w-3 h-3" />
          <span>{afterLabel}</span>
        </div>
      </div>

      {/* User Avatars */}
      <div className="mt-6 flex justify-center space-x-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all duration-200 ${
              i === 2
                ? "ring-2 ring-purple-500 ring-offset-2"
                : "hover:scale-110"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full w-3/4"></div>
      </div>
    </div>
  );
}
