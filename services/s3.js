const AWS = require("aws-sdk");

const s3Client = new AWS.S3({
  endpoint: process.env.DO_SPACES_URL,
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

async function saveImage(buf, Key, ext, folder) {
  return new Promise(async (resolve) => {
    try {
      const uploadURL = await s3Client
        .upload({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: `${folder}/${Key}`,
          Body: buf,
          ACL: "public-read",
          ContentType: `image/${ext}`,
        })
        .promise();
      console.log("uploadURL", uploadURL);
      delete uploadURL.key;
      delete uploadURL.ETag;
      resolve(uploadURL);
    } catch (err) {
      console.log("S3 File Save ERR", err);
    }
  });
}

exports.saveImages = async function (images, title, folder) {
  return new Promise((resolve) => {
    let promises = [];
    images.forEach((img) => {
      const data = img.replace(/^data:image\/\w+;base64,/, "");
      const ext = img.split(";base64")[0].replace("data:image/", "");
      const name = title.replace(/\s+/, "_").slice(0, 20);
      const Key = `${name}_${Date.now()}_${getRandomIntInclusive(
        1,
        100
      )}.${ext}`;
      const buf = Buffer.from(data, "base64");
      const saved = saveImage(buf, Key, ext, folder);
      promises.push(saved);
    });
    Promise.all(promises).then((result) => {
      // console.log(result, "result");
      resolve(result);
    });
  });
};

exports.deleteImages = function (images) {
  images.forEach((each) =>
    s3Client.deleteObject(
      {
        Bucket: each.Bucket,
        Key: each.Key,
      },
      (err, data) => {
        if (err)
          console.log(
            "DELETING S3 IMAGE, WHEN ERR WHILE ADDING PLANT",
            err,
            data
          );
      }
    )
  );
};