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

exports.validateAddVehicle = function (data, who) {
  data.postedBy = who;
  return data;
};
