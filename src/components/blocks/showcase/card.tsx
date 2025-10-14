import { AlertTriangle, BarChart3, Clock, Eye, Globe, Lightbulb, MessageSquare, Star, Target, TrendingUp } from "lucide-react";
import { AppInfo } from "@/types/store";
import { SiAppstore } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";
import { timestampToLocalTime } from "@/lib/time";
import { SUPPORTED_COUNTRIES } from "@/types/language";

interface SummaryData {
  risks: Array<{
    title: string;
    impact: string;
    reviews: string[];
    mentions: string;
    severity: "Critical" | "High" | "Medium" | "Low";
  }>;
  actions: {
    immediate_actions: string[];
    long_term_actions: string[];
    short_term_actions: string[];
  };
  pain_points: Array<{
    title: string;
    impact: string;
    reviews: string[];
    mentions: string;
    severity: "Critical" | "High" | "Medium" | "Low";
  }>;
  opportunities: Array<{
    title: string;
    impact: string;
    revenue: string;
    reviews: string[];
    interest: string;
    requests: string;
  }>;
  user_satisfaction: {
    satisfied_features: Array<{
      feature: string;
      reason: string;
    }>;
    overall_satisfaction: string;
    dissatisfied_features: Array<{
      feature: string;
      reason: string;
    }>;
  };
}
export interface ShowcaseData {
  country: string;
  channel: string;
  app_info: AppInfo;
  summary: SummaryData;
  last_updated?: string;

  appName?: string;
  metrics?: {
    criticalIssues?: number;
    criticalIssuesChange?: string;
    sentimentScore?: number;
    sentimentChange?: string;
    opportunities?: number;
    opportunitiesChange?: string;
    reviewsAnalyzed?: string;
    reviewsPeriod?: string;
  };
  painPoints?: Array<{
    title: string;
    severity: "Critical" | "High" | "Medium";
    mentions: string;
    sentiment: string;
    impact: string;
  }>;
  opportunities?: Array<{
    title: string;
    impact: string;
    requests: string;
    interest: string;
    revenue: string;
  }>;
  platforms?: Array<{
    platform: string;
    reviews: string;
    sentiment: number;
    color: string;
  }>;
  actions?: {
    immediate?: string[];
    shortTerm?: string[];
    longTerm?: string[];
  };
}

