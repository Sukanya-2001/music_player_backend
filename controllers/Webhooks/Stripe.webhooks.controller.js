const SubscriptionDetails = require("../../schema/subscriptionDetails.schema");

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
    console.log("handleCheckoutSession", session);
  
    const subscription = await stripe.subscriptions.retrieve(session.subscription, {
      expand: ["latest_invoice"],
    });

    console.log(subscription);
  
    const invoice = subscription.latest_invoice;
    // console.log(invoice.hosted_invoice_url);
  
    const existingCustomer = await stripe.customers.list({
      email: session.customer_details.email,
      limit: 1,
    });

    console.log(existingCustomer);

    if (existingCustomer.data.length===0) {
      const customer = await stripe.customers.create({
        email: session.customer_details.email,
        name: session.customer_details.name,
      });
  
      await SubscriptionDetails.create({
        customerId: session.customer,
        subscriptionId: session.subscription,
        invoice: invoice.id,
        amount_subtotal: session.amount_subtotal,
        email: session.customer_details.email,
        name: session.customer_details.name,
        priceId: subscription.items.data[0].price.id,
      });
  
      console.log("New customer created:", customer);
    } else {
      console.log("Existing customer:", existingCustomer.data[0]);
    }
}
  

async function handleInvoicePaymentSucceeded(invoice) {
  console.log("handleInvoicePaymentSucceeded", invoice);
}
