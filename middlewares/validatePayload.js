const mongoose = require("mongoose");
const { Types } = mongoose;
const { ObjectId } = Types;
const { isEmail, phoneNumber } = require("../utils/validator");

exports.validateClientSignup = function (data) {
  return data;
};

exports.validateClientLogin = function (data) {
  if (!data.phone) throw { message: "phone is missing." };
  if (!data.password) throw { message: "password is missing." };
  return data;
};
