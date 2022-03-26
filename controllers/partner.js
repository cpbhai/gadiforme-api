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
    req.body = validatePartnerSignup(req.body);
    const user = await Partner.create(req.body);
    if (user.email) sendEmail("signup", { email: user.email, name: user.name });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
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
    req.body = validateAddVehicle(req.body, req.user._id);
    const vehicle = await Vehicle.create(req.body);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    errorResponse(res, error);
  }
};
