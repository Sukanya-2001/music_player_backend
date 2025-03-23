const express = require("express");
const { UserRegister } = require("../controllers/auth/UserRegister");
const { UserLogin } = require("../controllers/auth/UserLogin");

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);

module.exports = router;
