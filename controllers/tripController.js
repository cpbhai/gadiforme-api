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
    res.status(201).json({
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

module.exports.trip = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.isValidObjectId(_id)) throw { message: "Invalid Trip Id" };
    const trip = await tripModel.findOne({
      _id,
      "Client.Id.Image": { $ne: null },
      "Partner.Id.Image": { $ne: null },
      "Partner.Phone": { $ne: null },
      "Partner.Name": { $ne: null },
      PaymentId: { $ne: null },
      "Vehicle.Title": { $ne: null },
      "Vehicle.RegistrationNo": { $ne: null },
      TotalCost: { $ne: null },
      AdvancePaid: { $ne: null },
    });
    if (!trip) throw { message: "No Such Trip Exists" };
    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Trip View Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};
