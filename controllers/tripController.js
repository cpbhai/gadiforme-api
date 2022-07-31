const tripModel = require("../models/tripModel");
const errorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");
const sendSMS = require("../services/sms");

module.exports.new = async (req, res) => {
  try {
    const {
      Name,
      Phone,
      From,
      To,
      IsRoundTrip,
      When,
      ReturnTime,
      NoOfPerson,
      PreferredVehicles,
      Purpose,
      AnyMessage,
    } = req.body;
    let data = {
      "Client.Name": Name,
      "Client.Phone": Phone,
      From,
      To,
      IsRoundTrip,
      When,
      NoOfPerson,
      Purpose,
      AnyMessage,
    };
    if (IsRoundTrip && ReturnTime) data.ReturnTime = ReturnTime;
    if (PreferredVehicles) data.PreferredVehicles = PreferredVehicles;
    const trip = await tripModel.create(data);
    //SMS
    let message = `New Trip GFM\nCheck Now at: https://admin.gadiforme.com/trip/${trip._id}`;
    sendSMS(message, ["8077015752"]);
    message = `Hi ${Name},\nWe will contact you Soon\n-Team GadiForMe`;
    sendSMS(message, [Phone]);
    res
      .status(201)
      .json({
        success: true,
        message: "Trip Added Successfully",
        trip: trip._id,
      });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Trip Add Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};
