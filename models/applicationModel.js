const mongoose = require("mongoose");

const applicationModel = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    applicant: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      title: {
        type: String,
        required: true,
      },
      image: {
        Bucket: { type: String, required: true },
        Key: { type: String, required: true },
      },
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationModel);
