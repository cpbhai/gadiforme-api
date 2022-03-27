const cloudinary = require("cloudinary");
const DatauriParser = require("datauri/parser");
const path = require("path");

exports.addImage = async (file, folder) => {
  const parser = new DatauriParser();
  file = parser.format(path.extname(file.originalname).toString(), file.buffer);
  const result = await cloudinary.v2.uploader.upload(file.content, {
    folder: folder,
  });
  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

exports.removeImage = (imageId) => {
  cloudinary.v2.uploader.destroy(imageId);
};
