//name,email,phone_number,password

const mongoose = require("mongoose");

const SongUploadSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  userId:{
    type:mongoose.SchemaTypes.ObjectId,
    ref:"Users"
  },
  imageFile:{
    type:String,
    required:true
  },
  audioFile:{
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

module.exports = mongoose.model("SongUploads", SongUploadSchema);
