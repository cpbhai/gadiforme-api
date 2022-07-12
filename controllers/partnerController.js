const userDataModel = require("../models/userDataModel");
const errorResponse = require("../utils/errorResponse");
const { saveImages, deleteImages } = require("../services/s3");

module.exports.addInfo = async (req, res) => {
  try {
    let { images, state, city, ownVehicleTypes, email } = req.body;
    let data = {};
    console.log(req.body, req.file, req.files);
    //
    if (images && images.length) {
      if (!Array.isArray(images)) images = [images];
    //   images = await saveImages(images, req.user.user.phone, "partners");
      deleteImages(req.user.images);
    }
    //

    if (state || city) {
      data.pickupLocation = {};
      if (state) data.pickupLocation.state = state;
      if (city) data.pickupLocation.city = city;
    }
    if (ownVehicleTypes) data.ownVehicleTypes = ownVehicleTypes;
    if (email) data.email = email;
    userDataModel.findOneAndUpdate({ user: req.user.user._id }, data).exec();
    res
      .status(200)
      .json({ success: true, message: "Details Added Successfully" });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Partner Add Info Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};
