"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { AnimatedSection } from "../animation";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function FAQ({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index: any) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section id={section.name} className="py-24 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-xl text-gray-600">{section.description}</p>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {section.items?.map((faq, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-8">{faq.title}</span>
                  <div className="flex-shrink-0">
                    {expandedFaq === index ? <Minus className="w-5 h-5 text-gray-600" /> : <Plus className="w-5 h-5 text-gray-600" />}
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <div className="border-t border-gray-100 pt-6">
                      <p className="text-gray-600 leading-relaxed">{faq.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
