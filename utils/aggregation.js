exports.showAvailableCarsQuery = (pickup, date, journey, distance) => {
  //   console.log("Jour", `$${journey}`);
  return [
    {
      $match: {
        serviceAreas: {
          $in: [RegExp(pickup, "i")],
        },
        busyDays: {
          $nin: [date],
        },
      },
    },
    {
      $addFields: {
        totalAmount: {
          $multiply: [`$${journey}`, Number(distance)],
        },
      },
    },
    {
      $project: {
        vehicleNo: 0,
        perKmCostOneWay: 0,
        perKmCostRound: 0,
        serviceAreas: 0,
        busyDays: 0,
      },
    },
  ];
};
