import { getUserEmail, getUserUuid } from "@/services/user";
import { insertOrder, updateOrderSession } from "@/models/order";
import { respData, respErr } from "@/lib/resp";

import Stripe from "stripe";
import { findUserByUuid, updateUserStripeCustomerId } from "@/models/user";
import { getSnowId } from "@/lib/hash";
import { getPricingPage } from "@/services/page";
import { PricingItem } from "@/types/blocks/pricing";
import { orders } from "@/db/schema";

export async function POST(req: Request) {
  try {
    let { credits, currency, amount, interval, product_id, product_name, valid_months, cancel_url } = await req.json();

    if (!cancel_url) {
      cancel_url = `${process.env.NEXT_PUBLIC_PAY_CANCEL_URL || process.env.NEXT_PUBLIC_WEB_URL}`;
    }

    if (!amount || !interval || !currency || !product_id) {
      return respErr("invalid params");
    }

    // validate checkout params
    const page = await getPricingPage("en");
    if (!page || !page.pricing || !page.pricing.items) {
      return respErr("invalid pricing table");
    }

    const item = page.pricing.items.find((item: PricingItem) => item.product_id === product_id);

    let isPriceValid = false;

    if (currency === "cny") {
      isPriceValid = item?.cn_amount === amount;
    } else {
      isPriceValid = item?.amount === amount && item?.currency === currency;
    }

    if (!item || !item.amount || !item.interval || !item.currency || item.interval !== interval || !isPriceValid) {
      return respErr("invalid checkout params");
    }

    if (!["year", "month", "day", "one-time"].includes(interval)) {
      return respErr("invalid interval");
    }

    const is_subscription = interval === "month" || interval === "year" || interval === "day";

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth, please sign-in");
    }

    let user_email = await getUserEmail();
    if (!user_email) {
      const user = await findUserByUuid(user_uuid);
      if (user) {
        user_email = user.email;
      }
    }
    if (!user_email) {
      return respErr("invalid user");
    }

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

    const customers = await stripe.customers.list({
      email: user_email,
      limit: 1,
    });

    let stripe_customer_id = "";

    if (customers.data.length === 0) {
      const customer = await stripe.customers.create({
        email: user_email,
        name: user_email,
        metadata: {
          user_uuid: user_uuid,
        },
      });
      stripe_customer_id = customer.id;
      await updateUserStripeCustomerId(user_uuid, { stripe_customer_id: stripe_customer_id });
    } else {
      stripe_customer_id = customers.data[0].id;
    }

    if (is_subscription) {
      const subscriptions = await stripe.subscriptions.list({
        customer: stripe_customer_id,
        status: "all",
      });
      const active_subscriptions = subscriptions.data.filter((subscription) => subscription.status === "active" || subscription.status === "trialing");
      if (active_subscriptions.length > 0) {
        return respErr("user already has an subscription");
      }
    }

    const order_no = getSnowId();

    const currentDate = new Date();
    const created_at = currentDate.toISOString();

    let expired_at = "";

    const timePeriod = new Date(currentDate);
    timePeriod.setMonth(currentDate.getMonth() + valid_months);

    const timePeriodMillis = timePeriod.getTime();
    let delayTimeMillis = 0;

    // subscription
    if (is_subscription) {
      delayTimeMillis = 24 * 60 * 60 * 1000; // delay 24 hours expired
    }

    const newTimeMillis = timePeriodMillis + delayTimeMillis;
    const newDate = new Date(newTimeMillis);

    expired_at = newDate.toISOString();

    const order = {
      order_no: order_no,
      created_at: new Date(created_at),
      user_uuid: user_uuid,
      user_email: user_email,
      amount: amount,
      interval: interval,
      expired_at: new Date(expired_at),
      status: "created",
      credits: credits,
      currency: currency,
      product_id: product_id,
      product_name: product_name,
      valid_months: valid_months,
    };
    await insertOrder(order as typeof orders.$inferInsert);

    let options: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      customer: stripe_customer_id,
      metadata: {
        project: process.env.NEXT_PUBLIC_PROJECT_NAME || "",
        order_no: order_no.toString(),
        user_email: user_email,
        user_uuid: user_uuid,
        product_name: product_name,
        product_id: product_id,
      },
      mode: is_subscription ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_WEB_URL}/pay-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url,
    };

    if (item.price_id) {
      options.line_items = [
        {
          price: item.price_id,
          quantity: 1,
        },
      ];
    } else {
      options.line_items = [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: product_name,
            },
            unit_amount: amount,
            recurring: is_subscription
              ? {
                  interval: interval,
                }
              : undefined,
          },
          quantity: 1,
        },
      ];
    }

    if (is_subscription) {
      options.subscription_data = {
        metadata: options.metadata,
      };
    } else {
      options.payment_intent_data = {
        setup_future_usage: "off_session",
      };
    }

    if (currency === "cny") {
      options.payment_method_types = ["wechat_pay", "alipay", "card"];
      options.payment_method_options = {
        wechat_pay: {
          client: "web",
        },
        alipay: {},
      };
    }

    const order_detail = JSON.stringify(options);

    const session = await stripe.checkout.sessions.create(options);

    const stripe_session_id = session.id;
    await updateOrderSession(order_no, stripe_session_id, order_detail);

    return respData({
      public_key: process.env.STRIPE_PUBLIC_KEY,
      order_no: order_no,
      session_id: stripe_session_id,
    });
  } catch (e: any) {
    console.log("checkout failed: ", e);
    return respErr("checkout failed: " + e.message);
  }
}
