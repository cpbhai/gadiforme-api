exports.phoneNumber = (payload) => {
  if (payload.match(/^\d{10}$/)) return true;
  return false;
};