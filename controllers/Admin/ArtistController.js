const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Artist = require("../../schema/artistCreation.schema");
const s3 = require("../../config/s3Bucket");

require("dotenv").config();
const cloudfronturl="https://d30454c5f9k748.cloudfront.net"

const ArtistCreation = async (req, res) => {
  try {
    console.log(req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const publicurl=`${cloudfronturl}/${req.file.location.split(".amazonaws.com/")[1]}`;

    const newArtist = new Artist({
      title: req.body.title,
      description: req.body.description,
      file: publicurl,
    });

    const ArtistDB = await newArtist.save();

    return res.status(200).json({
      ArtistDB,
      message: "Artist created successfully!!",
      status: 201,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getArtists = async (req, res) => {
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

    const total = await Artist.countDocuments(query); //25
    const totalPage = Math.ceil(total / limit); // 2.5==>3

    const artists = await Artist.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      artists: artists,
      totalPage: totalPage,
      totalArtist: total,
      page: page,
      limit: limit,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const DeleteArtist = async (req, res) => {
  try {
    const artist = await Artist.deleteOne({ _id: req.params.id });

    console.log(artist, req.params.id);

    // "https://mediaplayer020501.s3.eu-north-1.amazonaws.com/uploads/1742669273622_Screenshot%202024-01-01%20185117.png"

    console.log(
      decodeURIComponent(req.body.imageKey.split("amazonaws.com/")[1])
    );

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: decodeURIComponent(req.body.imageKey.split("amazonaws.com/")[1]),
    };

    const deleteArtistFromAWSBucket = new DeleteObjectCommand(params);
    await s3.send(deleteArtistFromAWSBucket);

    res.status(200).send({ message: "Artist deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getArtistInfo = async (req, res) => {
  const artist = await Artist.findById(req.params.id).select("-__v");

  res.status(200).json({ artist, status: 200 });
};

const UpdateArtistStatus = async (req, res) => {
  const artist = await Artist.findById(req.params.id).select("-__v");

  if (artist.status === "active") {
    artist.status = "inactive";
  } else {
    artist.status = "active";
  }

  const updatedStatus = await artist.save();

  res.status(200).json({
    updatedStatus,
    status: 200,
    message: "Status changed successfully.",
  });
};

const UpdateArtistFields = async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  const oldImageUrl = decodeURIComponent(
    artist.file.split("amazonaws.com/")[1]
  );

  if (req.file) {
    artist.file = req.file.location;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: oldImageUrl,
    };
    const deleteAwsObjectFromBucket = new DeleteObjectCommand(params);
    await s3.send(deleteAwsObjectFromBucket);
  } else {
    artist.file = artist.file;
  }

  if (artist) {
    (artist.title = req.body.title),
      (artist.description = req.body.description);
  }

  await artist.save();
  res.status(200).json({ message: "Artist updated successfully", status: 200 });
};

module.exports = {
  ArtistCreation,
  getArtists,
  DeleteArtist,
  getArtistInfo,
  UpdateArtistStatus,
  UpdateArtistFields,
};
