const errorResponse = require("../utils/errorResponse");

exports.loadUser = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    errorResponse(res, error);
  }
};
