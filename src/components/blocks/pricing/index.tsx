"use client";

import { CheckCircle, Loader } from "lucide-react";
import { PricingItem, Pricing as PricingType } from "@/types/blocks/pricing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "@/i18n/navigation";

export default function Pricing({
  pricing,
  isAnimated = true,
}: {
  pricing: PricingType;
  isAnimated?: boolean;
}) {
  if (pricing.disabled) {
    return null;
  }

  const { user } = useAppContext();
  const router = useRouter();

  const [group, setGroup] = useState(pricing.groups?.[0]?.name);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const handleCheckout = async (item: PricingItem, cn_pay: boolean = false) => {
    try {
      if (!user) {
        router.push("/auth/signin?callbackUrl=/pricing");
        return;
      }

      if (item.interval === "one-time") {
        router.push("/dashboard/");
        return;
      }

      const params = {
        product_id: item.product_id,
        product_name: item.product_name,
        credits: item.credits,
        interval: item.interval,
        amount: cn_pay ? item.cn_amount : item.amount,
        currency: cn_pay ? "cny" : item.currency,
        valid_months: item.valid_months,
      };

      setIsLoading(true);
      setProductId(item.product_id);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setProductId(null);

        router.push("/auth/signin?callbackUrl=/pricing");
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      const { public_key, session_id } = data;

      const stripe = await loadStripe(public_key);
      if (!stripe) {
        toast.error("checkout failed");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (e) {
      console.log("checkout failed: ", e);

      toast.error("checkout failed");
    } finally {
      setIsLoading(false);
      setProductId(null);
    }
  };

  useEffect(() => {
    if (pricing.items) {
      setGroup(pricing.items[0].group);
      setProductId(pricing.items[0].product_id);
      setIsLoading(false);
    }
  }, [pricing.items]);

  return (
    <section id={pricing.name} className="py-24">
      <div className="container">
        <div className="mx-auto mb-12 text-center">
          <h2 className="mb-4 text-4xl font-semibold lg:text-5xl">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            {pricing.description}
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-2 mx-12">
          {pricing.groups && pricing.groups.length > 0 && (
            <div className="flex h-12 mb-12 items-center rounded-md bg-muted p-1 text-lg">
              <RadioGroup
                value={group}
                className={`h-full grid-cols-${pricing.groups.length}`}
                onValueChange={(value) => {
                  setGroup(value);
                }}
              >
                {pricing.groups.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className='h-full rounded-md has-[button[data-state="checked"]]:bg-white'
                    >
                      <RadioGroupItem
                        value={item.name || ""}
                        id={item.name}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={item.name}
                        className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                      >
                        {item.title}
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-primary bg-primary px-1.5 ml-1 text-primary-foreground"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}
          <div
            className={`w-full mt-0 grid gap-6 md:grid-cols-${pricing.items?.filter((item) => !item.group || item.group === group)?.length}`}
          >
            {pricing.items?.map((item, index) => {
              if (item.group && item.group !== group) {
                return null;
              }

              const content = (
                <div
                  className={
                    item.is_featured
                      ? `bg-gray-900 rounded-2xl p-8 text-white relative shadow-xl h-full flex flex-col`
                      : `bg-white rounded-2xl p-8 border border-gray-200 h-full flex flex-col`
                  }
                >
                  {item.is_featured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        {item.label}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3
                      className={
                        item.is_featured
                          ? `text-2xl font-bold text-white mb-2`
                          : `text-2xl font-bold text-gray-900 mb-2`
                      }
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className={
                          item.is_featured
                            ? `text-gray-100 mb-6 text-sm`
                            : `text-gray-600 mb-6 text-sm`
                        }
                      >
                        {item.description}
                      </p>
                    )}

                    <div className="mb-8">
                      <span
                        className={
                          item.is_featured
                            ? `text-4xl font-bold text-white`
                            : `text-4xl font-bold text-gray-900`
                        }
                      >
                        {item.price}
                      </span>
                      <span
                        className={
                          item.is_featured ? `text-gray-100` : `text-gray-600`
                        }
                      >
                        {item.period ? `/${item.period}` : ``}
                      </span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {item.features &&
                        item.features.map((feature, fi) => {
                          return (
                            <li className="flex items-center" key={`${fi}`}>
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                              <span
                                className={
                                  item.is_featured
                                    ? `text-gray-100`
                                    : `text-gray-600`
                                }
                              >
                                {feature}
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <button
                    className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-medium mt-auto flex items-center justify-center"
                    disabled={isLoading}
                    onClick={() => {
                      if (isLoading) {
                        return;
                      }

                      handleCheckout(item);
                    }}
                  >
                    {(!isLoading ||
                      (isLoading && productId !== item.product_id)) && (
                      <p>{item.button?.title}</p>
                    )}
                    {isLoading && productId === item.product_id && (
                      <p>{item.button?.title}</p>
                    )}
                    {isLoading && productId === item.product_id && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                  </button>

                  {item.tip && (
                    <p
                      className={
                        item.is_featured
                          ? `text-gray-100 mb-6 text-center mt-2 text-sm`
                          : `text-gray-500 mb-6 text-center mt-2 text-sm`
                      }
                    >
                      {item.tip}
                    </p>
                  )}
                </div>
              );

              return <div key={index}>{content}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
