import Stripe from "stripe";
import { handleOrderSession } from "@/services/order";
import { respOk } from "@/lib/resp";
import {
  checkAndResetSubscriptionCredits,
  CreditsTransType,
  getPriceItem,
  getUserCredits,
  increaseCredits,
  setupSubscriptionCredits,
  SubscriptionStatus,
} from "@/services/credit";
import { findUserByUuid } from "@/models/user";
import { updateUserSubscriptionCredits } from "@/models/credit";

export async function POST(req: Request) {
  try {
    const stripePrivateKey = process.env.STRIPE_PRIVATE_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripePrivateKey || !stripeWebhookSecret) {
      throw new Error("invalid stripe config");
    }

    const stripe = new Stripe(stripePrivateKey);

    const sign = req.headers.get("stripe-signature") as string;
    const body = await req.text();
    if (!sign || !body) {
      throw new Error("invalid notify data");
    }

    const event = await stripe.webhooks.constructEventAsync(body, sign, stripeWebhookSecret);

    console.log("stripe notify event: ", event.id, event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        await handleOrderSession(session);
        break;
      }

      case "customer.subscription.created": {
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const previous_attributes = event.data.previous_attributes;

        // 1. 首次订阅 - 从 incomplete 到 active
        if (previous_attributes?.status === "incomplete" && subscription.status === "active") {
          console.log("First time subscription activated:", subscription.id);
          // 处理首次订阅激活
          await handleSubscriptionActivation(subscription);
        }

        if (subscription.status === "active" && previous_attributes?.items?.data?.[0]?.price && subscription.items?.data?.[0]?.price) {
          const old_price = previous_attributes?.items?.data?.[0]?.price;
          const new_price = subscription.items?.data?.[0]?.price;

          // 2. 订阅续费 - 检查是否是续费周期
          if (old_price.id === new_price.id) {
            console.log("Subscription renewed:", subscription.id);
            // 处理订阅续费
            await handleSubscriptionRenewal(subscription, previous_attributes);
          }

          // 3. 修改订阅价格方案 - 检查价格ID是否变化
          if (old_price.id !== new_price.id) {
            console.log("Subscription plan changed:", subscription.id);
            // 处理订阅方案变更
            await handleSubscriptionPlanChange(subscription, previous_attributes);
          }
        }

        // 4. 取消订阅 - 状态变为 canceled
        if (previous_attributes?.cancel_at_period_end === false && subscription.cancel_at_period_end === true) {
          console.log("Subscription canceled:", subscription.id);
          // 处理订阅取消
          await handleSubscriptionCancellation(subscription);
        }

        // 5. 恢复订阅 - 从 canceled 到 active
        if (previous_attributes?.cancel_at_period_end === true && subscription.cancel_at_period_end === false) {
          console.log("Subscription reactivated:", subscription.id);
          // 处理订阅恢复
          await handleSubscriptionReactivation(subscription);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // 处理订阅删除
        await handleSubscriptionDeletion(subscription);

        break;
      }

      default:
      // console.log("not handle event: ", event.type);
    }

    return respOk();
  } catch (e: any) {
    console.log("stripe notify failed: ", e);
    return Response.json({ error: `handle stripe notify failed: ${e.message}` }, { status: 500 });
  }
}

// 处理订阅激活（首次订阅）
async function handleSubscriptionActivation(subscription: Stripe.Subscription) {
  try {
    const user_uuid = subscription.metadata.user_uuid;
    const order_no = subscription.metadata.order_no;
    const product_id = subscription.metadata.product_id;

    const item = subscription.items.data[0] as any;

    await setupSubscriptionCredits(item.current_period_start, order_no, user_uuid, product_id);
  } catch (error) {
    console.error("Failed to handle subscription activation:", error);
  }
}

// 处理订阅续费
async function handleSubscriptionRenewal(subscription: Stripe.Subscription, previousAttributes: any) {
  try {
    const customerId = subscription.customer as string;
    const user_uuid = subscription.metadata.user_uuid;

    console.log("Handling subscription renewal for customer:", customerId, user_uuid);

    const user = await findUserByUuid(user_uuid);
    if (!user) {
      throw new Error("user not found");
    }

    const newItem = subscription.items.data[0] as any;
    const oldItem = previousAttributes?.items?.data?.[0] as any;

    if (newItem.current_period_start === oldItem.current_period_end) {
      const end = new Date(newItem.current_period_end * 1000);

      await updateUserSubscriptionCredits(user.uuid, {
        subscription_status: SubscriptionStatus.Active,
        subscription_expires_date: end.toISOString(),
      });

      await checkAndResetSubscriptionCredits(user_uuid);
    }
  } catch (error) {
    console.error("Failed to handle subscription renewal:", error);
  }
}

