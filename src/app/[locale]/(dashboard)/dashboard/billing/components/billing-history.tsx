"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";

interface BillingHistoryProps {
  orders: any[];
  translations: any;
}

export default function BillingHistory({ orders, translations: t }: BillingHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.billing_history.title}</CardTitle>
        <CardDescription>{t.billing_history.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.billing_history.date}</TableHead>
              <TableHead>{t.billing_history.plan}</TableHead>
              <TableHead>{t.billing_history.amount}</TableHead>
              <TableHead>{t.billing_history.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: any) => (
              <TableRow key={order.order_no}>
                <TableCell>{moment(order.created_at).format("MMM DD, YYYY HH:mm")}</TableCell>
                <TableCell>{order.product_name}</TableCell>
                <TableCell>
                  {order.currency === "cny" ? "¥" : "$"}
                  {order.amount / 100}
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === "paid" ? "default" : "secondary"}>{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
