const express = require("express");
const cors = require("cors");
const connectdb = require("./connection/connectdb");
const redisClient = require("./connection/redisdb");
const auth = require("./routes/auth");
const artist = require("./routes/Admin/Artist");
const album = require("./routes/Admin/Album");
const song = require("./routes/Admin/Song");
const home = require("./routes/User/Home");
const app = express();
const resetpassword=require("./routes/resetpassword")

app.use(express.json());
connectdb();

app.use(
  cors({
    origin: [
      "https://musicplayer-admin-lilac.vercel.app",
      "https://musicplayer-frontend.vercel.app",
      "http://localhost:3000",
      "http://localhost:14016",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//common for both
app.use("/reset",resetpassword);

//routes for users
app.use("/user", auth);

//routes for admin

//artist
app.use("/admin/artist",artist);

//album
app.use("/admin/album", album);

//song
app.use("/admin/song",song);

//homepage

app.use("/user/home",home);

app.get("/", (req, res) => {
  res.send("working...");
});

app.listen(3001, () => {
  console.log(`app is listening on 3001`);
});
