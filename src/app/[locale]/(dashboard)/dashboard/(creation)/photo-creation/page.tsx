import PhotoCreationClient from "./PhotoCreationClient";
import { TemplateItem } from "@/types/blocks/templates";
import { getTemplatesPage } from "@/services/page";
import { templatesConfig } from "@/lib/templates-config";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const templatesPage = await getTemplatesPage(locale);

  // 根据 templatesPage 回填 name、title、description
  const templates: TemplateItem[] = templatesConfig
    .filter((t) => t.type === "image")
    .map((template) => {
      // 查找对应的回填信息
      const fillItem = templatesPage?.items?.find(
        (item) => item.slug === template.slug,
      );

      const x = {
        ...template,
        name: fillItem?.name ?? template.name,
        title: fillItem?.title ?? template.title,
        description: fillItem?.description ?? template.description,
        instructions: fillItem?.instructions ?? template.instructions,
      };

      if (template.slug === "free-style") {
        console.log(x);
      }

      return x;
    });

  return <PhotoCreationClient templates={templates} />;
}
