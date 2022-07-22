const tripModel = require("../models/tripModel");
const applicationModel = require("../models/applicationModel");
const errorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const sendSMS = require("../services/sms");

module.exports.add = async (req, res) => {
  try {
    const { trip, vehicle, cost } = req.body;
    if (!trip || !mongoose.isValidObjectId(trip))
      throw { message: "Invalid Trip" };
    const tripDoc = await tripModel.findById(trip).lean();
    if (!tripDoc) throw { message: "No Such Trip Exists" };
    if (tripDoc.partner) throw { message: "This Trip is already booked" };
    let data = {
      applicant: req.user.user._id,
      trip,
      vehicle,
      cost,
    };
    await applicationModel.create(data);
    res
      .status(201)
      .json({ success: true, message: "Details Sent Successfully" });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Application Add Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};

module.exports.list = async (req, res) => {
  try {
    const { trip } = req.params;
    if (!mongoose.isValidObjectId(trip)) throw { message: "Invalid Trip" };
    const tripDoc = await tripModel.findById(trip).lean();
    if (!tripDoc) throw { message: "No Such Trip Exists" };
    const applications = await applicationModel.aggregate([
      {
        $match: {
          trip: ObjectId(trip),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "userdatas",
          localField: "applicant",
          foreignField: "user",
          as: "applicant",
        },
      },
      {
        $unwind: "$applicant",
      },
      {
        $project: {
          _id: true,
          cost: true,
          image: {
            $arrayElemAt: ["$applicant.images", 0],
          },
          vehicle: true,
        },
      },
    ]);
    res.status(200).json({ success: true, applications });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Application List Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};

module.exports.book = async (req, res) => {
  try {
    const { trip, application } = req.params;
    const { payment_id, advancePaid } = req.body;
    if (!payment_id) throw { message: "Payment Id is missing" };
    if (!advancePaid) throw { message: "Paid Advance is missing" };
    if (!mongoose.isValidObjectId(trip)) throw { message: "Invalid Trip" };
    if (!mongoose.isValidObjectId(application))
      throw { message: "Invalid Application" };
    const appDoc = await applicationModel
      .findById(application)
      .populate({ path: "applicant", select: { _id: true, phone: true } })
      .lean();
    if (!appDoc) throw { message: "No Such Application Exists" };
    if (appDoc.trip.toString() != trip)
      throw { message: "No Such Application with Requested Trip Exists" };
    const tripDoc = await tripModel.findById(trip);
    if (tripDoc.partner) throw { message: "This Trip is already booked" };
    if (tripDoc.client.toString() != req.user.user._id.toString())
      throw { message: "You Are Not Authorized to Book This" };
    tripDoc.partner = appDoc.applicant._id;
    tripDoc.payment_id = payment_id;
    tripDoc.vehicle = appDoc.vehicle;
    tripDoc.cost = appDoc.cost;
    tripDoc.advancePaid = advancePaid;
    await tripDoc.save();
    let message = `Your Cab Booked\nCheck Now at: https://partner.gadiforme.com/booking/${tripDoc._id}`;
    sendSMS(message, [appDoc.applicant.phone]);
    message = `A Cab is Booked\nCheck Now at: https://admin.gadiforme.com/booking/${tripDoc._id}`;
    sendSMS(message, ["8077015752"]);
    res.status(200).json({ success: true, message: "Booked Successfully" });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Application Booking Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};
