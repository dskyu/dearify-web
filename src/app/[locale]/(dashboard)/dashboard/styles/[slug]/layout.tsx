import { Metadata } from "next";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/styles-config";

interface StylesLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Style Not Found",
      description: "The requested style category could not be found.",
    };
  }

  const title = `${category.name} Photography Styles | AI-Powered Effects & Filters`;
  const description = `${category.description} Transform your ${category.name.toLowerCase()} photos with professional AI-powered effects, filters, and artistic styles.`;

  return {
    title,
    description,
    keywords: [
      `${category.name.toLowerCase()} photography`,
      `${category.name.toLowerCase()} styles`,
      "AI photo effects",
      "photo filters",
      "artistic styles",
      "professional photography",
      "AI-powered editing",
      ...category.styles.map((style) => style.title.toLowerCase()),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: category.styles[0]?.image || "/imgs/placeholder.png",
          width: 1200,
          height: 630,
          alt: `${category.name} Photography Styles`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [category.styles[0]?.image || "/imgs/placeholder.png"],
    },
    alternates: {
      canonical: `/dashboard/styles/${category.slug}`,
    },
  };
}

export default function StylesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
