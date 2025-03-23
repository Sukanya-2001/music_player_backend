const express = require("express");
const { resetpassword } = require("../controllers/mail/resetpassword");

const router = express.Router();

router.post("/password", resetpassword);

module.exports = router;
