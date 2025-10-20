"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import AutoScroll from "embla-carousel-auto-scroll";
import { Card } from "@/components/ui/card";
import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Star,
} from "lucide-react";
import { useRef } from "react";

export default function Testimonial({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const plugin = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
    }),
  );

  return (
    <section id={section.name} className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600">{section.description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.items?.map((tweet, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-100"
            >
              {/* Tweet Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={tweet.icon}
                    alt={tweet.title}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-gray-900">
                        {tweet.title}
                      </span>
                      {tweet.verified && (
                        <svg
                          className="w-4 h-4 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      @{tweet.username}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Tweet Content */}
              <p className="text-gray-900 mb-4 leading-relaxed">
                {tweet.description}
              </p>

              {/* Tweet Actions */}
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center space-x-1 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{tweet.replies}</span>
                </div>
                <div className="flex items-center space-x-1 cursor-pointer">
                  <Repeat2 className="w-4 h-4" />
                  <span>{tweet.retweets}</span>
                </div>
                <div className="flex items-center space-x-1 cursor-pointer">
                  <Heart className="w-4 h-4" />
                  <span>{tweet.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    // <section id={section.name} className="py-16">
    //   <div className="flex flex-col items-center gap-4">
    //     {section.label && (
    //       <div className="flex items-center gap-1 text-sm font-semibold text-primary">
    //         {section.icon && <Icon name={section.icon} className="h-6 w-auto border-primary" />}
    //         {section.label}
    //       </div>
    //     )}
    //     <h2 className="text-center text-3xl font-semibold lg:text-4xl">{section.title}</h2>
    //     <p className="text-center text-muted-foreground lg:text-lg">{section.description}</p>
    //   </div>
    //   <div className="lg:container">
    //     <div className="mt-16 space-y-4">
    //       <Carousel
    //         opts={{
    //           loop: true,
    //         }}
    //         plugins={[plugin.current]}
    //         onMouseLeave={() => plugin.current.play()}
    //         className="relative before:absolute before:bottom-0 before:left-0 before:top-0 before:z-10 before:w-36 before:bg-linear-to-r before:from-background before:to-transparent after:absolute after:bottom-0 after:right-0 after:top-0 after:z-10 after:w-36 after:bg-linear-to-l after:from-background after:to-transparent"
    //       >
    //         <CarouselContent>
    //           {section.items?.map((item, index) => (
    //             <CarouselItem key={index} className="basis-auto">
    //               <Card className="max-w-96 select-none p-6">
    //                 <div className="flex justify-between">
    //                   <div className="mb-4 flex gap-4">
    //                     <Avatar className="size-14 rounded-full ring-1 ring-input">
    //                       <AvatarImage src={item.image?.src} alt={item.image?.alt || item.title} />
    //                     </Avatar>
    //                     <div>
    //                       <p className="font-medium">{item.title}</p>
    //                       <p className="text-sm text-muted-foreground">{item.label}</p>
    //                     </div>
    //                   </div>
    //                   <div className="flex gap-1">
    //                     {Array.from({ length: 5 }).map((_, i) => (
    //                       <Star key={i} className="size-5 fill-amber-500 text-amber-500" />
    //                     ))}
    //                   </div>
    //                 </div>
    //                 <q className="leading-7 text-muted-foreground">{item.description}</q>
    //               </Card>
    //             </CarouselItem>
    //           ))}
    //         </CarouselContent>
    //       </Carousel>
    //     </div>
    //   </div>
    // </section>
  );
}
