const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.models.Log || mongoose.model("Log", logSchema);
