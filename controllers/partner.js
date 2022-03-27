const errorResponse = require("../utils/errorResponse");
const {
  validatePartnerSignup,
  validatePartnerLogin,
  validateAddVehicle,
} = require("../middlewares/validatePayload");
//const mongoose = require("mongoose");
const Partner = require("../models/partner");
const Vehicle = require("../models/vehicle");
const sendEmail = require("../services/sendEmail");
// const { getCurrentDate } = require("../utils/commonFunctions");

exports.signup = async (req, res) => {
  try {
    // console.log(req.files, req.body);
    req.body = await validatePartnerSignup(req.body, req.files);
    const user = await Partner.create(req.body);
    // if (user.email) sendEmail("signup", { email: user.email, name: user.name });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    const cloudinary = require("../services/cloudinary");
    if (req.body.idFront) {
      cloudinary.removeImage(req.body.idFront.public_id);
    }
    if (req.body.idRear) {
      cloudinary.removeImage(req.body.idRear.public_id);
    }
    if (req.body.panPhoto) {
      cloudinary.removeImage(req.body.panPhoto.public_id);
    }
    errorResponse(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    validatePartnerLogin(req.body);
    const partner = await Partner.findOne({ phone: req.body.phone });
    if (!partner) throw { message: "either phone or password is incorrect." };
    const token = partner.getJWTToken();
    res.status(200).json({ success: true, data: partner, token });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.addvehicle = async (req, res) => {
  try {
    // console.log(req.body);
    req.body = await validateAddVehicle(req.body, req.user._id, req.file);
    const vehicle = await Vehicle.create(req.body);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    if (req.body.photo) {
      require("../services/cloudinary").removeImage(req.body.photo.public_id);
    }
    errorResponse(res, error);
  }
};
