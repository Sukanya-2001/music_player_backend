const express = require("express");
const {
  ArtistCreation,
  getArtists,
  DeleteArtist,
  getArtistInfo,
  UpdateArtistStatus,
  UpdateArtistFields
} = require("../../controllers/Admin/ArtistController");
const upload = require("../../middleware/upload.middleware");

const router = express.Router();

router.post("/create", upload("artists").single("image"), ArtistCreation);
router.get("/get-artists", getArtists);
router.delete("/delete-artist/:id", DeleteArtist);
router.get("/get-artist-info/:id",getArtistInfo);
router.put("/artist-status-update/:id",UpdateArtistStatus);
router.put("/artist-field-update/:id",upload("artists").single("image"), UpdateArtistFields);

module.exports = router;
