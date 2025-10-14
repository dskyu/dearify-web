import React from "react";
import { appSummaryGetByUuid } from "@/models/summary";
import { notFound } from "next/navigation";
import { ShowcaseCard, ShowcaseData } from "@/components/blocks/showcase/card";

interface PageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function SummaryPage({ params }: PageProps) {
  const { uuid } = await params;

  if (!uuid) {
    notFound();
  }

  // 获取摘要数据
  const summaryRecord = await appSummaryGetByUuid(uuid);
  if (!summaryRecord) {
    notFound();
  }

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
      </div>
    </div>
  );
}
