import { appSummaryGetByLastest } from "@/models/summary";
import { SiAppstore } from "react-icons/si";
import { BsGooglePlay } from "react-icons/bs";
import { SUPPORTED_COUNTRIES } from "@/types/language";
import { Link } from "@/i18n/navigation";

export default async function ShowcasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const summaries = await appSummaryGetByLastest(50);
  const data = summaries;

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">App Showcase</h1>
            <p className="text-xl text-gray-600 mb-8">No analyzed apps available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">App Showcase</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our deeply analyzed apps to understand user feedback, risk points, and improvement opportunities. Each app has undergone comprehensive
            intelligent review analysis.
          </p>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {data.map((app, index) => (
            <Link key={index} href={`/showcase/${app.slug}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-gray-200 hover:border-blue-300 hover:scale-105 hover:-translate-y-2 cursor-pointer">
                <div className="aspect-square mb-3 overflow-hidden rounded-xl">
                  <img
                    src={app.app_icon || "/imgs/placeholder.png"}
                    alt={app.app_name || ""}
                    className="w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-all duration-300 group-hover:translate-y-[-2px]">
                    {app.app_name}
                  </h3>
                  <div className="flex items-center flex-col  justify-center space-y-2 mt-2">
                    {/* Store Icon */}
                    <div className="flex items-center space-x-1">
                      {app.channel === "apple" ? <SiAppstore className="w-3 h-3 text-blue-500" /> : <BsGooglePlay className="w-3 h-3 text-green-500" />}
                      <span className="text-xs text-gray-500">{app.channel === "apple" ? "App Store" : "Google Play"}</span>
                    </div>
                    {/* Country Flag */}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{SUPPORTED_COUNTRIES.find((country) => country.code === app.country)?.flag}</span>
                      <span className="text-xs text-gray-500">{SUPPORTED_COUNTRIES.find((country) => country.code === app.country)?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
