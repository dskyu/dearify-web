import { Metadata } from "next";
import {
  getAllTemplateSlugsFromTags,
  getTemplatesByTag,
  slugToTag,
  tagToSlug,
} from "@/lib/templates-config";

export async function generateStaticParams() {
  const slugs = getAllTemplateSlugsFromTags();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const templates = getTemplatesByTag(slug);
  const tag = slugToTag(slug);

  if (!templates.length) {
    return {
      title: "Template Not Found",
      description: "The requested template category could not be found.",
    };
  }

  const title = `${tag} AI-Powered Templates | Dearify`;
  const description = `Transform your ${tag.toLowerCase()} content with professional AI-powered effects, filters, and artistic templates.`;

  return {
    title,
    description,
    keywords: [
      `${tag.toLowerCase()} templates`,
      `${tag.toLowerCase()} effects`,
      "AI content effects",
      "content filters",
      "artistic templates",
      "professional content",
      "AI-powered editing",
      ...templates.map((template) =>
        (template.title || template.slug).toLowerCase(),
      ),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: templates[0]?.cover || "/imgs/placeholder.png",
          width: 1200,
          height: 630,
          alt: `${tag} Templates`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [templates[0]?.cover || "/imgs/placeholder.png"],
    },
    alternates: {
      canonical: `/dashboard/category/${slug}`,
    },
  };
}

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
