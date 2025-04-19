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
      "6803ee9fca3abce60cf351eb"
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
      // Get the subscription
      const subscription = await subscriptionDetailsSchema.findById(
        "6803ee9fca3abce60cf351eb"
      );
  
      // Retrieve the subscription details from Stripe
      const subscriptionDetails = await stripe.subscriptions.retrieve(
        subscription.subscriptionId
      );
  
      console.log(subscriptionDetails.latest_invoice);
  
      // Retrieve the latest invoice
      const invoice = await stripe.invoices.retrieve(subscriptionDetails.latest_invoice);
  

      console.log("65",invoice);
      // Access the charge ID from the invoice
      const chargeId = invoice.charge;
  
      // Create a refund
      const refund = await stripe.refunds.create({
        charge: chargeId,
        amount: 1000,  // Refund amount in cents (this is for $10)
      });
  
      console.log(refund);
  
      // Respond with the refund details
      res.status(200).send(refund);
  
    } catch (error) {
      console.error("Error processing refund: ", error);
      res.status(500).send({ error: error.message });
    }
  };
  
