import {
  findCreditByOrderNo,
  getUserValidCredits,
  insertCredit,
  getCreditsByUserUuid,
  updateUserSubscriptionCredits,
  getUserSubscriptionInfo,
} from "@/models/credit";
import { credits as creditsTable } from "@/db/schema";
import { getIsoTimestr } from "@/lib/time";
import { getSnowId } from "@/lib/hash";
import { Order } from "@/types/order";
import { UserCredits } from "@/types/user";
import { getPricingPage } from "./page";
import { PricingItem } from "@/types/blocks/pricing";

export enum CreditsTransType {
  NewUser = "new_user", // initial credits for new user
  OrderPay = "order_pay", // user pay for credits
  Consume = "consume", // consume credits

  SubscriptionReset = "subscription_reset", // monthly subscription credits reset
  SubscriptionUpgrade = "subscription_upgrade", // subscription credits upgrade
  SubscriptionDowngrade = "subscription_downgrade", // subscription credits downgrade
  SubscriptionConsume = "subscription_consume", // consume subscription credits
}

export enum CreditsAmount {
  NewUserGet = 100,
  PingCost = 1,
}

export enum SubscriptionStatus {
  Active = "active",
  Inactive = "inactive",
  Cancelled = "cancelled",
  Expired = "expired",
}

export async function getUserCredits(user_uuid: string): Promise<UserCredits> {
  let user_credits: UserCredits = {
    left_credits: 0,
    one_time_credits: 0,
    subscription_credits: 0,
  };

  try {
    // Get subscription info
    const subscriptionInfo = await getUserSubscriptionInfo(user_uuid);
    if (subscriptionInfo) {
      user_credits.subscription_credits = subscriptionInfo.subscription_credits;
      user_credits.subscription_product_id = subscriptionInfo.subscription_product_id || undefined;
      user_credits.subscription_status = subscriptionInfo.subscription_status;
      user_credits.subscription_plan = subscriptionInfo.subscription_plan || undefined;
      user_credits.subscription_expires_date = subscriptionInfo.subscription_expires_date || undefined;
      user_credits.subscription_credits_reset_date = subscriptionInfo.subscription_credits_reset_date || undefined;
      user_credits.subscription_order_no = subscriptionInfo.subscription_order_no || undefined;
    }

    // Get all valid credits (one-time credits only)
    const credits = await getUserValidCredits(user_uuid);
    if (credits) {
      credits.forEach((v) => {
        if (v.trans_type === CreditsTransType.OrderPay || v.trans_type === CreditsTransType.NewUser || v.trans_type === CreditsTransType.Consume) {
          user_credits.one_time_credits! += v.credits || 0;
        }
      });
    }

    // Calculate total left credits (one-time + subscription)
    user_credits.left_credits = user_credits.one_time_credits! + (user_credits.subscription_credits || 0);

    if (user_credits.left_credits < 0) {
      user_credits.left_credits = 0;
    }

    if (user_credits.subscription_credits && user_credits.subscription_credits > 0) {
      user_credits.is_pro = true;
    }

    return user_credits;
  } catch (e) {
    console.log("get user credits failed: ", e);
    return user_credits;
  }
}

