const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://default:i7t9iRE7oTuRBJMGuT9WGCjeo6heR9G9@redis-14200.c84.us-east-1-2.ec2.redns.redis-cloud.com:14200",
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (err) {
    console.log("❌ Redis connection error:", err);
  }
})();

module.exports = redisClient;
