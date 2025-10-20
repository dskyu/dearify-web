"use client";

import HeroBg from "./bg";
import ImageComparison from "./ImageComparison";
import { Hero as HeroType } from "@/types/blocks/hero";
import { HeroSection } from "../animation";
import {
  ArrowRight,
  Search,
  Sparkles,
  Palette,
  Zap,
  Shield,
  CheckCircle,
  Star,
} from "lucide-react";
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
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Top Stats */}
              <HeroSection>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-100">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>{reviewCount + appCount}M+ apps already analyzed</span>
                </div>
              </HeroSection>

              {/* Main Title */}
              <HeroSection>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight text-center lg:text-left whitespace-nowrap">
                  <span className="bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
                    The best AI Art Studio
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
                    for Couples and Families
                  </span>
                </h1>
              </HeroSection>

              {/* Description */}
              <HeroSection>
                <p
                  className="text-xl text-black font-bold leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                />
              </HeroSection>

              {/* Features Grid */}
              <HeroSection>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium">
                      Pick from 150+ styles
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-sm font-medium">
                      Done in less than 1 hour
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      100% money-back guarantee
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">
                      Customize with AI or human editors
                    </span>
                  </div>
                </div>
              </HeroSection>

              {/* CTA Buttons */}
              <HeroSection>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAnalyze}
                    className="bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-xl text-lg font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    Get your photos now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </HeroSection>
            </div>

            {/* Right Column - Image/Visual */}
            <div className="lg:col-span-5">
              <HeroSection>
                <ImageComparison
                  beforeLabel="Selfie"
                  afterLabel="AI Generated"
                />
              </HeroSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
