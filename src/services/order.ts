import { setupSubscriptionCredits, updateCreditForOneTimeOrder } from "./credit";
import { findOrderByOrderNo, OrderStatus, updateOrderStatus } from "@/models/order";
import { getIsoTimestr } from "@/lib/time";

import Stripe from "stripe";
import { updateAffiliateForOrder } from "./affiliate";
import { Order } from "@/types/order";

export async function handleOrderSession(session: Stripe.Checkout.Session) {
  try {
    if (!session || !session.metadata || !session.metadata.order_no || session.payment_status !== "paid") {
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paid_email = session.customer_details?.email || session.customer_email || "";
    const paid_detail = JSON.stringify(session);

    const order = await findOrderByOrderNo(order_no);
    if (!order) {
      throw new Error("invalid order");
    }

    if (order.status === OrderStatus.Paid) {
      return;
    } else if (order.status !== OrderStatus.Created) {
      throw new Error("order status is not created");
    }

    const paid_at = getIsoTimestr();
    await updateOrderStatus(order_no, OrderStatus.Paid, paid_at, paid_email, paid_detail);

    if (order.user_uuid) {
      if (order.interval === "one-time") {
        if (order.credits > 0) {
          // increase credits for paied order
          await updateCreditForOneTimeOrder(order as unknown as Order);
        }
      } else {
        // For subscription credits
        await setupSubscriptionCredits(session.created, order_no, order.user_uuid, order.product_id);
      }

      // update affiliate for paied order
      await updateAffiliateForOrder(order as unknown as Order);
    }

    console.log("handle order session successed: ", order_no, paid_at, paid_email, paid_detail);
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
}