export async function decreaseCredits({
  user_uuid,
  trans_type,
  credits,
  description,
  force = false,
}: {
  user_uuid: string;
  trans_type: CreditsTransType;
  credits: number;
  description?: string;
  force?: boolean;
}) {
  try {
    let order_no = "";
    let expired_at = "";
    let left_credits = 0;
    let balance_after = 0;
    let remainingCreditsToConsume = credits;

    // Check if user has enough credits before consuming (unless force is true)
    if (!force) {
      const userCredits = await getUserCredits(user_uuid);
      const totalAvailableCredits = (userCredits.subscription_credits || 0) + (userCredits.one_time_credits || 0);

      if (totalAvailableCredits < credits) {
        throw new Error(`Insufficient credits. Required: ${credits}, Available: ${totalAvailableCredits}`);
      }
    }

    // First try to consume subscription credits
    const subscriptionInfo = await getUserSubscriptionInfo(user_uuid);
    if (subscriptionInfo && subscriptionInfo.subscription_credits > 0) {
      const subscriptionCreditsToConsume = Math.min(subscriptionInfo.subscription_credits, remainingCreditsToConsume);
      const newSubscriptionBalance = subscriptionInfo.subscription_credits - subscriptionCreditsToConsume;

      // Update subscription credits
      await updateUserSubscriptionCredits(user_uuid, {
        subscription_credits: newSubscriptionBalance,
      });

      // Record the subscription consumption transaction
      const subscription_credit: typeof creditsTable.$inferInsert = {
        trans_no: getSnowId(),
        created_at: new Date(getIsoTimestr()),
        user_uuid: user_uuid,
        trans_type: CreditsTransType.SubscriptionConsume,
        credits: 0 - subscriptionCreditsToConsume,
        order_no: "",
        description: description || `Consumed ${subscriptionCreditsToConsume} subscription credits`,
        balance_after: newSubscriptionBalance,
      };
      await insertCredit(subscription_credit);

      remainingCreditsToConsume -= subscriptionCreditsToConsume;

      // If all credits consumed from subscription, return early
      if (remainingCreditsToConsume === 0) {
        return;
      }
    }

    // If still need to consume more credits, consume from regular credits
    const validUserCredits = await getUserValidCredits(user_uuid);
    if (validUserCredits && remainingCreditsToConsume > 0) {
      for (let i = 0, l = validUserCredits.length; i < l; i++) {
        const credit = validUserCredits[i];
        left_credits += credit.credits;

        // credit enough for remaining cost
        if (left_credits >= remainingCreditsToConsume) {
          order_no = credit.order_no || "";
          expired_at = credit.expired_at?.toISOString() || "";
          balance_after = left_credits - remainingCreditsToConsume;
          break;
        }
      }
    }

    // If force is true and we still have remaining credits to consume, allow negative balance
    if (force && remainingCreditsToConsume > 0) {
      balance_after = left_credits - remainingCreditsToConsume;
    }

    // Record the regular credits consumption transaction
    const new_credit: typeof creditsTable.$inferInsert = {
      trans_no: getSnowId(),
      created_at: new Date(getIsoTimestr()),
      expired_at: new Date(expired_at),
      user_uuid: user_uuid,
      trans_type: CreditsTransType.Consume,
      credits: 0 - remainingCreditsToConsume,
      order_no: order_no,
      description: description || `Consumed ${remainingCreditsToConsume} regular credits`,
      balance_after: 0,
    };
    await insertCredit(new_credit);

    // Note: Client-side should listen for 'credits-updated' event to refresh UI
    // This event should be dispatched after successful credit consumption
  } catch (e) {
    console.log("decrease credits failed: ", e);
    throw e;
  }
}

export async function increaseCredits({
  user_uuid,
  trans_type,
  credits,
  expired_at,
  order_no,
  description,
}: {
  user_uuid: string;
  trans_type: string;
  credits: number;
  expired_at?: string;
  order_no?: string;
  description?: string;
}) {
  try {
    // Calculate balance after transaction
    const currentCredits = await getUserCredits(user_uuid);
    const balance_after = (currentCredits.left_credits || 0) + credits;

    const new_credit: typeof creditsTable.$inferInsert = {
      trans_no: getSnowId(),
      created_at: new Date(getIsoTimestr()),
      user_uuid: user_uuid,
      trans_type: trans_type,
      credits: credits,
      order_no: order_no || "",
      expired_at: expired_at ? new Date(expired_at) : null,
      description: description || `Added ${credits} credits`,
      balance_after: 0,
    };
    await insertCredit(new_credit);
  } catch (e) {
    console.log("increase credits failed: ", e);
    throw e;
  }
}

export async function updateCreditForOneTimeOrder(order: Order) {
  try {
    const credit = await findCreditByOrderNo(order.order_no);
    if (credit) {
      // order already increased credit
      return;
    }

    await increaseCredits({
      user_uuid: order.user_uuid,
      trans_type: CreditsTransType.OrderPay,
      credits: order.credits,
      expired_at: order.expired_at,
      order_no: order.order_no,
      description: `Purchase: ${order.product_name} - ${order.credits} credits`,
    });
  } catch (e) {
    console.log("update credit for order failed: ", e);
    throw e;
  }
}

