"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import moment from "moment";

interface UsageHistoryProps {
  creditsHistory: any;
  translations: any;
}

export default function UsageHistory({ creditsHistory, translations: t }: UsageHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate pagination for usage history
  const totalItems = creditsHistory.credits?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = creditsHistory.credits?.slice(startIndex, endIndex) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.usage_history.title}</CardTitle>
        <CardDescription>{t.usage_history.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.usage_history.date}</TableHead>
              <TableHead>{t.usage_history.type}</TableHead>
              <TableHead>{t.usage_history.credits}</TableHead>
              <TableHead>{t.usage_history.desc}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((credit: any) => (
              <TableRow key={credit.trans_no}>
                <TableCell>{moment(credit.created_at).format("MMM DD, YYYY HH:mm")}</TableCell>
                <TableCell>
                  <Badge variant={credit.credits > 0 ? "default" : "destructive"}>{credit.credits > 0 ? t.usage_history.earned : t.usage_history.used}</Badge>
                </TableCell>
                <TableCell className={credit.credits > 0 ? "text-green-600" : "text-red-600"}>
                  {credit.credits > 0 ? "+" : ""}
                  {credit.credits}
                </TableCell>
                <TableCell>{credit.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="text-sm text-muted-foreground w-full">
              {t.usage_history.pagination.showing} {startIndex + 1} {t.usage_history.pagination.to} {Math.min(endIndex, totalItems)}{" "}
              {t.usage_history.pagination.of} {totalItems} {t.usage_history.pagination.entries}
            </div>
            <Pagination className="w-full sm:w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  >
                    {t.usage_history.pagination.previous}
                  </PaginationPrevious>
                </PaginationItem>

                {/* Page numbers */}
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;

                  if (totalPages <= maxVisiblePages) {
                    // Show all pages if total is small
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i);
                            }}
                            isActive={currentPage === i}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  } else {
                    // Show first page
                    pages.push(
                      <PaginationItem key={1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                          }}
                          isActive={currentPage === 1}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );

                    // Show ellipsis if needed
                    if (currentPage > 3) {
                      pages.push(
                        <PaginationItem key="ellipsis1">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    // Show current page and neighbors
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i);
                            }}
                            isActive={currentPage === i}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    // Show ellipsis if needed
                    if (currentPage < totalPages - 2) {
                      pages.push(
                        <PaginationItem key="ellipsis2">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    // Show last page
                    if (totalPages > 1) {
                      pages.push(
                        <PaginationItem key={totalPages}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(totalPages);
                            }}
                            isActive={currentPage === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  }

                  return pages;
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  >
                    {t.usage_history.pagination.next}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
