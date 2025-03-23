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
router.get("/get-albums", getAlbums);
router.delete("/delete-album/:id", DeleteAlbum);
router.get("/get-album-info/:id",getAlbumInfo);
router.put("/album-status-update/:id",UpdateAlbumStatus);
router.put("/album-field-update/:id",upload("albums").single("image"), UpdateAlbumFields);

module.exports = router;
