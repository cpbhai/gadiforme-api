const mongoose = require("mongoose");
const { Types } = mongoose;
const { ObjectId } = Types;
const { isEmail, phoneNumber } = require("../utils/validator");

exports.validateClientSignup = function (data) {
  data.isApproved = false;
  data.otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
  return data;
};

exports.validateClientLogin = function (data) {
  if (!data.phone) throw { message: "phone is missing." };
  if (!data.otp) throw { message: "otp is missing." };
};

exports.validatePartnerSignup = function (data) {
  data.isApproved = false;
  data.otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
  return data;
};

exports.validatePartnerLogin = function (data) {
  if (!data.phone) throw { message: "phone is missing." };
  if (!data.otp) throw { message: "otp is missing." };
};

exports.validateAddVehicle = async function (data, who, file) {
  const cloudinary = require("cloudinary");
  const DatauriParser = require("datauri/parser");
  const path = require("path");
  data.postedBy = who;
  data.vehicleNo = data.vehicleNo.toUpperCase().replace(/\s+/g, "");
  const parser = new DatauriParser();
  file = parser.format(path.extname(file.originalname).toString(), file.buffer);
  const result = await cloudinary.v2.uploader.upload(file.content, {
    folder: "vehicles",
  });
  data.photo = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  return data;
};
