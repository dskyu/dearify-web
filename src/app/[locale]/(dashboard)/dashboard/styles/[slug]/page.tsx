"use client";

import React from "react";
import { Star, Clock, Zap, ImageIcon, Music4, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryBySlug } from "@/lib/styles-config";
import { notFound } from "next/navigation";

interface StylesPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const StylesPage = ({ params }: StylesPageProps) => {
  const resolvedParams = React.use(params);
  const category = getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const IconComponent = category.icon;

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

  const getContentTypeIcon = (contentTypes: string[]) => {
    if (contentTypes.includes("video")) return <Film className="w-4 h-4" />;
    if (contentTypes.includes("audio")) return <Music4 className="w-4 h-4" />;
    return <ImageIcon className="w-4 h-4" />;
  };

  const getContentTypeLabel = (contentTypes: string[]) => {
    if (contentTypes.includes("video")) return "Video";
    if (contentTypes.includes("audio")) return "Audio";
    return "Image";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <IconComponent className={`w-8 h-8 ${category.color}`} />
            {category.name} Styles
          </h1>
          <p className="text-gray-600 mt-2">{category.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Powered by Advanced AI</p>
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Content Types:
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">Images</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
              <Music4 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Audio</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 rounded-full">
              <Film className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700">Video</span>
            </div>
          </div>
        </div>
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {category.styles.map((style) => (
          <Card
            key={style.id}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {style.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium text-white rounded ${
                        tag === "POPULAR"
                          ? "bg-orange-500"
                          : tag === "FREE"
                            ? "bg-green-500"
                            : tag === "Audio"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium text-white bg-black bg-opacity-50 rounded flex items-center gap-1">
                    {getContentTypeIcon(style.contentTypes)}
                    {getContentTypeLabel(style.contentTypes)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {style.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {style.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>{style.credits} credits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{style.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(style.rating)}
                    <span className="text-xs">{style.rating}</span>
                  </div>
                </div>

                <Button
                  className={`w-full bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} hover:opacity-90 text-white`}
                >
                  Try This Style
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div
        className={`mt-12 bg-gradient-to-r ${category.gradientFrom.replace("from-", "from-").replace("500", "50")} ${category.gradientTo.replace("to-", "to-").replace("500", "50")} rounded-xl p-6`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Perfect for {category.name}
        </h2>
        <p className="text-gray-600 mb-4">
          Our AI-powered {category.name.toLowerCase()} styles are designed to
          capture the essence of your special moments. Whether you're looking
          for professional quality results or creative artistic effects, we have
          the perfect style for your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <IconComponent className={`w-5 h-5 ${category.color}`} />
            <span className="text-sm text-gray-700">
              {category.name}-Focused
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

export default StylesPage;
