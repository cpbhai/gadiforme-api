const mongoose = require("mongoose");

const locationObj = {
  State: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  Place: {
    type: String,
    required: true,
  },
};

const tripModel = new mongoose.Schema(
  {
    Client: {
      Id: {
        Bucket: {
          type: String,
          default: null,
        },
        Key: { type: String, default: null },
      },
      Phone: {
        type: String,
        required: true,
      },
      PhoneExt: {
        type: String,
        default: "+91",
      },
      Name: { type: String, required: true },
    },
    Partner: {
      Id: {
        Bucket: {
          type: String,
          default: null,
        },
        Key: { type: String, default: null },
      },
      Phone: {
        type: String,
        default: null,
      },
      PhoneExt: {
        type: String,
        default: null,
      },
      Name: { type: String, default: null },
    },
    From: locationObj,
    To: locationObj,
    IsRoundTrip: {
      type: Boolean,
      required: true,
    },
    When: {
      type: Date,
      required: true,
    },
    ReturnTime: {
      type: Date,
      default: null, //if not round trip
    },
    PaymentId: {
      type: String,
      default: null,
    },
    Vehicle: {
      Title: {
        type: String,
        default: null,
      },
      RegistrationNo: {
        type: String,
        default: null,
      },
    },
    TotalCost: {
      type: Number,
      default: null,
    },
    AdvancePaid: {
      type: Number,
      default: null,
    },
    NoOfPerson: {
      type: Number,
      required: true,
    },
    PreferredVehicles: {
      type: Array,
      default: [],
    },
    Purpose: {
      type: String,
      required: true,
    },
    AnyMessage: {
      type: String,
      defaul: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Trip || mongoose.model("Trip", tripModel);
