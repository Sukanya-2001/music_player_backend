const express = require("express");
const {
  getHomeDetails,
  getAllDetails,
  getDiffLangSongs
} = require("../../controllers/User/getHomeDetails.controller.js");
const getAuthenticated = require("../../middleware/getAuthenticated.middleware.js");

const router = express.Router();

router.get("/get-home-details", getHomeDetails);
router.get("/get-all-details/:code", getAllDetails);
router.get("/more-songs",getDiffLangSongs);

module.exports = router;
