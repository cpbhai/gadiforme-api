const mongoose = require("mongoose");
const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  photo: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  legalIdPhoto: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});
