exports.getCurrentDate = (time = true, format = false) => {
  const moment = require("moment");
  let ans = moment.utc();
  if (time) {
    ans = moment.utc(ans.format()).local();
  } else {
  }
  if (format) ans = ans.format("YYYY-MM-DD H:mm");
  return ans;
};
