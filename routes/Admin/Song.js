const express = require("express");
const {
  SongCreation,
  getSongs,
  DeleteSong,
  getSongInfo,
  UpdateSongStatus,
  UpdateSongFields,
} = require("../../controllers/Admin/SongController");
const upload = require("../../middleware/upload.middleware");

const router = express.Router();

router.post(
  "/create",
  upload("songs").fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  SongCreation
);
router.get("/get-songs", getSongs);
router.delete("/delete-song/:id", DeleteSong);
router.get("/get-song-info/:id", getSongInfo);
router.put("/song-status-update/:id", UpdateSongStatus);
router.put(
  "/song-field-update/:id",
  upload("songs").single("audio"),
  UpdateSongFields
);

module.exports = router;
