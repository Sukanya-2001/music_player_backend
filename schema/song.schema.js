//name,email,phone_number,password

const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  subtitle: {
    type: String,
    // required: true,
  },
  publishYear: {
    type: Number,
    required: true,
  },
  imageFile:{
    type:String,
    required:true
  },
  audioFile:{
    type:String,
    required:true
  },
  selectArtist:[{
    type:mongoose.SchemaTypes.ObjectId,
    ref:"Artists",
    required:true
  }],
  selectAlbum:{
    type:mongoose.SchemaTypes.ObjectId,
    ref:"Albums",
    required:true
  },
  songType:{
    type:Array,
    required:true
  },
  language:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:'active'
  }
},{
  timestamps:true
});

module.exports = mongoose.model("Songs", SongSchema);
