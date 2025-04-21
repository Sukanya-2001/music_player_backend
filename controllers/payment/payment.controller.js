const subscriptionDetailsSchema = require("../../schema/subscriptionDetails.schema");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  //   const { price_id } = req.body;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    allow_promotion_codes: true,
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1RFHynFqhCKNvicTAZthlasm",
        quantity: 1,
      },
    ],
    // subscription_data: {
    //   trial_period_days: 7,
    // },
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });

  res.status(200).send({
    redirectUrl: checkoutSession.url,
    status: 200,
  });
};

exports.updatePlan = async (req, res) => {
  try {
    // Find the user
    const user = await userModel.findOne({ email });
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({
        status: false,
        message: "User not found or no Stripe customer ID",
      });
    }
    // Update the subscription
    const updatedSubscription = await stripe.subscriptions.update(
      "sub_1RFi6jFqhCKNvicTteq7BF5p",
      {
        items: [
          {
            id: (
              await stripe.subscriptions.retrieve(
                "sub_1RFi6jFqhCKNvicTteq7BF5p"
              )
            ).items.data[0].id,
            price: "price_1RFHynFqhCKNvicTAZthlasm",
          },
        ],
        payment_behavior: "default_incomplete",
        proration_behavior: "create_prorations",
      }
    );

    // subscription.planId = new_plan_id;
    // subscription.planName = "Enterprise Plan"; // hardcoded or query from DB
    // subscription.updatedAt = new Date();
    // await subscription.save();

    const invoice = await stripe.invoices.create({
      customer: "cus_SA2EnjLJbB8dtv",
      pending_invoice_items_behavior: "include",
    });
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    console.log(finalizedInvoice);
    console.log(finalizedInvoice.hosted_invoice_url);

    res.status(200).json({
      status: true,
      message: "Subscription plan updated with proration",
      url: finalizedInvoice.hosted_invoice_url,
      updatedSubscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res
      .status(500)
      .json({ status: false, message: "Error updating subscription", error });
  }
};

exports.cancelTrialPlan = async (req, res) => {
  try {
    const subscription = await subscriptionDetailsSchema.findById(
      "6803fac4ca3abce60cf35201"
    );

    const cancelTrialPlan = await stripe.subscriptions.cancel(
      subscription.subscriptionId
    );

    console.log(cancelTrialPlan);
  } catch (err) {
    console.log(err);
  }
};

exports.Refund = async (req, res) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: "pi_3RFiAMFqhCKNvicT0gP1OUD6",
      amount: 1000, // optional: refund a partial amount (in cents)
    });
    console.log("Refund issued:", refund.id);
  } catch (error) {
    console.error("Error processing refund: ", error);
    res.status(500).send({ error: error.message });
  }
};
