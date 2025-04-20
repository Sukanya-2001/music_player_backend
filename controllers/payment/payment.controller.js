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
        amount: 1000,         // optional: refund a partial amount (in cents)
      });
      console.log('Refund issued:', refund.id);
      
  } catch (error) {
    console.error("Error processing refund: ", error);
    res.status(500).send({ error: error.message });
  }
};
