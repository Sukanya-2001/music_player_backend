//name,email,phone_number,password

const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  file: {
    type: String,
    required: true,
  },
  status:{
    type:String,
    default:'active'
  }
},{
  timestamps:true
});

module.exports = mongoose.model("Artists", ArtistSchema);
