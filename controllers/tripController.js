const userDataModel = require("../models/userdataModel");
const tripModel = require("../models/tripModel");
const errorResponse = require("../utils/errorResponse");
const {
  addTripSingleSide,
  addTripRoundTrip,
  listTrips,
} = require("../utils/aggregation");
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
