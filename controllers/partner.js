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
const { getOTP } = require("../utils/hardcoded");
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

exports.sendOtp = async (req, res) => {
  try {
    if (!req.body.phone) throw { message: "phone is missing." };
    const partner = await Partner.findOne({ phone: req.body.phone });
    if (!partner) throw { message: "phone is not registered with us." };
    const currDate = new Date(new Date().getTime() + 60000 * 330);
    const blockedTime =
      partner.otp.blockedTill == null ? null : partner.otp.blockedTill;
    // console.log(currDate, blockedTime);
    if (partner.otp.trialCount == 3) {
      partner.otp.blockedTill = new Date(currDate.getTime() + 60000 * 60 * 24);
      partner.otp.trialCount = 0;
      partner.otp.value = null;
      partner.save();
      console.log("me");
      throw {
        message: `otp limit exceeded, blocked till: ${moment(
          new Date(partner.otp.blockedTill.getTime() - 60000 * 330)
        ).format("H:mm:ss DD MMMM YY")}`,
      };
    } else if (blockedTime == null || blockedTime <= currDate) {
      const otp = getOTP();
      // console.log(otp);
      const { sendOtp } = require("../services/otp");
      sendOtp(otp, req.body.phone);
      partner.otp.value = otp;
      partner.otp.trialCount += 1;
      partner.otp.blockedTill = null;
      partner.save();
    } else
      throw {
        message: `otp limit exceeded, blocked till: ${moment(
          new Date(blockedTime.getTime() - 60000 * 330)
        ).format("H:mm:ss DD MMMM YY")}`,
      };
    res.status(200).json({
      success: true,
      message: `otp was sent successfully on: ${req.body.phone}`,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    validatePartnerLogin(req.body);
    const partner = await Partner.findOne({
      phone: req.body.phone,
    }).select("+otp.value");
    if (!partner) throw { message: "either phone or password is incorrect." };
    // console.log(partner);
    // if(partner.otp.blockedTill)
    if (partner.otp.value == null) throw { message: "otp is expired." };
    if (partner.otp.value != req.body.otp) {
      throw { message: "wrong otp was entered." };
    }
    const token = partner.getJWTToken();
    partner.isApproved = true;
    partner.otp = { value: null, trialCount: 0, blockedTill: null };
    partner.save();
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
