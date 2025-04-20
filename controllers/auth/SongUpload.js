const songUploadSchema = require("../../schema/songUpload.schema");
const cloudfronturl = "https://d30454c5f9k748.cloudfront.net";

const songUpload = async (req, res) => {
  try {
    const imageUrl = `${cloudfronturl}/${
      req.files.image[0].location.split(".amazonaws.com/")[1]
    }`;
    const audioUrl = `${cloudfronturl}/${
      req.files.audio[0].location.split(".amazonaws.com/")[1]
    }`;

    const songUpload = new songUploadSchema({
      type: req.body.type,
      userId:req.id,
      imageFile: imageUrl,
      audioFile: audioUrl,
    });

    await songUpload.save();

    res.status(200).json({
      songUpload,
      status: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  songUpload,
};
