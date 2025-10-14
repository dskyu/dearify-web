"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";
import moment from "moment";
import { useRouter } from "@/i18n/navigation";
import BillingPortalButton from "../billing-portal-button";
import { UserCredits } from "@/types/user";
import { PricingItem } from "@/types/blocks/pricing";

export interface CurrentSubscription {
  item?: PricingItem;
  user_credits: UserCredits;
}

interface CurrentPlanProps {
  currentSubscription: CurrentSubscription | undefined;
  translations: any;
}

export default function CurrentPlan({ currentSubscription, translations: t }: CurrentPlanProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.current_plan.title}</CardTitle>
        <CardDescription>{t.current_plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSubscription?.item ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentSubscription.item?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentSubscription.item?.interval === "month"
                    ? t.current_plan.monthly_plan
                    : currentSubscription.item?.interval === "year"
                      ? t.current_plan.yearly_plan
                      : t.current_plan.one_time_plan}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={`${currentSubscription.user_credits.subscription_status === "active" ? "default" : "secondary"}`}>
                  {getSubscriptionStatus(currentSubscription.user_credits.subscription_status || "inactive", t)}
                </Badge>
                <BillingPortalButton name={"Manage Subscription"} />
              </div>
            </div>

            {currentSubscription.user_credits.subscription_status === "active" && (
              <>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">{t.current_plan.credits_reset_date}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentSubscription?.user_credits.subscription_credits_reset_date && (
                        <span className="mt-1">{moment(currentSubscription.user_credits.subscription_credits_reset_date).format("MMM DD, YYYY")}</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.current_plan.subscription_renewal_date}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentSubscription.user_credits.subscription_expires_date
                        ? moment(currentSubscription.user_credits.subscription_expires_date).format("MMM DD, YYYY")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {currentSubscription.item?.interval === "month" && (
                  <div className="">
                    <p className="text-xs text-muted-foreground font-medium">{t.current_plan.monthly_subscription_note}</p>
                  </div>
                )}

                {currentSubscription.item?.interval === "year" && (
                  <div className="">
                    <p className="text-xs text-muted-foreground font-medium">{t.current_plan.yearly_subscription_note}</p>
                  </div>
                )}
              </>
            )}

            {currentSubscription.user_credits.subscription_status === "cancelled" && (
              <>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  {moment(currentSubscription.user_credits.subscription_credits_reset_date).format("MMM DD, YYYY") !==
                    moment(currentSubscription.user_credits.subscription_expires_date).format("MMM DD, YYYY") && (
                    <>
                      <div>
                        <p className="text-sm font-medium">{t.current_plan.credits_reset_date}</p>
                        <p className="text-sm text-muted-foreground">
                          {currentSubscription?.user_credits.subscription_credits_reset_date && (
                            <span className="mt-1">{moment(currentSubscription.user_credits.subscription_credits_reset_date).format("MMM DD, YYYY")}</span>
                          )}
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <p className="text-sm font-medium">Subscription Expires Date</p>
                    <p className="text-sm text-muted-foreground">
                      {currentSubscription.user_credits.subscription_expires_date
                        ? moment(currentSubscription.user_credits.subscription_expires_date).format("MMM DD, YYYY")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="">
                  <p className="text-xs text-muted-foreground font-medium">
                    Your subscription has been cancelled. Credits will not renew after the current billing cycle ends. For annual subscriptions, credits will
                    continue to reset monthly until the subscription expires.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t.current_plan.no_active_plan}</h3>
            <p className="text-muted-foreground mb-4">{t.current_plan.no_active_plan_description}</p>
            <div className="flex justify-center space-x-2">
              <Button onClick={() => router.push("/pricing")}>{t.current_plan.view_plans}</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getSubscriptionStatus(status: string, t: any) {
  switch (status) {
    case "active":
      return t.current_plan.active;
    case "inactive":
      return t.current_plan.inactive;
    case "expired":
      return t.current_plan.expired;
    case "cancelled":
      return t.current_plan.cancelled;
    default:
      return t.current_plan.inactive;
  }
}
