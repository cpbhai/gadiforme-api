const userDataModel = require("../models/userdataModel");
const tripModel = require("../models/tripModel");
const errorResponse = require("../utils/errorResponse");
const { addTrip } = require("../utils/aggregation");
const sendSMS = require("../services/sms");

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

module.exports.add = async (req, res) => {
  try {
    const { from, to, isRoundTrip, when, returnTime, preferredVehicles } =
      req.body;
    let data = {
      from,
      to,
      isRoundTrip,
      when,
      client: req.user.user._id,
      "verified.client.otp": getRandomIntInclusive(1000, 9999),
    };
    if (returnTime) data.returnTime = returnTime;
    if (
      preferredVehicles &&
      Array.isArray(preferredVehicles) &&
      preferredVehicles.length
    )
      data.preferredVehicles = preferredVehicles;
    const trip = await tripModel.create(data);
    //SMS
    data = addTrip(from.state, from.city, preferredVehicles);
    data = await userDataModel.aggregate(data);
    // return res.json({ data: data.map((each) => each.user.phone) });
    let message = `New Trip Alert From GadiForMe\nCheck Now at: https://partner.gadiforme.com/${trip._id}`;
    sendSMS(
      message,
      data.map((each) => each.user.phone)
    );

    res.status(201).json({ success: true, message: "Trip Added Successfully" });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Trip Add Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};

module.exports.load = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
