const express = require("express");
const {
 FavouriteController,
 getFavouritesController,
 getIds
} = require("../../controllers/wishlist/Wishlist.controller.js");
const getAuthenticated = require("../../middleware/getAuthenticated.middleware.js");

const router = express.Router();

router.post("/add-favourite", getAuthenticated, FavouriteController);
router.get("/get-favourite/:id", getAuthenticated, getFavouritesController);
router.get("/get-ids", getAuthenticated, getIds);

module.exports = router;  
