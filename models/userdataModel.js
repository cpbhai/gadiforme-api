const mongoose = require("mongoose");
const { isEmail } = require("../utils/validator");

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
  personalPhoto: {
    Bucket: String,
    Key: String,
  },
  legalIdPhoto: {
    Bucket: String,
    Key: String,
  },
});

module.exports =
  mongoose.models.Userdata || mongoose.model("Userdata", userDataSchema);
