import Branding from "@/components/blocks/branding";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature1 from "@/components/blocks/feature1";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import Pricing from "@/components/blocks/pricing";
import Showcase from "@/components/blocks/showcase";
import Testimonial from "@/components/blocks/testimonial";
import { getLandingPage, getPricingPage } from "@/services/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);

  let pricing = (await getPricingPage(locale)).pricing;
  if (pricing) {
    pricing = {
      ...pricing,
      groups: pricing.groups?.filter((item) => item.name !== "one-time"),
      items: pricing.items?.filter((item) => item.group !== "one-time"),
    };
  }

  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      {page.gallery && <Feature section={page.gallery} />}
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {pricing && <Pricing pricing={pricing} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
