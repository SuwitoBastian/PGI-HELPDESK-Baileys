const repository = require("../repositories/ticketRepository");

const CHECK_INTERVAL = 60 * 1000; // 1 menit
const SLA_LIMIT_MINUTES = 30;

function checkSLA() {

    try {

        const tickets =
            repository.findProcessNormalSLA();

        const now =
            Date.now();

        for (const ticket of tickets) {

            const assigned =
                new Date(ticket.assigned_at).getTime();

            const minutes =
                (now - assigned) / 60000;

            if (minutes >= SLA_LIMIT_MINUTES) {

                repository.markSLAExpired(ticket.id);

                console.log(
                    `🔴 SLA EXPIRED : ${ticket.id} (${ticket.pic})`
                );

            }

        }

    } catch (err) {

        console.error(
            "❌ SLA Scheduler Error",
            err
        );

    }

}

function startSLAScheduler() {

    console.log("🟢 SLA Scheduler Started");

    // Langsung cek saat server pertama kali hidup
    checkSLA();

    // Cek setiap 1 menit
    setInterval(
        checkSLA,
        CHECK_INTERVAL
    );

}

module.exports = {

    startSLAScheduler

};