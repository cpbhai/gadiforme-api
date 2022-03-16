exports.phoneNumber = (phone) => {
  return phone.match(/\d{10}/);
};

exports.isEmail = (email) => {
  return email.match(/\S+@\S+\.\S+/);
};
