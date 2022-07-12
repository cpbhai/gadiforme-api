function titleCase(string) {
  let sentence = string.trim().toLowerCase().split(/\s+/);
  for (let i = 0; i < sentence.length; i++) {
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(" ");
}
module.exports = (error, haveCode) => {
  let code = 500,
    message = error.message;
  if (haveCode) code = haveCode;
  if (error.code === 11000) {
    //error by mongodb
    //violation of unique:true
    message = error.message;
    message = `${message.split(": { ")[1].split(":")[0]} already exists`;
  } else if (error.errors) {
    //error by mongoose
    code = 400;
    const key = error.errors[Object.keys(error.errors)[0]];
    if (key.kind && key.kind == "ObjectId") message = `${key.path} is invalid.`;
    else if (key.properties && key.properties.type == "required")
      message = `${key.properties.path} is missing.`;
    else if (key.properties && key.properties.type == "enum")
      message = `${key.properties.path} is invalid.`;
    else if (key.properties && key.properties.type == "user defined")
      message = key.properties.message;
  }
  message = titleCase(message);
  return { code, message };
};
