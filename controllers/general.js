const mongoose = require("mongoose");
const Vehicle = require("../models/vehicle");
const { showAvailableCarsQuery } = require("../utils/aggregation");
const errorResponse = require("../utils/errorResponse");
const {
  validateShowAvailableVehicles,
} = require("../middlewares/validatePayload");

exports.showAvailableCars = async (req, res) => {
  try {
    validateShowAvailableVehicles(req.query);
    const { dropoff, pickup, journey, date, distance } = req.query;
    const output = await Vehicle.aggregate(
      showAvailableCarsQuery(pickup, date, journey, distance)
    );
    res.status(200).json({ success: true, data: output });
  } catch (error) {
    errorResponse(res, error);
  }
};
