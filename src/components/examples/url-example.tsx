"use client";

import React from "react";
import { useCurrentUrl, useSearchParam, useAllSearchParams } from "@/hooks/use-current-url";
import { getCurrentFullUrl, getSearchParam, getAllSearchParams } from "@/lib/url";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 示例组件：展示如何获取当前URL信息
 */
export const UrlExample = () => {
  // 使用自定义Hook
  const currentUrlInfo = useCurrentUrl();
  const redirectParam = useSearchParam("redirect");
  const allParams = useAllSearchParams();

  // 使用工具函数
  const fullUrl = getCurrentFullUrl();
  const redirectFromTool = getSearchParam("redirect");
  const allParamsFromTool = getAllSearchParams();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>当前URL信息 (使用Hook)</CardTitle>
          <CardDescription>通过React Hook获取的URL信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Badge variant="outline">完整URL</Badge>
            <p className="text-sm text-gray-600 break-all">{currentUrlInfo.fullUrl}</p>
          </div>
          <div>
            <Badge variant="outline">域名</Badge>
            <p className="text-sm text-gray-600">{currentUrlInfo.origin}</p>
          </div>
          <div>
            <Badge variant="outline">路径</Badge>
            <p className="text-sm text-gray-600">{currentUrlInfo.pathname}</p>
          </div>
          <div>
            <Badge variant="outline">URL参数</Badge>
            <pre className="text-sm text-gray-600 bg-gray-100 p-2 rounded">{JSON.stringify(currentUrlInfo.searchParamsObject, null, 2)}</pre>
          </div>
          <div>
            <Badge variant="outline">redirect参数</Badge>
            <p className="text-sm text-gray-600">{redirectParam || "无"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>当前URL信息 (使用工具函数)</CardTitle>
          <CardDescription>通过工具函数获取的URL信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Badge variant="outline">完整URL</Badge>
            <p className="text-sm text-gray-600 break-all">{fullUrl}</p>
          </div>
          <div>
            <Badge variant="outline">redirect参数</Badge>
            <p className="text-sm text-gray-600">{redirectFromTool || "无"}</p>
          </div>
          <div>
            <Badge variant="outline">所有参数</Badge>
            <pre className="text-sm text-gray-600 bg-gray-100 p-2 rounded">{JSON.stringify(allParamsFromTool, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>使用示例</CardTitle>
          <CardDescription>如何在代码中使用这些URL工具</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. 获取完整URL</h4>
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {`// 使用Hook
const { fullUrl } = useCurrentUrl();

// 使用工具函数
const fullUrl = getCurrentFullUrl();`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. 获取特定参数</h4>
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {`// 使用Hook
const redirectParam = useSearchParam('redirect');

// 使用工具函数
const redirectParam = getSearchParam('redirect');`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. 获取所有参数</h4>
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {`// 使用Hook
const allParams = useAllSearchParams();

// 使用工具函数
const allParams = getAllSearchParams();`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
