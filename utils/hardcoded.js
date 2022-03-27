exports.imagesPartnerSignup = [
  {
    name: "idFront",
    maxCount: 1,
  },
  {
    name: "idRear",
    maxCount: 1,
  },
  {
    name: "panPhoto",
    maxCount: 1,
  },
];
exports.getOTP = function () {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();
};
