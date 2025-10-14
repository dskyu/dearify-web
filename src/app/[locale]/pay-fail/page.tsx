import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PayFailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Payment Failed</CardTitle>
          <CardDescription className="text-base">We couldn't process your payment. Please try again.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Possible reasons:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Card was declined by your bank</li>
              <li>• Payment method is not supported</li>
              <li>• Network connection issues</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link href="/dashboard/billing" className="w-full">
              <Button className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>If the problem persists, please contact our support team.</p>
            <p>We're here to help you complete your purchase.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
