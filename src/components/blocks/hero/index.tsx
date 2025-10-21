"use client";

import HeroBg from "./bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import ReactCompareImage from "react-compare-image";
import {
  ArrowRight,
  Search,
  Sparkles,
  Palette,
  Zap,
  Shield,
  CheckCircle,
  Star,
  Camera,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import ShinyText from "@/components/ShinyText";

export default function Hero({ hero }: { hero: HeroType }) {
  const router = useRouter();
  if (hero.disabled) {
    return null;
  }

  const [appName, setAppName] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(2);
  const [sliderPosition, setSliderPosition] = useState(0.5);
  const EDGE_HIDE_THRESHOLD = 0.12; // hide labels when the handle is within 12% to the edge

  const handleAnalyze = () => {
    if (appName.trim()) {
      router.push(`/dashboard?app=${appName}`);
    }
  };

  // Sample images for different user avatars
  const sampleImages = [
    {
      before: "/imgs/features/1.png",
      after: "/imgs/features/2.png",
    },
    {
      before: "/imgs/features/3.png",
      after: "/imgs/features/4.png",
    },
    {
      before: "/imgs/features/5.png",
      after: "/imgs/features/6.png",
    },
    {
      before: "/imgs/features/7.png",
      after: "/imgs/features/8.png",
    },
    {
      before: "/imgs/features/9.png",
      after: "/imgs/features/1.png",
    },
    {
      before: "/imgs/features/2.png",
      after: "/imgs/features/3.png",
    },
    {
      before: "/imgs/features/4.png",
      after: "/imgs/features/5.png",
    },
    {
      before: "/imgs/features/6.png",
      after: "/imgs/features/7.png",
    },
  ];

  // Animated counter
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalCount((prev) => {
        if (prev < 125875) return prev + 2000;
        clearInterval(timer);
        return 125875;
      });
    }, 30);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // rely on onSliderPositionChange from ReactCompareImage
  useEffect(() => {}, []);

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  // Skeleton shown while images are loading
  const skeleton = (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div
        className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-transparent animate-spin"
        aria-label="loading"
      />
    </div>
  );

  // Custom handle UI: circular knob with subtle shadow and chevrons
  const handle = (
    <div className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-700"
      >
        <polyline points="10 8 6 12 10 16" />
        <polyline points="14 8 18 12 14 16" />
      </svg>
    </div>
  );

  return (
    <>
      <HeroBg />
      <section className="py-16 lg:py-24">
        <div className="container pt-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mx-12">
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full">
              {/* Top Content */}
              <div className="space-y-8">
                {/* Top Stats */}
                <div className="inline-flex items-center space-x-3 pl-2 pr-4 py-2 rounded-full text-sm font-medium bg-white shadow-sm">
                  <div className="w-8 h-8 bg-green-400/80 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span>
                    <span className="text-black ">
                      {totalCount.toLocaleString()}+
                    </span>{" "}
                    <span className="text-gray font-light">
                      assets already created
                    </span>
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold leading-none text-center lg:text-left whitespace-nowrap">
                  <span className="bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
                    The Best AI Art Studio
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
                    for Couples and Families
                  </span>
                </h1>
                {/* Description */}
                <p
                  className="text-base sm:text-lg text-black font-bold leading-relaxed max-w-[100%] 2xl:max-w-[80%]"
                  dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                />
                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 max-w-[100%] 2xl:max-w-[60%]">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-md flex items-center justify-center">
                      <Palette className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-xs font-light">
                      Pick from 50+ styles
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                      <Zap className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-xs font-light">
                      Done in less than 5 minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs font-light">
                      100% money-back guarantee
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-light">
                      Customize with AI
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Content - CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={handleAnalyze}
                  className="relative bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl overflow-hidden group"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary via-primary/90 to-primary rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse scale-110"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/80 to-primary/60 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-primary/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>

                  {/* Button content */}
                  <span className="relative z-10 flex items-center">
                    Get Start Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column - Image/Visual */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center h-full">
              {/* Top Content - Image Comparison */}
              <div className="relative w-full max-w-xl mx-auto">
                {/* Main Comparison Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative aspect-[4/3]">
                  <div className="absolute inset-0 [&>div:first-child]:absolute [&>div:first-child]:inset-0 [&>div:first-child]:!h-full [&>div:first-child]:!w-full [&_[data-testid='container']]:absolute [&_[data-testid='container']]:inset-0 [&_[data-testid='container']]:!h-full [&_[data-testid='container']]:!w-full">
                    <ReactCompareImage
                      aspectRatio="wider"
                      leftImage={
                        sampleImages[selectedImageIndex]?.before ||
                        sampleImages[0].before
                      }
                      rightImage={
                        sampleImages[selectedImageIndex]?.after ||
                        sampleImages[0].after
                      }
                      sliderPositionPercentage={0.5}
                      handleSize={40}
                      sliderLineColor="#ffffff"
                      sliderLineWidth={2}
                      skeleton={skeleton}
                      handle={handle}
                      onSliderPositionChange={(p: number) =>
                        setSliderPosition((prev) =>
                          Math.abs(prev - p) > 0.001 ? p : prev,
                        )
                      }
                    />
                  </div>

                  {/* Before Label */}
                  <div
                    className={`absolute top-4 left-4 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 z-10 transition-all duration-300 will-change-[opacity,transform] ${
                      sliderPosition > EDGE_HIDE_THRESHOLD
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <Camera className="w-3 h-3" />
                    <span>Original</span>
                  </div>

                  {/* After Label */}
                  <div
                    className={`absolute top-4 right-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 z-10 transition-all duration-300 will-change-[opacity,transform] ${
                      1 - sliderPosition > EDGE_HIDE_THRESHOLD
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Generated</span>
                  </div>
                </div>
              </div>

              {/* Bottom Content - User Avatars */}
              <div className="mt-6 flex justify-center space-x-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all duration-200 ${
                      i === selectedImageIndex
                        ? "ring-2 ring-purple-500 ring-offset-2"
                        : "hover:scale-110"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
