const userDataModel = require("../models/userdataModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const findQuery = (id) => {
  return [
    {
      $match: {
        user: mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
  ];
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.replace("Bearer ", "");
      return await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async function (err, decoded) {
          if (err) {
            if (err.name == "TokenExpiredError")
              throw new Error("Session Expired, Please Login Again.");
            throw new Error("Invalid Token Provided, Please Log In Again.");
          }
          let user = await userDataModel.aggregate(findQuery(decoded._id));
          if (user.length == 0)
            throw new Error("Session Expired, Please Login Again.");
          req.user = user[0];
          return next();
        }
      );
    }
    throw new Error("Please Log In, To Access This Resource.");
  } catch (err) {
    const { message } = err;
    res.status(401).json({ success: false, message });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.user.role))
        throw new Error("You Are Not Authorized to Access this Resource");
      return next();
    } catch (err) {
      const { message } = err;
      return res.status(403).json({ success: false, message });
    }
  };
};
