"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, CheckCircle, Loader2, Link, Link2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryMessageProps {
  id: string;
  content?: string;
  isGenerating?: boolean;
  onViewSummary?: (content: string) => void;
}

export const SummaryMessage: React.FC<SummaryMessageProps> = ({ id, content, isGenerating = false, onViewSummary }) => {
  const [isLoading, setIsLoading] = useState(isGenerating);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isGenerating && content) {
      setIsLoading(false);
      setIsComplete(true);
    }
  }, [isGenerating, content]);

  const handleViewSummary = () => {
    if (content && onViewSummary) {
      onViewSummary(content);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
      <CardHeader className="">
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-purple-800">
          <FileText className="w-5 h-5" />
          <span>Review Analysis Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-purple-700">Generating comprehensive analysis...</p>
                <p className="text-xs text-purple-600">This may take 30 seconds</p>
              </div>
            </div>
          </div>
        ) : isComplete ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Analysis Complete</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-3">Your comprehensive review analysis report is ready. Click below to view the detailed insights.</p>
              <Button
                onClick={handleViewSummary}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Summary not available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
