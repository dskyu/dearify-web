"use client";

import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import Link from "next/link";
import { Section as SectionType } from "@/types/blocks/section";

export default function CTA({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16 relative overflow-hidden">
      <div className="container">
        <div className="relative flex items-center justify-center overflow-hidden px-8 py-16 text-center md:p-20 mx-12">
          {/* Custom SVG Background */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 600"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main gradient background */}
              <defs>
                <linearGradient
                  id="mainGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient
                  id="accentGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
                <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Main background */}
              <rect width="1200" height="600" fill="url(#mainGradient)" />

              {/* Organic flowing shapes */}
              <path
                d="M0,200 Q300,100 600,200 T1200,150 L1200,0 L0,0 Z"
                fill="url(#accentGradient)"
                opacity="0.2"
              />
              <path
                d="M0,400 Q400,300 800,400 T1200,350 L1200,600 L0,600 Z"
                fill="url(#accentGradient)"
                opacity="0.15"
              />

              {/* Floating organic blobs */}
              <ellipse
                cx="200"
                cy="150"
                rx="80"
                ry="120"
                fill="url(#glowGradient)"
                opacity="0.4"
                transform="rotate(-15 200 150)"
              />
              <ellipse
                cx="1000"
                cy="450"
                rx="100"
                ry="80"
                fill="url(#glowGradient)"
                opacity="0.3"
                transform="rotate(25 1000 450)"
              />
              <ellipse
                cx="800"
                cy="100"
                rx="60"
                ry="90"
                fill="url(#glowGradient)"
                opacity="0.5"
                transform="rotate(-30 800 100)"
              />
              <ellipse
                cx="300"
                cy="500"
                rx="70"
                ry="110"
                fill="url(#glowGradient)"
                opacity="0.35"
                transform="rotate(45 300 500)"
              />

              {/* Dynamic wave patterns */}
              <path
                d="M0,300 Q200,250 400,300 T800,280 T1200,320 L1200,400 L0,400 Z"
                fill="rgba(255,255,255,0.1)"
              />
              <path
                d="M0,100 Q150,80 300,100 T600,90 T900,110 T1200,95 L1200,200 L0,200 Z"
                fill="rgba(255,255,255,0.08)"
              />

              {/* Scattered accent dots */}
              <circle cx="150" cy="80" r="3" fill="#F59E0B" opacity="0.8" />
              <circle cx="1050" cy="120" r="2" fill="#F59E0B" opacity="0.6" />
              <circle cx="900" cy="480" r="4" fill="#F59E0B" opacity="0.7" />
              <circle cx="250" cy="520" r="2.5" fill="#F59E0B" opacity="0.5" />
              <circle cx="1100" cy="300" r="3.5" fill="#F59E0B" opacity="0.9" />
              <circle cx="50" cy="350" r="2" fill="#F59E0B" opacity="0.6" />

              {/* Artistic Dearify text in background - Main large text - Enhanced visibility */}
              <text
                x="600"
                y="300"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="240"
                fontWeight="900"
                fill="url(#mainGradient)"
                opacity="0.4"
                transform="rotate(-15 600 300)"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="-0.02em"
              >
                Dearify
              </text>

              {/* Enhanced text shadow/outline effect */}
              <text
                x="600"
                y="300"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="240"
                fontWeight="900"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
                opacity="0.5"
                transform="rotate(-15 600 300)"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="-0.02em"
              >
                Dearify
              </text>

              {/* Additional artistic text variations - More visible */}
              <text
                x="200"
                y="150"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="160"
                fontWeight="800"
                fill="url(#accentGradient)"
                opacity="0.35"
                transform="rotate(25 200 150)"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="-0.01em"
              >
                DEARIFY
              </text>

              <text
                x="1000"
                y="450"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="140"
                fontWeight="700"
                fill="url(#glowGradient)"
                opacity="0.3"
                transform="rotate(-20 1000 450)"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.05em"
              >
                dearify
              </text>

              {/* Extra decorative text elements - Enhanced */}
              <text
                x="100"
                y="500"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="100"
                fontWeight="600"
                fill="rgba(255,255,255,0.2)"
                opacity="0.25"
                transform="rotate(45 100 500)"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.1em"
              >
                DEARIFY
              </text>

              <text
                x="1100"
                y="100"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="110"
                fontWeight="600"
                fill="rgba(245,158,11,0.3)"
                opacity="0.3"
                transform="rotate(-45 1100 100)"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.08em"
              >
                dearify
              </text>
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
            <div
              className="absolute top-40 right-32 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse opacity-50"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-32 left-40 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-pulse opacity-70"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-20 right-20 w-1 h-1 bg-orange-300 rounded-full animate-pulse opacity-40"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-60 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-60"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>

          <div className="mx-auto max-w-4xl relative z-10">
            <h2 className="mb-6 text-balance text-4xl font-bold text-white md:text-6xl lg:text-7xl leading-tight">
              {section.title}
            </h2>

            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              {section.description}
            </p>

            {section.buttons && (
              <div className="mt-16 flex flex-col justify-center gap-6 sm:flex-row">
                {section.buttons.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="relative bg-white text-purple-900 hover:bg-white/95 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-115 hover:-translate-y-2 px-12 py-8 text-2xl font-black rounded-full min-w-[320px]"
                    >
                      <Link
                        href={item.url || ""}
                        target={item.target}
                        className="flex items-center justify-center gap-4"
                      >
                        <span className="relative z-10 tracking-wide">
                          {item.title}
                        </span>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
