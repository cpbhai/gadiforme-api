const errorResponse = require("../utils/errorResponse");
const {
  validateClientSignup,
  validateClientLogin,
} = require("../middlewares/validatePayload");
//const mongoose = require("mongoose");
const Client = require("../models/client");
const sendEmail = require("../services/sendEmail");
const { getOTP } = require("../utils/hardcoded");
const moment = require("moment");

exports.signup = async (req, res) => {
  try {
    req.body = validateClientSignup(req.body);
    const user = await Client.create(req.body);
    if (user.email) sendEmail("signup", { email: user.email, name: user.name });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    errorResponse(res, error);
  }
};

exports.sendOtp = async (req, res) => {
  try {
    if (!req.body.phone) throw { message: "phone is missing." };
    const client = await Client.findOne({ phone: req.body.phone });
    if (!client) throw { message: "phone is not registered with us." };
    const currDate = new Date(new Date().getTime() + 60000 * 330);
    const blockedTime =
      client.otp.blockedTill == null ? null : client.otp.blockedTill;
    // console.log(currDate, blockedTime);
    if (client.otp.trialCount == 3) {
      client.otp.blockedTill = new Date(currDate.getTime() + 60000 * 60 * 24);
      client.otp.trialCount = 0;
      client.otp.value = null;
      client.save();
      console.log("me");
      throw {
        message: `otp limit exceeded, blocked till: ${moment(
          new Date(client.otp.blockedTill.getTime() - 60000 * 330)
        ).format("hh:mm:ss DD MMMM YY")}`,
      };
    } else if (blockedTime == null || blockedTime <= currDate) {
      const otp = getOTP();
      // console.log(otp);
      const { sendOtp } = require("../services/otp");
      sendOtp(otp, req.body.phone);
      client.otp.value = otp;
      client.otp.trialCount += 1;
      client.otp.blockedTill = null;
      client.save();
    } else
      throw {
        message: `otp limit exceeded, blocked till: ${moment(
          new Date(blockedTime.getTime() - 60000 * 330)
        ).format("hh:mm:ss DD MMMM YY")}`,
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
    validateClientLogin(req.body);
    const client = await Client.findOne({
      phone: req.body.phone,
    }).select("+otp.value");
    if (!client) throw { message: "either phone or password is incorrect." };
    // console.log(client);
    if (client.otp.value == null) throw { message: "otp is expired." };
    if (client.otp.value != req.body.otp) {
      throw { message: "wrong otp was entered." };
    }
    const token = client.getJWTToken();
    client.isApproved = true;
    client.otp = { value: null, trialCount: 0, blockedTill: null };
    client.save();
    res.status(200).json({ success: true, data: client, token });
  } catch (error) {
    errorResponse(res, error);
  }
};
