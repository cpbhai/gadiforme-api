const SendEmail = require("../services/email");
const EmailTemplate = require("../services/email-template");

module.exports = (templateId, payload) => {
  let template = { subject: "", body: "" };
  switch (templateId) {
    case "signup":
      template = EmailTemplate.signup(payload.name);
      break;
    default:
      console.log("W");
  }
  mailOptions = {
    to: payload.email,
    subject: template.subject,
    html: template.body,
  };
  SendEmail(mailOptions);
};
