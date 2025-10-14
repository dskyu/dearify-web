"use client";

import { useTranslations } from "next-intl";
import { Brain, CheckCircle, MessageCircle, Sparkles, Target } from "lucide-react";

export default function SignCard({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations();

  const featureIcons = [
    <Brain className="w-5 h-5 text-indigo-600" key="brain" />,
    <MessageCircle className="w-5 h-5 text-emerald-600" key="message" />,
    <Target className="w-5 h-5 text-rose-600" key="target" />,
  ];

  const features = t.raw("sign_card.features");
  const benefits = t.raw("sign_card.benefits");

  return (
    <>
      {/* Right Side - Features Showcase */}

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{t("sign_card.free_plan_badge")}</span>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            {t("sign_card.title_line1")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">{t("sign_card.title_line2")}</span>
          </h2>

          <p className="text-xl text-white/90 mb-12 leading-relaxed">{t("sign_card.description")}</p>
        </div>

        <div className="space-y-8">
          {features.map((feature: any, index: number) => (
            <div key={index} className="flex items-start space-x-4 group" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                {featureIcons[index]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center space-x-6 text-sm text-white/80">
          {benefits.map((benefit: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
