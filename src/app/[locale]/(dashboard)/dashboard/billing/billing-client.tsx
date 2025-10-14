"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, StarsIcon, CreditCard } from "lucide-react";
import RechargeButton from "./recharge-button";
import { CurrentPlan, UsageHistory, BillingHistory, type CurrentSubscription } from "./components";

interface BillingClientProps {
  userCredits: any;
  orders: any[];
  creditsHistory: any;
  currentSubscription: CurrentSubscription | undefined;
  pricingPage: any;
  translations: any;
  locale: string;
}

export default function BillingClient({ userCredits, orders, creditsHistory, currentSubscription, pricingPage, translations: t, locale }: BillingClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.stats.available_credits}</CardTitle>
            <StarsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCredits.left_credits}</div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.stats.one_time_credits}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{userCredits.one_time_credits || 0}</div>
                <p className="text-xs text-muted-foreground">One-time purchase credits</p>
              </div>
              {currentSubscription?.user_credits.subscription_status === "active" && (
                <RechargeButton
                  size="sm"
                  variant="default"
                  name={t.stats.recharge}
                  options={pricingPage.pricing?.items?.filter((item: any) => item.group === "one-time") || []}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.stats.subscription_credits}</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">{userCredits.subscription_credits || 0}</div>
              <div className="text-xs text-muted-foreground">{currentSubscription?.item?.credits ? `/ ${currentSubscription.item.credits}` : ""}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentSubscription?.user_credits.subscription_expires_date
                ? currentSubscription.item?.interval === "year"
                  ? t.stats.subscription_credits_desc_yearly
                  : t.stats.subscription_credits_desc
                : "No subscription"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current-plan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current-plan">{t.tabs.current_plan}</TabsTrigger>
          <TabsTrigger value="usage-history">{t.tabs.usage_history}</TabsTrigger>
          <TabsTrigger value="billing-history">{t.tabs.billing_history}</TabsTrigger>
        </TabsList>

        <TabsContent value="current-plan" className="space-y-4">
          <CurrentPlan currentSubscription={currentSubscription} translations={t} />
        </TabsContent>

        <TabsContent value="usage-history" className="space-y-4">
          <UsageHistory creditsHistory={creditsHistory} translations={t} />
        </TabsContent>

        <TabsContent value="billing-history" className="space-y-4">
          <BillingHistory orders={orders} translations={t} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
