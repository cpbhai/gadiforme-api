exports.sendOtp = (otp, to) => {
  const request = require("request");
  const options = {
    method: "GET",
    url: `https://www.fast2sms.com/dev/bulkV2?authorization=gDBoVRk9vSz3xmeb1whCsF0PypEiu8IKTZ5tMfJQLY6OXc7HGncb23mlerwSqHogfkMDhsGBzIT8Q4pW&variables_values=${otp}&route=otp&numbers=${to}`,
    headers: {
      Cookie:
        "XSRF-TOKEN=eyJpdiI6ImNkSDdrbkVYeGRDXC9lZmtjKzUxbUJnPT0iLCJ2YWx1ZSI6IlwvWkxtWCtQZFUydk80VFRkUnc2Y1BraWtNNzFIQjZoQmxqWlVwK0R6NDNHd2RROHZnMGljcENRa3E1VmxQWldmc3A0T1RyV1JLdTRXSXl2WTBkNGROQT09IiwibWFjIjoiMTgwNzQ4YzI2NTE3NTQ1Njg5ODFjMmUwZjkzZmRiZjU2YmRkMzQ0NDAzYTkzMjc5NzMzMzg2M2MxNWM4MmM4ZCJ9; laravel_session=eyJpdiI6IllCWnZ2MXZDS3RNMW4wMnhKaFA4eUE9PSIsInZhbHVlIjoiQkszZmhLTGZLYWY1NlR4MThNZzNOcXdmNGphbW5TZ2R3VDBrYW4rOWFBcmgrQms4VnFKUGNTbVNuQWNBbVM0XC9aRk5iWE4xTFJQZFJrRTFGZVJpc2dBPT0iLCJtYWMiOiJmYmRiZTRjNTNlMmQ4ZjYyOTg5NzQyMDJjMzhiZjk5YmM3MTIxYmIxYjI4OWYxZGJkMmIyZDc4N2JlYjY5MTBmIn0%3D",
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("smsBody", response.body);
  });
};