export function ShowcaseCard({ data }: { data: ShowcaseData }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "red";
      case "High":
        return "orange";
      case "Medium":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes("High")) return "emerald";
    if (impact.includes("Medium")) return "blue";
    if (impact.includes("Quick")) return "purple";
    return "gray";
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl border border-gray-200/50 p-8 hover:shadow-3xl transition-all duration-500">
      <div className="space-y-8">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img src={data.app_info.icon} alt={data.app_info.name} className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{data.app_info.name}</h3>
              <p className="text-gray-600">Comprehensive review intelligence</p>
            </div>
          </div>
        </div>

        {/* App Information Grid */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 text-blue-600 mr-2" />
            App Information
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Country</span>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-sm">
                  {SUPPORTED_COUNTRIES.find((country) => country.code === data.country)?.flag}{" "}
                  {SUPPORTED_COUNTRIES.find((country) => country.code === data.country)?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Platform</span>
              <span className="font-semibold text-sm capitalize flex items-center gap-1">
                {data.app_info.channel === "apple" ? <SiAppstore className="w-4 h-4 text-blue-500" /> : <BsGooglePlay className="w-4 h-4 text-green-500" />}
                <span>{data.app_info.channel === "apple" ? "App Store" : "Google Play"}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Category</span>
              <span className="font-semibold text-sm">{data.app_info.category_name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Version</span>
              <span className="font-semibold text-sm">{data.app_info.version}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Updated</span>
              <span className="font-semibold text-sm">{timestampToLocalTime(Number(data.app_info.updated_at)) || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Rating</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-sm">{data.app_info.score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="border-t pt-4">
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
                <div className="font-semibold text-green-600">{data.app_info.histogram[5].toLocaleString() || 0}</div>
                <div className="text-gray-500">5-star ratings</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{data.app_info.histogram[1].toLocaleString() || 0}</div>
                <div className="text-gray-500">1-star ratings</div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Additional Summary Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* User Satisfaction */}
          {data.summary.user_satisfaction && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Star className="w-5 h-5 text-yellow-600 mr-2" />
                User Satisfaction
              </h4>

              {/* Overall Satisfaction */}
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Overall Satisfaction</span>
                  <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">{data.summary.user_satisfaction.overall_satisfaction}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= 2 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Low satisfaction</span>
                </div>
              </div>

              {/* Satisfied Features */}
              {data.summary.user_satisfaction.satisfied_features && data.summary.user_satisfaction.satisfied_features.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-emerald-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Satisfied Features
                  </h5>
                  <div className="space-y-3">
                    {data.summary.user_satisfaction.satisfied_features.map((feature, index) => (
                      <div key={index} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="text-sm font-medium text-emerald-800 mb-1">{feature.feature}</div>
                        <div className="text-xs text-emerald-700">{feature.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dissatisfied Features */}
              {data.summary.user_satisfaction.dissatisfied_features && data.summary.user_satisfaction.dissatisfied_features.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Dissatisfied Features
                  </h5>
                  <div className="space-y-3">
                    {data.summary.user_satisfaction.dissatisfied_features.map((feature, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-sm font-medium text-red-800 mb-1">{feature.feature}</div>
                        <div className="text-xs text-red-700">{feature.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Critical Risks */}
          {data.summary.risks && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 text-red-600 mr-2" />
                Risk Alerts
              </h4>
              <div className="space-y-4">
                {data.summary.risks.map((risk, index) => {
                  const color = getSeverityColor(risk.severity);
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors border-l-4 border-red-200">
                      <div className={`w-3 h-3 bg-${color}-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse`} style={{ animationDelay: `${index}s` }}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-900">{risk.title}</div>
                          <span className={`text-xs text-${color}-600 bg-${color}-50 px-2 py-1 rounded-full`}>{risk.severity}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{risk.mentions}</div>
                        <div className="text-xs text-gray-500">{risk.impact}</div>
                        {risk.reviews && risk.reviews.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-400 mb-1">Reviews:</div>
                            <div className="space-y-1">
                              {risk.reviews.map((review, reviewIndex) => (
                                <div key={reviewIndex} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                  "{review}"
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Insights */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Pain Points */}
          {data.summary.pain_points && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                Top Pain Points
              </h4>
              <div className="space-y-4">
                {data.summary.pain_points.map((point, index) => {
                  const color = getSeverityColor(point.severity);
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors border-l-4 border-red-200">
                      <div className={`w-3 h-3 bg-${color}-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse`} style={{ animationDelay: `${index}s` }}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-900">{point.title}</div>
                          <span className={`text-xs text-${color}-600 bg-${color}-50 px-2 py-1 rounded-full`}>{point.severity}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{point.mentions}</div>
                        <div className="text-xs text-gray-500 mb-3">{point.impact}</div>
                        {point.reviews && point.reviews.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-400 mb-2 flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Reviews ({point.reviews.length}):
                            </div>
                            <div className="space-y-2">
                              {point.reviews.map((review, reviewIndex) => (
                                <div key={reviewIndex} className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">"{review}"</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Growth Opportunities */}
          {data.summary.opportunities && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-5 h-5 text-emerald-600 mr-2" />
                Growth Opportunities
              </h4>
              <div className="space-y-4">
                {data.summary.opportunities.map((opportunity, index) => {
                  const color = getImpactColor(opportunity.impact);
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors border-l-4 border-emerald-200">
                      <div className={`w-3 h-3 bg-${color}-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse`} style={{ animationDelay: `${index}s` }}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                          <span className={`text-xs text-${color}-600 bg-${color}-50 px-2 py-1 rounded-full`}>{opportunity.impact}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{opportunity.requests}</div>
                        <div className="text-xs text-gray-500 mb-2">{opportunity.revenue}</div>
                        <div className="text-xs text-emerald-600 mb-3">Interest: {opportunity.interest}</div>
                        {opportunity.reviews && opportunity.reviews.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-400 mb-2 flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              User Feedback ({opportunity.reviews.length}):
                            </div>
                            <div className="space-y-2">
                              {opportunity.reviews.map((review, reviewIndex) => (
                                <div key={reviewIndex} className="text-xs text-gray-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-1 h-1 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">"{review}"</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Items */}
        {data.summary.actions && (
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-8 border border-indigo-200/50 shadow-xl">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-600 mr-3" />
                Recommended Actions
              </h4>
              <p className="text-gray-600">Strategic roadmap to address key issues and capitalize on opportunities</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Immediate Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-red-700">Immediate</h5>
                    <p className="text-sm text-red-600">Critical fixes needed now</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {data.summary.actions.immediate_actions?.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short-term Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-orange-700">Short-term</h5>
                    <p className="text-sm text-orange-600">Quick wins & improvements</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {data.summary.actions.short_term_actions?.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-term Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-emerald-700">Long-term</h5>
                    <p className="text-sm text-emerald-600">Strategic initiatives</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {data.summary.actions.long_term_actions?.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
