// user.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Users
let alertR = new Schema(
  {
    detection_id: {
      type: String,
    },
    fname: {
      type: String,
    },

    lname: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    recuer_id: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "Alert_NBQS",
  }
);

module.exports = mongoose.model("alertR", alertR);
