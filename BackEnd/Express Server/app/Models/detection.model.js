// user.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Users
let detection = new Schema(
  {
    RTLabel: {
      type: String,
    },

    RTScore: {
      type: Number,
    },

    lang: {
      type: Number,
    },
    long: {
      type: Number,
    },

    user_Id: {
      type: String,
    },

    videoURL: {
      type: String,
    },

    FinalLabel: {
      type: String,
    },

    FinalScore: {
      type: Number,
    },

    HeadLabel: {
      type: String,
    },

    HeadScore: {
      type: Number,
    },

    TailLabel: {
      type: String,
    },

    TailScore: {
      type: Number,
    },
    BodyLabel: {
      type: String,
    },

    BodyScore: {
      type: Number,
    },

    ManualLabel: {
      type: String,
    },

    ManualScore: {
      type: Number,
    },

    // 0 pending , 1 successful server detection , 2 failed or error server detection, 3 recommend for manual detections, 4 manual detection done
    status: {
      type: Number,
    },
  },

  {
    timestamps: true,
    collection: "detection_NBQS",
  }
);

module.exports = mongoose.model("detection", detection);
