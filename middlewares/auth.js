const Client = require("../models/client");
const Partner = require("../models/partner");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (token) {
      return await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async function (err, decoded) {
          if (err) {
            if (err.name == "TokenExpiredError")
              throw new Error("SESSION EXPIRED, PLEASE LOGIN AGAIN.");
            throw new Error("INVALID TOKEN PROVIDED, PLEASE LOGIN AGAIN.");
          }
          let user = null;
          if (decoded.role == "Client")
            user = await Client.findById(decoded._id);
          else if (decoded.role == "Partner")
            user = await Partner.findById(decoded._id);
          if (!user) throw new Error("SESSION EXPIRED, PLEASE LOGIN AGAIN.");
          req.user = user;
          return next();
        }
      );
    }
    throw new Error("PLEASE LOGIN, TO ACCESS THIS RESOURCE.");
  } catch (err) {
    const { message } = err;
    res.status(401).json({ success: false, message });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role))
        throw new Error("YOU ARE NOT AUTHORIZED TO ACCESS THIS RESOURCE.");
      return next();
    } catch (err) {
      const { message } = err;
      return res.status(403).json({ success: false, message });
    }
  };
};
