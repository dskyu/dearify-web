import React from "react";
import { appSummaryGetBySlug, appSummaryGetNextBySlug, appSummaryGetPreviousBySlug } from "@/models/summary";
import { notFound } from "next/navigation";
import { ShowcaseCard, ShowcaseData } from "@/components/blocks/showcase/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SummaryPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // 获取摘要数据
  const summaryRecord = await appSummaryGetBySlug(slug);
  if (!summaryRecord) {
    notFound();
  }

  const previous = await appSummaryGetPreviousBySlug(slug, summaryRecord.id || 0);
  const next = await appSummaryGetNextBySlug(slug, summaryRecord.id || 0);

  const showcase: ShowcaseData = {
    country: summaryRecord.country,
    channel: summaryRecord.channel,
    app_info: summaryRecord.details,
    summary: summaryRecord.summary,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-30">
        {/* Header */}
        <ShowcaseCard data={showcase} />

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {/* Previous */}
          {previous && (
            <Link href={`/showcase/${previous.slug}`} className="flex items-center space-x-3 px-6 py-3 group">
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Previous</span>
                <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">{previous.app_name || previous.app_id}</span>
              </div>
            </Link>
          )}

          {/* Next */}
          {next && (
            <Link href={`/showcase/${next.slug}`} className="flex items-center space-x-3 px-6 py-3 group">
              <div className="flex flex-col text-right">
                <span className="text-sm text-gray-500">Next</span>
                <span className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">{next.app_name || next.app_id}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
