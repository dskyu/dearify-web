"use client";

import React from "react";
import {
  Star,
  Clock,
  Zap,
  ImageIcon,
  Music4,
  Film,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTemplatesByTag, slugToTag } from "@/lib/templates-config";
import { notFound } from "next/navigation";

interface TemplatesPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const TemplatesPage = ({ params }: TemplatesPageProps) => {
  const resolvedParams = React.use(params);
  const templates = getTemplatesByTag(resolvedParams.slug);

  if (!templates.length) {
    notFound();
  }

  const categoryName = slugToTag(resolvedParams.slug);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getContentTypeIcon = (type: string) => {
    if (type === "video") return <Film className="w-4 h-4 text-white" />;
    if (type === "audio") return <Music4 className="w-4 h-4 text-white" />;
    return <ImageIcon className="w-4 h-4 text-white" />;
  };

  const getContentTypeLabel = (type: string) => {
    if (type === "video") return "Video";
    if (type === "audio") return "Audio";
    return "Image";
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {categoryName} Templates
          </h1>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.slug}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative">
              <img
                src={template.cover}
                alt={template.title || template.slug}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`p-2 text-white rounded-full flex items-center shadow-lg ${
                    template.type === "video"
                      ? "bg-gradient-to-r from-red-400 to-red-500"
                      : template.type === "audio"
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                        : "bg-gradient-to-r from-blue-400 to-blue-500"
                  }`}
                >
                  {getContentTypeIcon(template.type)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2 h-8 overflow-hidden">
                {template.title || template.slug}
              </h3>
              <p className="text-gray-600 text-sm mb-3 h-10 overflow-hidden">
                {template.description ||
                  "AI-powered template for creative content"}
              </p>

              {/* Tags below description */}
              <div className="flex gap-2 mb-4 overflow-hidden">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm transition-all duration-200 hover:scale-105 flex-shrink-0"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white">
                Try This
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Perfect for {categoryName}
        </h2>
        <p className="text-gray-600 mb-4">
          Our AI-powered {categoryName.toLowerCase()} templates are designed to
          capture the essence of your special moments. Whether you're looking
          for professional quality results or creative artistic effects, we have
          the perfect template for your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">
              {categoryName}-Focused
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-700">Professional Quality</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-700">Fast Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
