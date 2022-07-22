module.exports.addTrip = (state, city, vehicles) => {
  let matchObj = {
    "verification.phone": true,
    "verification.personalPhoto": true,
    "verification.legalIdPhoto": true,
    "pickupLocation.state": state,
    "pickupLocation.city": city,
  };
  let pipeline = [
    {
      $match: matchObj,
    },
  ];
  if (vehicles && Array.isArray(vehicles) && vehicles.length) {
    matchObj["ownVehicleTypes"] = { $in: vehicles };
  }
  pipeline.push(
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
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        "user.phone": true,
      },
    }
  );
  return pipeline;
};
