"use client";

import HeroBg from "./bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import { HeroSection } from "../animation";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { BsGooglePlay } from "react-icons/bs";
import { SiAppstore } from "react-icons/si";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";

export default function Hero({ hero }: { hero: HeroType }) {
  const router = useRouter();
  if (hero.disabled) {
    return null;
  }

  const [appName, setAppName] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [appCount, setAppCount] = useState(0);

  const handleAnalyze = () => {
    if (appName.trim()) {
      router.push(`/dashboard?app=${appName}`);
    }
  };

  // Animated counters
  useEffect(() => {
    const reviewTimer = setInterval(() => {
      setReviewCount((prev) => {
        if (prev < 50) return prev + 1;
        clearInterval(reviewTimer);
        return 50;
      });
    }, 50);

    const appTimer = setInterval(() => {
      setAppCount((prev) => {
        if (prev < 100) return prev + 2;
        clearInterval(appTimer);
        return 100;
      });
    }, 30);

    return () => {
      clearInterval(reviewTimer);
      clearInterval(appTimer);
    };
  }, []);

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          <div className="text-center">
            {hero.announcement && (
              <HeroSection delay={0}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-4 py-2 mt-6 rounded-full text-sm font-medium mb-8 border border-indigo-100">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>{hero.announcement.title}</span>
                </div>
              </HeroSection>
            )}

            <HeroSection delay={200}>
              {texts && texts.length > 1 ? (
                <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
                  {texts[0]}
                  <span className="bg-linear-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent animate-pulse">{highlightText}</span>
                  {texts[1]}
                </h1>
              ) : (
                <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">{hero.title}</h1>
              )}
            </HeroSection>

            <HeroSection delay={400}>
              <p className="m mx-auto max-w-3xl text-muted-foreground lg:text-xl" dangerouslySetInnerHTML={{ __html: hero.description || "" }} />
            </HeroSection>

            <HeroSection delay={600}>
              <div className="max-w-2xl mx-auto mb-12 pt-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-2 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search any app (e.g., Instagram, TikTok)"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-0 bg-transparent"
                        onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                      />
                    </div>
                    <button
                      onClick={handleAnalyze}
                      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-xl text-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-300 whitespace-nowrap transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Analyze Now
                      <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">✨ Instant analysis • Always free • Works with any app</p>
              </div>
            </HeroSection>

            {/* Data Sources */}
            <HeroSection delay={800}>
              <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-sm text-gray-600">
                {[
                  { icon: SiAppstore, name: "App Store", color: "blue" },
                  {
                    icon: BsGooglePlay,
                    name: "Google Play",
                    color: "green",
                  },
                ].map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 transform hover:scale-110 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-8 h-8 bg-${source.color}-50 rounded-lg flex items-center justify-center hover:bg-${source.color}-100 transition-colors`}>
                      {<source.icon className={`w-4 h-4 text-${source.color}-600`} />}
                    </div>
                    <span>{source.name}</span>
                  </div>
                ))}
              </div>
            </HeroSection>

            <HeroSection delay={1000}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-600 mb-16">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{reviewCount}M+ reviews analyzed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
                  <span>{appCount}K+ apps covered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "2s" }}></div>
                  <span>Real-time updates</span>
                </div>
              </div>
            </HeroSection>
          </div>
        </div>
      </section>
    </>
  );
}
