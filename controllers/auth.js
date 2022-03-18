const errorResponse = require("../utils/errorResponse");
const catchAsync = require("../middlewares/catchAsync");

exports.loadUser = catchAsync(async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    errorResponse(res, error);
  }
});
