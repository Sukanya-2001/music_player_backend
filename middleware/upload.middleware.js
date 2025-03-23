const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3Bucket");
require("dotenv").config();

const upload =(folder)=> multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, `${folder}/${Date.now()}_${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, // Ensure correct content type
    contentDisposition: "inline", // Forces the file to open in the browser
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
