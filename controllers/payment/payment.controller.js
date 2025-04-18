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
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });

  res.status(200).send({
    redirectUrl: checkoutSession.url,
    status: 200,
  });
};
