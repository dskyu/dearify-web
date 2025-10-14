import { getUserUuid, getUserInfo } from "@/services/user";
import { getUserCredits, getCreditsHistory, SubscriptionStatus } from "@/services/credit";
import { getOrdersByUserUuid } from "@/models/order";
import { redirect } from "next/navigation";
import { getPricingPage } from "@/services/page";
import BillingClient from "./billing-client";
import { CurrentSubscription } from "./components/current-plan";

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user_uuid = await getUserUuid();
  if (!user_uuid) {
    redirect("/auth/signin");
  }

  const userCredits = await getUserCredits(user_uuid);
  const orders = await getOrdersByUserUuid(user_uuid);
  const creditsHistory = await getCreditsHistory(user_uuid, 1, 200);

  // Load billing translations
  let billingTranslations;
  try {
    billingTranslations = await import(`@/i18n/messages/${locale}.json`).then((module) => module.default);
  } catch (error) {
    billingTranslations = await import(`@/i18n/messages/en.json`).then((module) => module.default);
  }

  const pricingPage = await getPricingPage(locale);
  const t = billingTranslations.billing;

  // Get current active subscription/plan
  let currentSubscription: CurrentSubscription | undefined;
  const item = pricingPage.pricing?.items?.find((item) => item.product_id === userCredits.subscription_product_id);
  currentSubscription = {
    item: item,
    user_credits: userCredits,
  };

  return (
    <BillingClient
      userCredits={userCredits}
      orders={orders || []}
      creditsHistory={creditsHistory}
      currentSubscription={currentSubscription}
      pricingPage={pricingPage}
      translations={t}
      locale={locale}
    />
  );
}
