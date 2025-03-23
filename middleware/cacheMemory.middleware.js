const redisClient = require("../connection/redisdb");

const cacheMemory = async (req, res, next) => {
  try {
    let cache = await redisClient.get("key");

    if (cache) {
      console.log("✅ Returned from cache");
      return res.status(200).json(JSON.parse(cache));
    }
    next();
  } catch (err) {
    console.error("❌ Redis Cache Error:", err);
    next(); 
  }
};

module.exports = cacheMemory;
