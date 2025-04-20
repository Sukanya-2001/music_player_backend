const express = require("express");
const { UserRegister } = require("../controllers/auth/UserRegister");
const { UserLogin } = require("../controllers/auth/UserLogin");
const { UserProfile } = require("../controllers/auth/UserProfile");
const { songUpload } = require("../controllers/auth/SongUpload");
const { ExploreSongs } = require("../controllers/auth/ExploreSongs");
const getAuthenticated = require("../middleware/getAuthenticated.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/profile", getAuthenticated, UserProfile);
router.post("/add-song", getAuthenticated, upload("user").fields([
    {name:"image",maxCount:1},
    {name:"audio",maxCount:1}
]),songUpload);

router.get("/explore-songs",ExploreSongs);

module.exports = router; 
