"use client";
import { Section as SectionType } from "@/types/blocks/section";
import Icon from "@/components/icon";

export default function Feature1({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.items?.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-gray-100"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                <Icon
                  name={feature.icon || ""}
                  className={`h-6 w-auto text-${feature.label || "gray"}-600`}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    // <section id={section.name} className="py-16">
    //   <div className="container">
    //     <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
    //       {section.image && (
    //         <img
    //           src={section.image?.src}
    //           alt="placeholder hero"
    //           className="max-h-full w-full rounded-md object-cover"
    //         />
    //       )}
    //       <div className="flex flex-col lg:text-left">
    //         {section.title && (
    //           <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
    //             {section.title}
    //           </h2>
    //         )}
    //         {section.description && (
    //           <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
    //             {section.description}
    //           </p>
    //         )}
    //         <ul className="flex flex-col justify-center gap-y-8">
    //           {section.items?.map((item, i) => (
    //             <li key={i} className="flex">
    //               {item.icon && (
    //                 <Icon
    //                   name={item.icon}
    //                   className="mr-2 size-6 shrink-0 lg:mr-2 lg:size-6"
    //                 />
    //               )}
    //               <div>
    //                 <div className="mb-3 h-5 text-sm font-semibold text-accent-foreground md:text-base">
    //                   {item.title}
    //                 </div>
    //                 <div className="text-sm font-medium text-muted-foreground md:text-base">
    //                   {item.description}
    //                 </div>
    //               </div>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}
