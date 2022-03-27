const mongoose = require("mongoose");
const { phoneNumber } = require("../utils/validator");
const jwt = require("jsonwebtoken");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  email: {
    type: String,
    default: null,
  },
  isApproved: {
    type: Boolean,
    required: true,
  },
  address: {
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
  },
  role: {
    type: String,
    enum: ["Client"],
    default: "Client",
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now() + 330 * 60000),
  },
  otp: {
    value: {
      type: String,
      default: null,
      select: false,
    },
    trialCount: {
      type: Number,
      default: 0,
    },
    blockedTill: {
      type: Date,
      default: null,
    },
  },
});

clientSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
};

clientSchema.path("phone").validate(function (phone) {
  return phoneNumber(phone);
}, "PHONE MUST BE A 10 DIGIT NUMBER.");

module.exports =
  mongoose.models.Client || mongoose.model("Client", clientSchema);
