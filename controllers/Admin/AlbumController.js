const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../../config/s3Bucket");
const Album = require("../../schema/albumCreation.schema");

require("dotenv").config();

const AlbumCreation = async (req, res) => {
  try {
    console.log(req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newAlbum = new Album({
      title: req.body.title,
      description: req.body.description,
      file: req.file.location,
    });

    const AlbumDB = await newAlbum.save();

    return res.status(200).json({
      AlbumDB,
      message: "Album created successfully!!",
      status: 201,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getAlbums = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const search = req.query.search || "";
    const query = {};

    if (search) {
      query.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const total = await Album.countDocuments(query); //25
    const totalPage = Math.ceil(total / limit); // 2.5==>3

    const albums = await Album.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      albums: albums,
      totalPage: totalPage,
      totalAlbums: total,
      page: page,
      limit: limit,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const DeleteAlbum = async (req, res) => {
  try {
    const album = await Album.deleteOne({ _id: req.params.id });

    console.log(album, req.params.id);

    // "https://mediaplayer020501.s3.eu-north-1.amazonaws.com/uploads/1742669273622_Screenshot%202024-01-01%20185117.png"

    console.log(
      decodeURIComponent(req.body.imageKey.split("amazonaws.com/")[1])
    );

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: decodeURIComponent(req.body.imageKey.split("amazonaws.com/")[1]),
    };

    const deleteAlbumFromAWSBucket = new DeleteObjectCommand(params);
    await s3.send(deleteAlbumFromAWSBucket);

    res.status(200).send({ message: "Album deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getAlbumInfo = async (req, res) => {
  const album = await Album.findById(req.params.id).select("-__v");

  res.status(200).json({ album, status: 200 });
};

const UpdateAlbumStatus = async (req, res) => {
  const album = await Album.findById(req.params.id).select("-__v");

  if (album.status === "active") {
    album.status = "inactive";
  } else {
    album.status = "active";
  }

  const updatedStatus = await album.save();

  res.status(200).json({
    updatedStatus,
    status: 200,
    message: "Status changed successfully.",
  });
};

const UpdateAlbumFields = async (req, res) => {
  const album = await Album.findById(req.params.id);
  const oldImageUrl = decodeURIComponent(album.file.split("amazonaws.com/")[1]);

  if (req.file) {
    album.file = req.file.location;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: oldImageUrl,
    };
    const deleteAwsObjectFromBucket = new DeleteObjectCommand(params);
    await s3.send(deleteAwsObjectFromBucket);
  } else {
    album.file = album.file;
  }

  if (album) {
    (album.title = req.body.title), (album.description = req.body.description);
  }

  await album.save();

  res.status(200).json({ message: "Album updated successfully", status: 200 });
};

module.exports = {
  AlbumCreation,
  getAlbums,
  DeleteAlbum,
  getAlbumInfo,
  UpdateAlbumStatus,
  UpdateAlbumFields,
};
