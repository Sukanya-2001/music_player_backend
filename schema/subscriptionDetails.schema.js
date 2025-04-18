const { default: mongoose } = require("mongoose");

const SubscriptionDetailsSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    subscriptionId: {
      type: String,
      required: true,
    },
    invoice: {
      type: String,
      required: true,
    },
    amount_subtotal: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    priceId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SubscriptionDetails",
  SubscriptionDetailsSchema
);
