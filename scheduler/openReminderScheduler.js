const repository =
    require("../repositories/ticketRepository");

const notificationService =
    require("../services/notificationService");

const REMINDER_MINUTES = 15;
const REMINDER_INTERVAL = 60 * 1000;

async function checkOpenReminder() {

    try {

        const tickets =
            repository.findOpenReminderTickets();

        if (!tickets.length)
            return;

        const reminderTickets = [];

        const now = Date.now();

        for (const ticket of tickets) {

            const umurMenit =
                Math.floor(
                    (now - new Date(ticket.waktu).getTime()) / 60000
                );

            if (umurMenit >= REMINDER_MINUTES) {

                reminderTickets.push({
                    ...ticket,
                    umurMenit
                });

            }

        }

        if (!reminderTickets.length)
            return;

        await notificationService.openReminder(
            reminderTickets
        );

        const ids =
            reminderTickets.map(
            t => t.id
            );

        repository.markOpenReminderSent(ids);

        console.log(
        `[${new Date().toLocaleTimeString("id-ID")}] 🚨 OPEN Reminder terkirim (${reminderTickets.length} ticket)`
        );

    } catch (err) {

        console.error(
            "❌ OPEN Reminder Error"
        );

        console.error(err);

    }

}

function startOpenReminderScheduler() {

    console.log(
        "⏰ OPEN Reminder Scheduler Started"
    );

    checkOpenReminder();

    setInterval(

        checkOpenReminder,

        REMINDER_INTERVAL

    );

}

module.exports = {

    startOpenReminderScheduler

};