// 处理订阅方案变更
async function handleSubscriptionPlanChange(subscription: Stripe.Subscription, previousAttributes: any) {
  try {
    const customerId = subscription.customer as string;
    const user_uuid = subscription.metadata.user_uuid;
    const newPriceId = subscription.items?.data?.[0]?.price?.id as string;
    const oldPriceId = previousAttributes?.items?.data?.[0]?.price?.id;

    console.log("Handling subscription plan change for customer:", customerId, user_uuid, "From:", oldPriceId, "To:", newPriceId);

    const user = await findUserByUuid(user_uuid);
    if (!user) {
      throw new Error("user not found");
    }

    const newPricingItem = await getPriceItem(newPriceId);
    const oldPricingItem = await getPriceItem(oldPriceId);
    if (!newPricingItem || !oldPricingItem) {
      throw new Error("pricing item not found");
    }

    const item = subscription.items.data[0] as any;
    const start = new Date(item.current_period_start * 1000);
    const end = new Date(item.current_period_end * 1000);
    const nextReset = new Date(start);
    nextReset.setMonth(nextReset.getMonth() + 1);

    if (newPricingItem.credits && oldPricingItem.credits) {
      const delta = newPricingItem.credits - oldPricingItem.credits;

      const user_credits = await getUserCredits(user.uuid);

      await updateUserSubscriptionCredits(user.uuid, {
        subscription_credits: (user_credits.subscription_credits || 0) + delta,
        subscription_status: SubscriptionStatus.Active,
        subscription_expires_date: end.toISOString(),
        subscription_credits_reset_date: nextReset.toISOString(),
        subscription_plan: newPricingItem.title,
        subscription_product_id: newPricingItem.product_id,
      });

      if (delta !== 0) {
        await increaseCredits({
          user_uuid: user.uuid,
          trans_type: delta > 0 ? CreditsTransType.SubscriptionUpgrade : CreditsTransType.SubscriptionDowngrade,
          credits: delta,
          description: `Subscription plan change from ${oldPricingItem.title} ${oldPricingItem.interval} to ${newPricingItem.title} ${newPricingItem.interval}`,
        });
      }
    }
  } catch (error) {
    console.error("Failed to handle subscription plan change:", error);
  }
}

// 处理订阅取消
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const user_uuid = subscription.metadata.user_uuid;

    console.log("Handling subscription cancellation for customer:", customerId, user_uuid);

    const user = await findUserByUuid(user_uuid);
    if (!user) {
      throw new Error("user not found");
    }

    await updateUserSubscriptionCredits(user.uuid, {
      subscription_status: SubscriptionStatus.Cancelled,
    });
  } catch (error) {
    console.error("Failed to handle subscription cancellation:", error);
  }
}

// 处理订阅恢复
async function handleSubscriptionReactivation(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const user_uuid = subscription.metadata.user_uuid;

    console.log("Handling subscription reactivation for customer:", customerId, user_uuid);

    const user = await findUserByUuid(user_uuid);
    if (!user) {
      throw new Error("user not found");
    }

    await updateUserSubscriptionCredits(user.uuid, {
      subscription_status: SubscriptionStatus.Active,
    });
  } catch (error) {
    console.error("Failed to handle subscription reactivation:", error);
  }
}

// 处理订阅删除
async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const user_uuid = subscription.metadata.user_uuid;

    console.log("Handling subscription deletion for customer:", customerId);

    const user = await findUserByUuid(user_uuid);
    if (!user) {
      throw new Error("user not found");
    }

    await updateUserSubscriptionCredits(user.uuid, {
      subscription_status: SubscriptionStatus.Inactive,
      subscription_credits: 0,
      subscription_expires_date: null,
      subscription_credits_reset_date: null,
      subscription_order_no: null,
      subscription_product_id: null,
      subscription_plan: null,
    });
  } catch (error) {
    console.error("Failed to handle subscription deletion:", error);
  }
}
