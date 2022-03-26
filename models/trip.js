const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["City", "Outstation", "Other"],
  },
  pickup: {
    type: String,
    default: null,
  },
  dropoff: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    required: true,
  },
  journey: {
    type: String,
    default: null,
  },
  purpose: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now() + 330 * 60000),
  },
});

module.exports = mongoose.models.Trip || mongoose.model("Trip", tripSchema);
