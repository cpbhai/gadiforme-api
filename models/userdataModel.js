const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  verification: {
    phone: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: false,
    },
    personalPhoto: {
      type: Boolean,
      default: false,
    },
    legalIdPhoto: {
      type: Boolean,
      default: false,
    },
  },
  email: {
    type: String,
    default: null, //edit in personal details
  },
  images: {
    type: Array,
    default: [],
  },
  pickupLocation: {
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
  },
  ownVehicleTypes: {
    type: Array,
    default: [],
  },
});

module.exports =
  mongoose.models.Userdata || mongoose.model("Userdata", userDataSchema);
