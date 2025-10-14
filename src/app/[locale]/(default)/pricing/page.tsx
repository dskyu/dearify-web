import Pricing from "@/components/blocks/pricing";
import { getPricingPage } from "@/services/page";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = await getPricingPage(locale);

  let pricing = page.pricing;
  if (pricing) {
    pricing = {
      ...pricing,
      groups: pricing.groups?.filter((item) => item.name !== "one-time"),
      items: pricing.items?.filter((item) => item.group !== "one-time"),
    };
  }

  return <div className="pt-8">{pricing && <Pricing pricing={pricing} isAnimated={false} />}</div>;
}
