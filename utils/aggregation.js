module.exports.addTripRoundTrip = (state, city, vehicles) => {
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
        _id: false,
        phone: "$user.phone",
      },
    }
  );
  return pipeline;
};

module.exports.addTripSingleSide = (
  fromState,
  fromCity,
  vehicles,
  toState,
  toCity
) => {
  let matchObj = {
    "verification.phone": true,
    "verification.personalPhoto": true,
    "verification.legalIdPhoto": true,
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
      $facet: {
        pickUpPeople: [
          {
            $match: {
              "pickupLocation.state": fromState,
              "pickupLocation.city": fromCity,
            },
          },
        ],
        dropOffPeople: [
          {
            $match: {
              "pickupLocation.state": toState,
              "pickupLocation.city": toCity,
            },
          },
        ],
      },
    },
    {
      $project: {
        data: {
          $setUnion: ["$pickUpPeople", "$dropOffPeople"],
        },
      },
    },
    {
      $unwind: {
        path: "$data",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "data.user",
        foreignField: "_id",
        as: "data",
      },
    },
    {
      $unwind: {
        path: "$data",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        phone: "$data.phone",
      },
    }
  );
  return pipeline;
};