// New functions for subscription credits management
export async function setupSubscriptionCredits(current_period_start: number, order_no: string, user_uuid: string, product_id: string) {
  try {
    const subscriptionInfo = await getUserSubscriptionInfo(user_uuid);
    if (subscriptionInfo && subscriptionInfo.subscription_status === SubscriptionStatus.Active) {
      return;
    }

    const item = await getPriceItem(product_id);

    let expires_date = "";
    let reset_date = "";
    const start = new Date(current_period_start * 1000);
    if (item.interval === "day") {
      // For test
      expires_date = new Date(new Date(start).setDate(start.getDate() + 1)).toISOString();
      reset_date = new Date(new Date(start).setDate(start.getDate() + 1)).toISOString();
    } else if (item.interval === "month") {
      expires_date = new Date(new Date(start).setMonth(start.getMonth() + 1)).toISOString();
      reset_date = new Date(new Date(start).setMonth(start.getMonth() + 1)).toISOString();
    } else if (item.interval === "year") {
      expires_date = new Date(new Date(start).setFullYear(start.getFullYear() + 1)).toISOString();
      reset_date = new Date(new Date(start).setMonth(start.getMonth() + 1)).toISOString();
    } else {
      throw new Error("invalid interval");
    }

    await updateUserSubscriptionCredits(user_uuid, {
      subscription_credits: item.credits,
      subscription_credits_reset_date: reset_date,
      subscription_expires_date: expires_date,
      subscription_product_id: item.product_id,
      subscription_plan: item.title,
      subscription_order_no: order_no,
      subscription_status: SubscriptionStatus.Active,
    });

    // Add initial subscription credits
    await increaseCredits({
      user_uuid: user_uuid,
      trans_type: CreditsTransType.SubscriptionReset,
      credits: item.credits || 0,
      expired_at: reset_date,
      order_no: order_no,
      description: `Initial subscription credits: ${item.title}`,
    });
  } catch (e) {
    console.log("setup subscription credits failed: ", e);
    throw e;
  }
}

export async function checkAndResetSubscriptionCredits(user_uuid: string) {
  try {
    const subscriptionInfo = await getUserSubscriptionInfo(user_uuid);
    if (!subscriptionInfo || !subscriptionInfo.subscription_credits_reset_date || !subscriptionInfo.subscription_expires_date) {
      return;
    }

    const resetDate = new Date(subscriptionInfo.subscription_credits_reset_date);
    const expiresDate = new Date(subscriptionInfo.subscription_expires_date);
    const now = new Date();

    if (expiresDate > resetDate && now >= resetDate) {
      // Get the monthly credits for the plan
      const item = await getPriceItem(subscriptionInfo.subscription_product_id as string);
      const monthlyCredits = item.credits || 0;

      const nextMonth = new Date(resetDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // Add the new monthly credits
      await increaseCredits({
        user_uuid,
        trans_type: CreditsTransType.SubscriptionReset,
        credits: monthlyCredits,
        description: `Monthly subscription reset: ${item.title} plan`,
      });

      await updateUserSubscriptionCredits(user_uuid, {
        subscription_credits: Math.min(subscriptionInfo.subscription_credits + monthlyCredits, monthlyCredits),
        subscription_credits_reset_date: nextMonth.toISOString(),
      });
    }
  } catch (e) {
    console.log("check and reset subscription credits failed: ", e);
    throw e;
  }
}

export async function getPriceItem(product_id_or_price_id: string): Promise<PricingItem> {
  const pricing = await getPricingPage("en");
  const item = pricing.pricing?.items?.find((p) => p.product_id === product_id_or_price_id || p.price_id === product_id_or_price_id);
  if (!item) {
    throw new Error("product not found");
  }

  return item;
}

export async function getCreditsHistory(user_uuid: string, page: number = 1, limit: number = 50) {
  try {
    const creditsHistory = await getCreditsByUserUuid(user_uuid, page, limit);

    return {
      credits: creditsHistory || [],
    };
  } catch (e) {
    console.log("get credits history failed: ", e);
    return { credits: [] };
  }
}
