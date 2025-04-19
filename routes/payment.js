const express = require("express");
const {
    createCheckoutSession,
    cancelTrialPlan,
    Refund
} = require("../controllers/payment/payment.controller.js");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/cancel-trial-plan", cancelTrialPlan);
router.post("/Refund", Refund);

module.exports = router;
