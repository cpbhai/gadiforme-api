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
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now() + 330 * 60000),
  },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Upcoming"],
    default: "Upcoming",
  },
  assignedVehicle: {
    type: mongoose.Types.ObjectId,
    ref: "Vehicle",
    default: null,
    select: false,
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  paymentDetails: {
    payId: {
      type: String,
      default: null,
    },
    tripAmount: {
      type: Number,
      default: 0,
      select: false,
    },
    paidAmount: {
      type: Number,
      default: 0,
      select: false,
    },
  },
});

module.exports = mongoose.models.Trip || mongoose.model("Trip", tripSchema);
