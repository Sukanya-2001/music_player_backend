const express = require("express");
const { UserRegister } = require("../controllers/auth/UserRegister");
const { UserLogin } = require("../controllers/auth/UserLogin");
const { UserProfile } = require("../controllers/auth/UserProfile");
const getAuthenticated = require("../middleware/getAuthenticated.middleware");

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/profile", getAuthenticated, UserProfile);

module.exports = router; 
