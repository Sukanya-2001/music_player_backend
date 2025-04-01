//name,email,phone_number,password

const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
      index: true,
    },
    phone_number: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => {
          return /^\d{10}$/.test(value);
        },
        message: "Phone number must be of 10.",
      },
    },
    role: {
      type: String,
      default: "User",
    },
    password: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", User);
