const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

exports.register = async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    if (role == "Admin") throw { message: "invalid role was provided" };
    const data = { phone, password, role };
    const user = await userModel.create(data);
    const token = user.getJWTToken();
    user.password = undefined;
    UserData.create({ user: user._id });
    res
      .status(200)
      .json({ success: true, message: "Registered Successfully", token, user });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Client Register Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};
