const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Song = require("../../schema/song.schema");
const s3 = require("../../config/s3Bucket");

require("dotenv").config();
const cloudfronturl = "https://d30454c5f9k748.cloudfront.net";

const SongCreation = async (req, res) => {
  try {
    if (!req.files.image || !req.files.audio) {
      return res
        .status(400)
        .json({ message: "Image or audio file is missing" });
    }

    const imageUrl = `${cloudfronturl}/${
      req.files.image[0].location.split(".amazonaws.com/")[1]
    }`;
    const audioUrl = `${cloudfronturl}/${
      req.files.audio[0].location.split(".amazonaws.com/")[1]
    }`;

    const newSong = new Song({
      title: req.body.title,
      subtitle: req.body.subtitle,
      publishYear: req.body.publishYear,
      imageFile: imageUrl,
      audioFile: audioUrl, // ✅ Save audio URL
      selectArtist: req.body.selectArtist,
      selectAlbum: req.body.selectAlbum,
      songType: req.body.songType,
      language: req.body.language,
    });

    const SongDB = await newSong.save();

    return res.status(200).json({
      SongDB,
      message: "Song created successfully!!",
      status: 201,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getSongs = async (req, res) => {
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

    const total = await Song.countDocuments(query); //25
    const totalPage = Math.ceil(total / limit); // 2.5==>3

    const songs = await Song.find(query)
      .populate("selectArtist selectAlbum")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      songs: songs,
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

const DeleteSong = async (req, res) => {
  try {
    const song = await Song.deleteOne({ _id: req.params.id });

    console.log(song, req.params.id);

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

    res.status(200).send({ message: "Song deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getSongInfo = async (req, res) => {
  const song = await Song.findById(req.params.id).select("-__v");

  res.status(200).json({ song, status: 200 });
};

const UpdateSongStatus = async (req, res) => {
  const song = await Song.findById(req.params.id).select("-__v");

  if (song.status === "active") {
    song.status = "inactive";
  } else {
    song.status = "active";
  }

  const updatedStatus = await song.save();

  res.status(200).json({
    updatedStatus,
    status: 200,
    message: "Status changed successfully.",
  });
};

const UpdateSongFields = async (req, res) => {
  const song = await Song.findById(req.params.id);
  const oldImageUrl = decodeURIComponent(
    song.file.split(".cloudfront.net/")[1]
  );

  if (req.file) {
    song.file = `${cloudfronturl}/${
      req.file.location.split(".amazonaws.com/")[1]
    }`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: oldImageUrl,
    };
    const deleteAwsObjectFromBucket = new DeleteObjectCommand(params);
    await s3.send(deleteAwsObjectFromBucket);
  } else {
    song.file = song.file;
  }

  if (song) {
    (song.title = req.body.title), (song.subtitle = req.body.subtitle);
  }

  await song.save();
  res.status(200).json({ message: "Song updated successfully", status: 200 });
};

const GetSongsOfArtistByID = async (req, res) => {
  const id = req.params.id;
  const page=parseInt(req.query.page);
  const limit=parseInt(req.query.limit);

  

  const totalSongs=await Song.countDocuments({
    selectArtist: { $in: [id] }
  });

  const totalPage= Math.ceil(totalSongs/limit);

  const filteredSongs=await Song.find({
    selectArtist: { $in: [id] }
  }).skip((page-1)*limit).limit(limit);

  res.status(200).json({
    filteredSongs,
    status: 200,
    totalSongs,
    totalPage,
    page,
    limit
  });
};

const GetSongsOfAlbumByID = async (req, res) => {
  const id = req.params.id;
  const page=parseInt(req.query.page);
  const limit=parseInt(req.query.limit);

  

  const totalSongs=await Song.countDocuments({
    selectAlbum: id
  });

  const totalPage= Math.ceil(totalSongs/limit);

  const filteredSongs=await Song.find({
    selectAlbum: id
  }).skip((page-1)*limit).limit(limit);

  res.status(200).json({
    filteredSongs,
    status: 200,
    totalSongs,
    totalPage,
    page,
    limit
  });
};

module.exports = {
  SongCreation,
  getSongs,
  DeleteSong,
  getSongInfo,
  UpdateSongStatus,
  UpdateSongFields,
  GetSongsOfArtistByID,
  GetSongsOfAlbumByID
};
