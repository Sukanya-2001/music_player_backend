const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handleWebhook = async (req, res) => {
  const rawBody = req.body;
  console.log("Request body: ", typeof rawBody);
  const sig = req.headers["stripe-signature"];
  console.log("signature", sig);

  const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Webhook event type : ", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    return res.status(500).send(`Error processing webhook: ${err.message}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

async function handleCheckoutSessionCompleted(session) {
  console.log(session);

  const subscription=await stripe.subscriptions.retrieve(session.subscription);

  console.log(subscription);

  const invoice=await stripe.invoices.retrieve(subscription.latest_invoice);

  console.log(invoice.hosted_invoice_url); 

}
