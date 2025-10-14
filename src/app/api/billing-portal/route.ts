import { getUserEmail, getUserUuid } from "@/services/user";
import { respData, respErr } from "@/lib/resp";
import Stripe from "stripe";

export async function GET(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("Unauthorized");
    }

    const userEmail = await getUserEmail();
    if (!userEmail) {
      return respErr("User email not found");
    }

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create new customer if doesn't exist
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_uuid: user_uuid,
        },
      });
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_PAY_SUCCESS_URL}`,
    });

    return respData({
      url: session.url,
    });
  } catch (e: any) {
    console.log("billing portal failed: ", e);
    return respErr("Billing portal failed: " + e.message);
  }
}
