const mongoose = require("mongoose");
const { phoneNumber } = require("../utils/validator");
const jwt = require("jsonwebtoken");

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  idFront: {
    public_id: {
      type: String,
      rquired: true,
    },
    url: {
      type: String,
      rquired: true,
    },
  },
  idRear: {
    public_id: {
      type: String,
      rquired: true,
    },
    url: {
      type: String,
      rquired: true,
    },
  },
  panPhoto: {
    public_id: {
      type: String,
      rquired: true,
    },
    url: {
      type: String,
      rquired: true,
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
    enum: ["Partner"],
    default: "Partner",
  },
  avgRating: {
    type: Number,
    default: 0,
  },
  ratings: [
    {
      value: {
        type: Number,
        default: 5,
        enum: [1, 2, 3, 4, 5],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(Date.now() + 330 * 60000),
  },
  otp: {
    type: String,
    default: null,
  },
});

partnerSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
};

partnerSchema.path("phone").validate(function (phone) {
  return phoneNumber(phone);
}, "PHONE MUST BE A 10 DIGIT NUMBER.");

module.exports =
  mongoose.models.Partner || mongoose.model("Partner", partnerSchema);
