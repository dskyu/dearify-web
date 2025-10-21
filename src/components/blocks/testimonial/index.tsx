"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { Section as SectionType } from "@/types/blocks/section";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Star,
  Camera,
  Music,
  Video,
  Play,
  Users,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";

export default function Testimonial({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {section.items?.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Instagram-style Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={testimonial.icon}
                      alt={testimonial.title}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {testimonial.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {testimonial.time}
                    </span>
                  </div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>

              {/* Media Content - Instagram Style */}
              {(testimonial as any).mediaType === "image" && (
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-pink-400 mx-auto mb-3" />
                    <p className="text-lg text-pink-600 font-medium">
                      Wedding Photo
                    </p>
                    <p className="text-sm text-pink-500">Created with AI</p>
                  </div>
                </div>
              )}

              {(testimonial as any).mediaType === "video" && (
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Play className="w-10 h-10 text-blue-600 ml-1" />
                    </div>
                    <p className="text-lg font-medium text-blue-700">
                      Proposal Video
                    </p>
                    <p className="text-sm text-blue-600">Romantic Moment</p>
                  </div>
                </div>
              )}

              {/* Instagram-style Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-6 h-6 text-gray-700 cursor-pointer hover:text-red-500 transition-colors" />
                      <span className="text-sm text-gray-700 font-medium">
                        {testimonial.likes}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-gray-700 font-medium">
                        {testimonial.replies}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Repeat2 className="w-6 h-6 text-gray-700 cursor-pointer hover:text-green-500 transition-colors" />
                      <span className="text-sm text-gray-700 font-medium">
                        {testimonial.retweets}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>

                {/* Caption */}
                <div className="mb-2">
                  <span className="font-semibold text-sm text-gray-900 mr-2">
                    {testimonial.title}
                  </span>
                  <span className="text-sm text-gray-900">
                    {testimonial.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
