const mongoose = require("mongoose");
const { phoneNumber } = require("../utils/validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  address: {
    country: { type: mongoose.Types.ObjectId, ref: "Country", default: null },
    state: { type: mongoose.Types.ObjectId, ref: "State", default: null },
    city: { type: mongoose.Types.ObjectId, ref: "City", default: null },
    pincode: {
      type: String,
      default: null,
    },
    streetAddress: {
      type: String,
      default: null,
    },
    landMark: {
      type: String,
      default: null,
    },
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
});

clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
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

//Compare Password
clientSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// Generating Password Reset Token
clientSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to clientSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

clientSchema.path("phone").validate(function (phone) {
  return phoneNumber(phone);
}, "PHONE MUST BE A 10 DIGIT NUMBER.");

module.exports =
  mongoose.models.Client || mongoose.model("Client", clientSchema);
