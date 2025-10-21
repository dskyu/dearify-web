"use client";

import CircularGallery from "@/components/CircularGallery";
import DomeGallery from "@/components/DomeGallery";
import { Section as SectionType } from "@/types/blocks/section";

export default function Feature({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-2">
          <h2 className="mb-2 text-3xl bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>
        <div className="grid h-[500px]">
          <CircularGallery
            items={
              section.items?.map((item) => ({
                image: item.image?.src || "",
                text: "",
              })) || []
            }
            bend={3}
            scrollSpeed={3}
            scrollEase={0.05}
            textColor="#000000"
          />
        </div>
      </div>
    </section>
  );
}
