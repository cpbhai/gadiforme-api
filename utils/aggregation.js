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

module.exports.listTrips = (user) => {
  let pipeline = [];
  const verifCondition = {
    $and: [
      { $eq: ["$userdata.verification.phone", true] },
      { $eq: ["$userdata.verification.personalPhoto", true] },
      { $eq: ["$userdata.verification.legalIdPhoto", true] },
    ],
  };
  if (user.role == "Client") {
    pipeline.push(
      { $match: { client: user._id } },
      {
        $lookup: {
          from: "users",
          localField: "partner",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "userdatas",
          localField: "partner",
          foreignField: "user",
          as: "userdata",
        },
      },
      {
        $unwind: "$userdata",
      },
      {
        $project: {
          _id: true,
          from: true,
          to: true,
          user: {
            phone: true,
            phoneExt: true,
          },
          isRoundTrip: true,
          when: true,
          returnTime: true,
          cost: true,
          advancePaid: true,
          "verified.client.status": true,
          "verified.client.otp": true,
          createdAt: true,
          vehicle: true,
        },
      }
    );
  } else if (user.role == "Partner") {
    pipeline.push(
      { $match: { partner: user._id } },
      {
        $lookup: {
          from: "users",
          localField: "client",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "userdatas",
          localField: "client",
          foreignField: "user",
          as: "userdata",
        },
      },
      {
        $unwind: "$userdata",
      },
      {
        $project: {
          _id: true,
          from: true,
          to: true,
          user: {
            phone: {
              $cond: {
                if: verifCondition,
                then: "$user.phone",
                else: "Customer is not verified yet",
              },
            },
            phoneExt: {
              $cond: {
                if: verifCondition,
                then: "$user.phoneExt",
                else: "Oops",
              },
            },
          },
          isRoundTrip: true,
          when: true,
          returnTime: true,
          cost: true,
          advancePaid: true,
          "verified.client.status": true,
          createdAt: true,
        },
      }
    );
  }
  pipeline.push(
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: 10,
    }
  );
  return pipeline;
};
