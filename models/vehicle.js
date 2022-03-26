const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  vehicleNo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Mini", "Sedan", "SUV"],
  },
  features: {
    AC: { type: Boolean, default: false },
    fuelType: {
      type: String,
      required: true,
      enum: ["CNG", "Petrol", "Diesel", "Electric"],
    },
  },
  perKmCostOneWay: {
    type: Number,
    required: true,
  },
  perKmCostRound: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now() + 330 * 60000),
  },
  postedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
});

module.exports =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
