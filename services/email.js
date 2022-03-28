var nodemailer = require("nodemailer");

module.exports = function (mailOptions) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "singhharshvardhan223@gmail.com",
      pass: "memxqpdrlkwwxmet",
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      const Log = require("../models/log");
      const data = new Log({ data: error });
      data.save();
      return;
    }
    // console.log("Message sent: %s", info.messageId, mailOptions.to);
  });
};
