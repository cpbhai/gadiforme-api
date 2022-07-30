const mongoose = require("mongoose");

const locationObj = {
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
};

const tripModel = new mongoose.Schema(
  {
    client: {
      Id: {
        Bucket: {
          type: String,
          default: null,
        },
        Key: { type: String, default: null },
      },
      phone: {
        type: String,
        required: true,
      },
      phoneExt: {
        type: String,
        default: "+91",
      },
    },
    partner: {
      Id: {
        Bucket: {
          type: String,
          default: null,
        },
        Key: { type: String, default: null },
      },
      phone: {
        type: String,
        required: true,
      },
      phoneExt: {
        type: String,
        default: "+91",
      },
    },
    from: locationObj,
    to: locationObj,
    isRoundTrip: {
      type: Boolean,
      required: true,
    },
    when: {
      type: Date,
      required: true,
    },
    returnTime: {
      type: Date,
      default: null, //if not round trip
    },
    payment_id: {
      type: String,
      default: null,
    },
    vehicle: {
      title: {
        type: String,
        default: null,
      },
      registrationNo: {
        type: String,
        default: null,
      },
    },
    cost: {
      type: Number,
      default: null,
    },
    advancePaid: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Trip || mongoose.model("Trip", tripModel);
