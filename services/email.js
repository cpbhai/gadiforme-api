var nodemailer = require("nodemailer");

module.exports = function (mailOptions, cb) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "singhharshvardhan223@gmail.com",
      pass: "memxqpdrlkwwxmet",
    },
  });

  transporter.sendMail(
    mailOptions,
    cb
      ? cb
      : (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId, mailOptions.to);
          return info.messageId;
        }
  );
};
