const morningReportService =
    require("./services/morningReportService");

const {
    startOpenReminderScheduler
} = require("./scheduler/openReminderScheduler");

let started = false;

function start() {

    if (started)
        return;

    started = true;

    console.log("");
    console.log("================================");
    console.log("🚀 PGI HELPDESK V3 READY");
    console.log("================================");

    morningReportService.start();

    startOpenReminderScheduler();

}

module.exports = {
    start
};