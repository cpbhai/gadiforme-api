const userModel = require("../models/userModel");
const userDataModel = require("../models/userdataModel");
const errorResponse = require("../utils/errorResponse");

module.exports.register = async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    if (role == "Admin") throw { message: "invalid role was provided" };
    const data = { phone, password, role, phoneExt: "+91" };
    const user = await userModel.create(data);
    const token = user.getJWTToken();
    user.password = undefined;
    userDataModel.create({ user: user._id });
    res
      .status(201)
      .json({ success: true, message: "Registered Successfully", token, user });
  } catch (error) {
    const response = errorResponse(error);
    console.log("User Register Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await userModel.findOne({ phone }).select("+password");
    if (!user) throw { message: "No Such User Exists" };
    const passwordMatched = await user.comparePassword(password);
    if (!passwordMatched) throw { message: "No Such User Exists" };
    const token = user.getJWTToken();
    user.password = undefined;
    res
      .status(200)
      .json({ success: true, message: "Logged In Successfully", token, user });
  } catch (error) {
    const response = errorResponse(error);
    console.log("User Log In Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
};

module.exports.load = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
