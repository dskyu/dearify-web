import React, { useState } from "react";
import { Smartphone, Star, Calendar, Download, HardDrive, Tag, Globe, ExternalLink, User, Mail, Link, ChevronDown, ChevronUp } from "lucide-react";
import { AppInfo, AppReview } from "@/types/store";
import { Country } from "@/types/language";
import { CountryCode } from "@/types/language";
import RetryImage from "@/components/ui/retry-image";
import { SiAppstore } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";

interface ReviewsSummaryProps {
  selectedApp: AppInfo;
  reviews: AppReview[];
  similarApps: AppInfo[];
  selectedCountry: CountryCode;
  countries: readonly Country[];
  onSimilarAppSelect?: (app: AppInfo) => void;
  isLoading?: boolean;
}

export const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
  selectedApp,
  reviews,
  similarApps,
  selectedCountry,
  countries,
  onSimilarAppSelect,
  isLoading = false,
}) => {
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isDeveloperCollapsed, setIsDeveloperCollapsed] = useState(true);
  const [isSimilarAppsCollapsed, setIsSimilarAppsCollapsed] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDateString = (dateString: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getRatingDistribution = () => {
    const total = Object.values(selectedApp.histogram).reduce((a, b) => a + b, 0);
    return Object.entries(selectedApp.histogram).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {/* App Header */}
      <div className="mb-4">
        {/* App Icon and Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <RetryImage src={selectedApp.icon} alt={selectedApp.title} className="w-18 h-18 rounded-xl shadow-sm" fallback="/imgs/placeholder.png" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span className="truncate font-bold text-lg">{selectedApp.title}</span>
            </div>
            <div className="flex items-center">
              <div className="flex">{renderStars(Number(selectedApp.score))}</div>
              <span className="text-sm ms-1">{selectedApp.score}</span>
            </div>
            <span className="text-xs text-gray-500">{(selectedApp.reviews || selectedApp.rating).toLocaleString()} ratings</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Country and Platform Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Country</span>
            <div className="flex items-center space-x-1">
              <span>{countries.find((c) => c.code === selectedCountry)?.flag}</span>
              <span className="font-semibold text-sm">{countries.find((c) => c.code === selectedCountry)?.name.split(" (")[0]}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Platform</span>
            <span className="font-semibold text-sm capitalize flex items-center gap-1">
              <span>
                {selectedApp.channel === "apple" ? <SiAppstore className="w-4 h-4 text-blue-500" /> : <BsGooglePlay className="w-4 h-4 text-green-500" />}
              </span>
              <span>{selectedApp.channel === "apple" ? "App Store" : "Google Play"}</span>
            </span>
          </div>

          {/* Store Link */}
          {selectedApp.store_url && (
            <div className=" pt-2">
              <a
                href={selectedApp.store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on {selectedApp.channel === "apple" ? "App Store" : "Google Play"}</span>
              </a>
            </div>
          )}
        </div>

        {/* App Details */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span>App Details</span>
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">App ID</span>
              <span className="font-semibold text-sm font-mono text-xs">{selectedApp.app_id}</span>
            </div>
            {selectedApp.channel === "apple" && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Bundle ID</span>
                <span className="font-semibold text-sm font-mono text-xs">{selectedApp.bundle_id}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Category</span>
              <span className="font-semibold text-sm">{selectedApp.category_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Price</span>
              <span className="font-semibold text-sm">{selectedApp.is_free ? "Free" : `Paid`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Version</span>
              <span className="font-semibold text-sm">{selectedApp.version || "Unknown"}</span>
            </div>
            {selectedApp.size > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Size</span>
                <span className="font-semibold text-sm">{formatFileSize(selectedApp.size)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Last Updated</span>
              <span className="font-semibold text-sm">{formatDate(Number(selectedApp.updated_at))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Release Date</span>
              <span className="font-semibold text-sm">{formatDate(Number(selectedApp.release_date))}</span>
            </div>

            {selectedApp.os_required && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">OS Required</span>
                <span className="font-semibold text-sm">{selectedApp.os_required}</span>
              </div>
            )}
          </div>
        </div>

        {/* App Description */}
        {selectedApp.description && (
          <div className="border-t pt-4">
            <button
              onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
            >
              <h4 className="font-semibold flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span>Description</span>
              </h4>
              {isDescriptionCollapsed ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${isDescriptionCollapsed ? "max-h-0 opacity-0" : "max-h-none opacity-100"}`}>
              <div className="pt-3">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedApp.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Developer Information */}
        <div className="border-t pt-4">
          <button
            onClick={() => setIsDeveloperCollapsed(!isDeveloperCollapsed)}
            className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
          >
            <h4 className="font-semibold flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>Developer</span>
            </h4>
            {isDeveloperCollapsed ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
          </button>
          <div className={`transition-all duration-300 overflow-hidden ${isDeveloperCollapsed ? "max-h-0 opacity-0" : "max-h-none opacity-100"}`}>
            <div className="pt-3 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{selectedApp.developer.name}</span>
              </div>
              {selectedApp.developer.website && (
                <a
                  href={selectedApp.developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {selectedApp.developer.email && (
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span>{selectedApp.developer.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Apps */}
        {similarApps && similarApps.length > 0 && (
          <div className="border-t pt-4">
            <button
              onClick={() => setIsSimilarAppsCollapsed(!isSimilarAppsCollapsed)}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
            >
              <h4 className="font-semibold flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <span>Similar Apps</span>
              </h4>
              {isSimilarAppsCollapsed ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${isSimilarAppsCollapsed ? "max-h-0 opacity-0" : "max-h-none opacity-100"}`}>
              <div className="pt-3">
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {similarApps.map((app, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-32 bg-gray-50 rounded-lg p-3 transition-colors ${
                        isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
                      }`}
                      onClick={() => !isLoading && onSimilarAppSelect && onSimilarAppSelect(app)}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <RetryImage src={app.icon} alt={app.title} className="w-12 h-12 rounded-lg shadow-sm" fallback="/imgs/placeholder.png" />
                        <div className="text-center w-full">
                          <h5 className="text-xs font-medium text-gray-800 truncate block">{app.title}</h5>
                          <div className="flex items-center justify-center mt-1">
                            <div className="flex">{renderStars(Number(app.score))}</div>
                            <span className="text-xs text-gray-500 ml-1">{app.score}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating Distribution */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Rating Distribution</h4>
          <div className="space-y-2">
            {getRatingDistribution()
              .reverse()
              .map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 w-8">
                    <span className="text-xs text-gray-600">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">{count.toLocaleString()}</span>
                </div>
              ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <div className="font-semibold text-green-600">{selectedApp.histogram[5].toLocaleString() || 0}</div>
                <div className="text-gray-500">5-star ratings</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{selectedApp.histogram[1].toLocaleString() || 0}</div>
                <div className="text-gray-500">1-star ratings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Summary */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Reviews Summary</h4>

          {selectedApp.reviews > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Total Reviews</span>
                <span className="font-semibold">{selectedApp.reviews.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4"></div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="">Latest 100 reviews</span>
          </div>

          <div className="space-y-3 mt-3 max-h-256 overflow-y-auto">
            {reviews
              .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
              .slice(0, 100)
              .map((review, index) => (
                <div key={index} className="text-sm border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium truncate text-gray-800">{review.username}</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-xs text-gray-500 ml-1">{review.rating}/5</span>
                    </div>
                  </div>
                  {review.title && <h5 className="font-medium text-gray-900 mb-1 text-sm">{review.title}</h5>}
                  <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-3">{review.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{formatDateString(review.updated)}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{review.version}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
