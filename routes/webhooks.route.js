const express = require('express');
const { handleWebhook } = require('../controllers/Webhooks/Stripe.webhooks.controller');
const router = express.Router();

// handle the webhook request and response
router.post('/hook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router


// express.raw({ type: 'application/json' })
// This is a middleware function from Express.js that handles the body of the incoming HTTP request.

// express.raw() is used to capture the raw body of the request without any parsing. This is important because Stripe webhook events are sent with a raw JSON payload (as a string) and must be handled exactly as they are sent, without any modifications or parsing.
// { type: 'application/json' } ensures that this middleware will only apply to requests with the Content-Type header set to application/json. It specifies that the body will be treated as raw JSON data.