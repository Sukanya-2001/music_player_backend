const { default: mongoose } = require("mongoose");

function connectdb() {
  mongoose
    .connect(
      "mongodb+srv://sukanyasett2018:l8ILZ7RXoD7EKg1X@cluster0.8anzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((res) => {
      console.log("Mongodb is connected!!");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports=connectdb
