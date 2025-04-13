const WishList = require("../../schema/wishList.schema");

const FavouriteController = async (req, res) => {
  console.log(req.id);

  try {
    const wishList = new WishList({
      user: req.id,
      song: req.body.song_id,
      artist: req.body.artist_id,
      album: req.body.album_id,
    });

    const song = await wishList.save();

    res.status(200).json({ wishList: song, status: 200 });
  } catch (err) {
    console.log(err);
  }
};

const getFavouritesController = async (req, res) => {
  try {

    const page=parseInt(req.body.page) || 1;
    const limit=parseInt(req.body.limit) || 1;

    const total=await WishList.countDocuments();
    const totalPage= Math.ceil(total/limit);


    const wishList = await WishList.find({ user: req.params.id })
      .populate("user")
      .populate("song")
      .populate("artist")
      .populate("album")
      .skip((page-1)*limit)
      .limit(limit)
      .sort({createdAt:-1})

    res.status(200).json({ wishList: wishList,
      total,
      totalPage,
      limit,
      page,
      status: 200 });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  FavouriteController,
  getFavouritesController,
};
