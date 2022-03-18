const errorResponse = require("../utils/errorResponse");
const catchAsync = require("../middlewares/catchAsync");
const {
  validateClientSignup,
  validateClientLogin,
} = require("../middlewares/validatePayload");
//const mongoose = require("mongoose");
const Client = require("../models/client");
const sendEmail = require("../services/sendEmail");
const { getCurrentDate } = require("../utils/commonFunctions");

exports.signup = catchAsync(async (req, res) => {
  try {
    req.body = validateClientSignup(req.body);
    const user = await Client.create(req.body);
    if (user.email) sendEmail("signup", { email: user.email, name: user.name });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    errorResponse(res, error);
  }
});

exports.login = catchAsync(async (req, res) => {
  try {
    req.body = validateClientLogin(req.body);
    console.log(req.body);
    const client = await Client.findOne({ phone: req.body.phone });
    if (!client) throw { message: "either phone or password is incorrect." };
    const passwordMatch = await client.comparePassword(req.body.password);
    if (!passwordMatch)
      throw { message: "either phone or password is incorrect." };
    const token = client.getJWTToken();
    res.status(200).json({ success: true, data: client, token });
  } catch (error) {
    errorResponse(res, error);
  }
});
