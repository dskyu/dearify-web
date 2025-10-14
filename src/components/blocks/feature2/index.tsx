"use client";

import React, { useEffect, useState } from "react";

import { Section as SectionType } from "@/types/blocks/section";
import { AlertTriangle, BarChart3, Bot, Check, MessageSquare, TrendingUp, X } from "lucide-react";
import { AnimatedSection } from "../animation";

export default function Feature2({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "included":
        return <Check className="w-5 h-5 text-green-600" />;
      case "basic":
        return <Check className="w-5 h-5 text-yellow-600" />;
      case "manual":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "limited":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "expensive":
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      case "not-available":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <X className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "included":
        return "text-green-700 bg-green-50";
      case "basic":
        return "text-yellow-700 bg-yellow-50";
      case "manual":
        return "text-orange-700 bg-orange-50";
      case "limited":
        return "text-orange-700 bg-orange-50";
      case "expensive":
        return "text-red-700 bg-red-50";
      case "not-available":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <section id={section.name} className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bot className="w-4 h-4" />
              <span>{section.label}</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{section.description}</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Header */}
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Feature</h3>
              </div>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">ReviewInsight</h3>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">ChatGPT</h3>
                </div>
              </div>

              {/* Comparison Rows */}
              {section.items?.map((item, index) => (
                <React.Fragment key={index}>
                  {item.children && (
                    <>
                      <div className="p-6">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(item.children[0].label || "")}
                          <div>
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.children[0].label || "")}`}>
                              {item.children[0].label === "included"
                                ? "Included"
                                : item.children[0].label === "basic"
                                  ? "Basic"
                                  : item.children[0].label === "manual"
                                    ? "Manual"
                                    : item.children[0].label === "limited"
                                      ? "Limited"
                                      : item.children[0].label === "expensive"
                                        ? "Cost Effective"
                                        : "Not Available"}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ms-2">{item.children[0].description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(item.children[1].label || "")}
                          <div>
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.children[1].label || "")}`}>
                              {item.children[1].label === "included"
                                ? "Included"
                                : item.children[1].label === "basic"
                                  ? "Basic"
                                  : item.children[1].label === "manual"
                                    ? "Manual"
                                    : item.children[1].label === "limited"
                                      ? "Limited"
                                      : item.children[1].label === "expensive"
                                        ? "Expensive"
                                        : "Not Available"}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ms-2">{item.children[1].description}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
