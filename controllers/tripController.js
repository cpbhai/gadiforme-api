const userDataModel = require("../models/userdataModel");
const tripModel = require("../models/tripModel");
const errorResponse = require("../utils/errorResponse");
const {
  addTripSingleSide,
  addTripRoundTrip,
  listTrips,
} = require("../utils/aggregation");
const mongoose = require("mongoose");
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
    if (isRoundTrip && returnTime) data.returnTime = returnTime;
    if (
      preferredVehicles &&
      Array.isArray(preferredVehicles) &&
      preferredVehicles.length
    )
      data.preferredVehicles = preferredVehicles;
    const trip = await tripModel.create(data);
    //SMS
    data = isRoundTrip
      ? addTripRoundTrip(from.state, from.city, preferredVehicles)
      : addTripSingleSide(
          from.state,
          from.city,
          preferredVehicles,
          to.state,
          to.city
        );
    data = await userDataModel.aggregate(data);
    // return res.json({ data });
    let message = `New Trip From GadiForMe\nCheck Now at: https://partner.gadiforme.com/trip/${trip._id}`;
    sendSMS(
      message,
      data.map((each) => each.phone)
    );
    sendSMS(message.replace("partner", "admin"), ["8077015752"]);

    res.status(201).json({ success: true, message: "Trip Added Successfully" });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Trip Add Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};

module.exports.list = async (req, res) => {
  try {
    const trips = await tripModel.aggregate(listTrips(req.user.user));
    res.status(200).json({ success: true, trips });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Trip List Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};

module.exports.startByVerifyingClient = async (req, res) => {
  try {
    let { trip, otp } = req.body;
    if (!trip || !mongoose.isValidObjectId(trip))
      throw { message: "Invalid Trip" };
    trip = await tripModel.findById(trip);
    if (!trip) throw { message: "No Such Trip Exists" };
    if (!trip.partner) throw { message: "Trip has not been booked yet" };
    if (trip.partner.toString() != req.user.user._id.toString())
      throw { message: "You are not allowed to verify this client" };
    if (trip.verified.client.status) throw { message: "Already Verified" };

    if (trip.verified.client.trialCount == 0)
      throw { message: "Trial Count exceeded, Please, Call at 8077015752" };
    if (trip.verified.client.otp == otp) {
      trip.verified.client.status = true;
      trip.verified.client.trialCount = 0;
      trip.save();
      res
        .status(200)
        .json({ success: true, message: "OTP Verified Successfully" });
    } else {
      --trip.verified.client.trialCount;
      trip.save();
      throw {
        message: `Wrong OTP, Only: ${trip.verified.client.trialCount} Trials Left`,
      };
    }
  } catch (error) {
    const response = errorResponse(error);
    console.log("Trip Start By Verification Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};
