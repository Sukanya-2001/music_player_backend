const express = require("express");
const {
    createCheckoutSession,
} = require("../controllers/payment/payment.controller.js");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
