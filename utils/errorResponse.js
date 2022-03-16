module.exports = function (res, error) {
  let code = 500,
    message = error.message;
  if (error.code === 11000) {
    //error by mongodb
    //violation of unique:true
    const key = error.keyValue[Object.keys(error.keyValue)[0]];
    message = `${key} ALREADY EXISTS.`;
  } else if (error.errors) {
    //error by mongoose
    code = 400;
    const key = error.errors[Object.keys(error.errors)[0]];
    if (key.kind && key.kind == "ObjectId")
      message = `${key.path.toUpperCase()} IS INVALID.`;
    else if (key.properties && key.properties.type == "required")
      message = `${key.properties.path.toUpperCase()} IS MISSING.`;
    else if (key.properties && key.properties.type == "enum")
      message = `${key.properties.path.toUpperCase()} IS INVALID.`;
    else if (key.properties && key.properties.type == "user defined")
      message = key.properties.message;
  }
  res.status(code).json({ success: false, message });
};
