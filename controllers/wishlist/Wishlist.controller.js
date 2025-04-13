const WishList = require("../../schema/wishList.schema");

const FavouriteController = async (req, res) => {
  console.log(req.id);

  const ExistForUser = await WishList.findOne({
    user: req.id,
    song: req.body.song_id,
  });

  try {
    if (!ExistForUser) {
      const wishList = new WishList({
        user: req.id,
        song: req.body.song_id,
        artist: req.body.artist_id,
        album: req.body.album_id || null,
      });

      const song = await wishList.save();

      res.status(200).json({ wishList: song, status: 200 });
    } else {
      const deleteWishlistFromDB = await WishList.findOneAndDelete({
        user: req.id,
        song: req.body.song_id,
      });

      res.status(200).json({ json: "Wishlist removed",status: 200 });
    }
  } catch (err) {
    console.log(err);
  }
};

const getFavouritesController = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 1;

    const total = await WishList.countDocuments();
    const totalPage = Math.ceil(total / limit);

    const wishList = await WishList.find({ user: req.params.id })
      .populate("song")
      .populate("artist")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ wishList: wishList, total, totalPage, limit, page, status: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getIds = async (req, res) => {
  try {
    const wishListIds = await WishList.find({ user: req.id }).select("song");
    res.status(200).json({ wishListIds: wishListIds, status: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  FavouriteController,
  getFavouritesController,
  getIds,
};
