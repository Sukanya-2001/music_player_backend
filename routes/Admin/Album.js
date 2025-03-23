const express = require("express");
const {
    AlbumCreation,
    getAlbums,
    DeleteAlbum,
    getAlbumInfo,
    UpdateAlbumStatus,
    UpdateAlbumFields
} = require("../../controllers/Admin/AlbumController");
const upload = require("../../middleware/upload.middleware");

const router = express.Router();

router.post("/create", upload("albums").single("image"), AlbumCreation);
router.get("/get-artists", getAlbums);
router.delete("/delete-artist/:id", DeleteAlbum);
router.get("/get-artist-info/:id",getAlbumInfo);
router.put("/artist-status-update/:id",UpdateAlbumStatus);
router.put("/artist-field-update/:id",upload("albums").single("image"), UpdateAlbumFields);

module.exports = router;
