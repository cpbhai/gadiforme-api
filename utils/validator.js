exports.phoneNumber = (payload) => {
  if (payload.match(/^\d{10}$/)) return true;
  return false;
};

exports.Password = (payload) => {
  if (payload.length >= 6) return true;
  return false;
};

exports.isEmail = (payload) => {
  if (payload.match(/\S+@\S+\.\S+/)) return true;
  return false;
};
