const { default: mongoose } = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Users",
    },

    song: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Songs",
    },

    artist: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Artists",
      },
    ],

    album: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Albums",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wishlists", wishlistSchema);
