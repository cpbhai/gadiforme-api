const axios = require("axios");

module.exports = async (message, numbers) => {
  if (numbers.length == 0) return;//if no contact exists
  try {
    const { data } = await axios({
      async: true,
      crossDomain: true,
      method: "POST",
      url: "https://www.fast2sms.com/dev/bulkV2",
      headers: {
        Authorization: process.env.FAST2SMS_API_KEY,
      },
      data: {
        sender_id: "TXTIND",
        message,
        route: "v3",
        numbers: numbers.join(","),
      },
    });
    console.log(data);
  } catch (err) {
    console.log(err.response.data.message);
  }
};
