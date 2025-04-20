const songUploadSchema = require("../../schema/songUpload.schema");

const ExploreSongs = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 1;

    const totalSongs = await songUploadSchema.countDocuments();
    const totalPage = Math.ceil(totalSongs / limit);

    const exploreSongs = await songUploadSchema
      .find().populate("userId")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: 200,
      limit: limit,
      totalPage: totalPage,
      totalSongs: totalSongs,
      exploreSongs,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
    ExploreSongs,
};
