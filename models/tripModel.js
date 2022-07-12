const mongoose = require("mongoose");

const locationObj = {
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
};

const tripModel = new mongoose.Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  partner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null,
  },
  from: locationObj,
  to: [locationObj],
  isRoundTrip: {
    type: Boolean,
    required: true,
  },
  when: {
    type: Date,
    required: true,
  },
  returnTime: {
    type: Date,
    default: null, //if round trip
  },
  payment_id: {
    type: String,
    required: true,
  },
  vehicle: {
    title: {
      type: String,
      default: null,
    },
    image: {
      Bucket: { type: String, default: null },
      Key: { type: String, default: null },
    },
  },
  cost: {
    type: Number,
    required: true,
  },
  advancePaid: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.models.Trip || mongoose.model("Trip", tripModel);
