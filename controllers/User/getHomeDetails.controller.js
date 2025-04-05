const Albums = require("../../schema/albumCreation.schema");
const Artist = require("../../schema/artistCreation.schema");
const Song = require("../../schema/song.schema");

const getHomeDetails = async (req, res) => {
  try {
    const limit = parseInt(5);

    const songs = await Song.find()
      .populate("selectArtist selectAlbum")
      .limit(limit)
      .sort({ createdAt: -1 });

    const newReleases = await Song.find()
      .limit(5)
      .sort({ publishYear: -1 });
    const limitedArtists = await Artist.find()
      .limit(5)
      .sort({ createdAt: -1 });
    const limitedAlbums = await Albums.find()
      .limit(8)
      .sort({ createdAt: -1 });

    let randomSongsArray = [];
    let selectedIndices = new Set(); // To track unique indices
    const totalSongs = 6; // Number of random songs you want

    while (
      selectedIndices.size < totalSongs &&
      selectedIndices.size < newReleases.length
    ) {
      let randomIndex = Math.floor(Math.random() * newReleases.length);
      if (!selectedIndices.has(randomIndex)) {
        selectedIndices.add(randomIndex);
        randomSongsArray.push(newReleases[randomIndex]);
      }
    }

    const songslessthan90s = await Song.find({
      publishYear: {
        $gte: 1990,
        $lt: 2000,
      },
    }).limit(5);

    const the2000ssongs = await Song.find({
      publishYear: {
        $gte: 2000,
      },
    }).limit(5);

    return res.status(200).json({
      Allsongs: songs,
      newReleases: newReleases,
      limitedArtists: limitedArtists,
      limitedAlbums: limitedAlbums,
      randomSongs: randomSongsArray,
      songslessthan90s: songslessthan90s,
      the2000ssongs: the2000ssongs,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getAllDetails = async (req, res) => {
  try {
    const page = req.query.pages;
    const limit = req.query.limit;

    if (req.params.code === "nrs") {

      const total = await Song.countDocuments(); //25
      const totalPage = Math.ceil(total / limit); // 2.5==>3
      const newReleases = await Song.find()
        .skip((page-1)*limit)
        .limit(limit)
        .sort({ publishYear: -1 });

      return res.status(200).json({
        data: newReleases,
        totalPage: totalPage,
        totalReleaseSongs: total,
        page: page,
        limit: limit,
        status: 200,
      });
    }else if(req.params.code==="90s"){
        const total = await Song.countDocuments(); //25
        const totalPage = Math.ceil(total / limit); // 2.5==>3
        const songs90s = await Song.find({
            publishYear:{
                $gt:1990,
                $lt:2000,      
            }
        })
          .skip((page-1)*limit)
          .limit(limit)
          .sort({ publishYear: -1 });
  
        return res.status(200).json({
          data: songs90s,
          totalPage: totalPage,
          total90sSongs: total,
          page: page,
          limit: limit,
          status: 200,
        });
    }else if(req.params.code==="the2000ssongs"){
        const total = await Song.countDocuments(); //25
        const totalPage = Math.ceil(total / limit); // 2.5==>3
        const the2000ssongs = await Song.find({
            publishYear:{
                $gt:2000      
            }
        })
          .skip((page-1)*limit)
          .limit(limit)
          .sort({ publishYear: -1 });
  
        return res.status(200).json({
          data: the2000ssongs,
          totalPage: totalPage,
          totalthe2000ssongs: total,
          page: page,
          limit: limit,
          status: 200,
        });
    }else{
        return res.status(200).json({
           status:200,
           message:"Invalid code"
        })
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const getDiffLangSongs=async (req,res) =>{
    
    const bengaliSongs=await Song.find({language:"bengali"}).limit(5);
    const hindiSongs=await Song.find({language:"hindi"}).limit(5);
    const EnglishSongs=await Song.find({language:"english"}).limit(5);

    res.status(200).json({
        bengaliSongs,
        hindiSongs,
        EnglishSongs,
        status:200
    })
}
module.exports = {
  getHomeDetails,
  getAllDetails,
  getDiffLangSongs
};
