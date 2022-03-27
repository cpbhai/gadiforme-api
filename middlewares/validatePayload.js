const mongoose = require("mongoose");
const { Types } = mongoose;
const { ObjectId } = Types;
const { isEmail, phoneNumber } = require("../utils/validator");
const { addImage } = require("../services/cloudinary");
const { getOTP } = require("../utils/hardcoded");

exports.validateClientSignup = function (data) {
  data.isApproved = false;
  return data;
};

exports.validateClientLogin = function (data) {
  if (!data.phone) throw { message: "phone is missing." };
  if (!data.otp) throw { message: "otp is missing." };
};

exports.validatePartnerSignup = async function (data, files) {
  data.isApproved = false;
  if (files.idFront && files.idFront.length == 1)
    data.idFront = await addImage(files.idFront[0], "partners");
  if (files.idRear && files.idRear.length == 1)
    data.idRear = await addImage(files.idRear[0], "partners");
  if (files.panPhoto && files.panPhoto.length == 1)
    data.panPhoto = await addImage(files.panPhoto[0], "partners");
  return data;
};

exports.validatePartnerLogin = function (data) {
  if (!data.phone) throw { message: "phone is missing." };
  if (!data.otp) throw { message: "otp is missing." };
};

exports.validateAddVehicle = async function (data, who, file) {
  data.postedBy = who;
  data.vehicleNo = data.vehicleNo.toUpperCase().replace(/\s+/g, "");
  data.photo = await addImage(file, "vehicles");
  return data;
};

exports.validateShowAvailableVehicles = (query) => {
  const { dropoff, pickup, journey, date, distance } = query;
  if (!dropoff) throw { message: "dropoff is missing." };
  if (!pickup) throw { message: "pickup is missing." };
  if (!journey) throw { message: "journey is missing." };
  if (!date) throw { message: "date is missing." };
  if (!distance) throw { message: "distance is missing." };
};
