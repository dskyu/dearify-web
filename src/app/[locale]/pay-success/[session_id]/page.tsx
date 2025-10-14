import Stripe from "stripe";
import { handleOrderSession } from "@/services/order";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function PaySuccessPage({ params }: { params: Promise<{ session_id: string }> }) {
  try {
    const { session_id } = await params;

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      redirect(process.env.NEXT_PUBLIC_PAY_FAIL_URL || "/");
    }

    await handleOrderSession(session);

    // 获取订单信息用于显示
    const orderNo = session.metadata?.order_no;
    const productName = session.metadata?.product_name;
    const credits = session.metadata?.credits;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Payment Successful!</CardTitle>
            <CardDescription className="text-base">Your payment has been processed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Order ID:</span>
                <span className="font-mono text-sm">{orderNo}</span>
              </div>
              {productName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product:</span>
                  <span className="font-medium">{productName}</span>
                </div>
              )}
              {credits && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Credits Added:</span>
                  <span className="font-bold text-green-600">{credits}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Link href="/dashboard/billing" className="w-full">
                <Button className="w-full" size="lg">
                  <CreditCard className="mr-2 h-4 w-4" />
                  View Billing Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>You will receive a confirmation email shortly.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (e) {
    console.error("Payment success page error:", e);
    redirect(process.env.NEXT_PUBLIC_PAY_FAIL_URL || "/");
  }
}
