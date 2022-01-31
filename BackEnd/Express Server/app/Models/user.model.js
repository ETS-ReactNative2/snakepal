// user.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Users
let user = new Schema(
  {
    username: {
      required: true,
      unique: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },

    email: {
      required: true,
      unique: true,
      type: String,
    },
    firstname: {
      required: true,
      type: String,
    },
    lastname: {
      required: true,
      type: String,
    },

    phoneNo: {
      type: String,
    },

    img: {
      type: String,
    },

    manualrecommendDetections: {
      type: Array,
    },

    successDetections: {
      type: Array,
    },

    mannualDetectionResults: {
      type: Array,
    },

    rescueAlertIds: {
      type: Array,
    },
    detectionIds: {
      type: Array,
    },
  },
  {
    timestamps: true,
    collection: "User_NBQS",
  }
);

module.exports = mongoose.model("user", user);
