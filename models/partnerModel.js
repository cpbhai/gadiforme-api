const mongoose = require("mongoose");
const { phoneNumber } = require("../utils/validator");

const locationObj = {
  State: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  Place: {
    type: String,
    required: true,
  },
};

const partnerModel = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    PhoneExt: {
      type: String,
      default: "+91",
    },
    Phone: {
      type: String,
      required: true,
      unique: { index: true },
    },
    Location: locationObj,
  },
  {
    timestamps: true,
  }
);

partnerModel.path("Phone").validate(function (phone) {
  return phoneNumber(phone);
}, "Phone must be a 10 digit number");

module.exports =
  mongoose.models.Partner || mongoose.model("Partner", partnerModel);
