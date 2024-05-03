const fs = require("fs");
const cron = require("node-cron");

const filePath = "./log_folder/logs.log";

cron.schedule("0 * * * *", () => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading log file:", err);
      return;
    }

    fs.writeFile(filePath, "", (err) => {
      if (err) {
        console.error("Error flushing log file:", err);
        return;
      }
      console.log("Log file flushed successfully (Each Hour)");
    });
  });
});
