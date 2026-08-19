const repository =
    require("../repositories/ticketRepository");

const notificationService =
    require("../services/notificationService");

const { nowWIB } =
    require("../utils/dateTime");

const REMINDER_MINUTES = 15;
const REMINDER_INTERVAL = 60 * 1000;


/**
 * =====================================================
 * OPEN REMINDER
 * =====================================================
 */

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


/**
 * =====================================================
 * AUTO CLOSE PROCESS
 * =====================================================
 *
 * Ticket PROCESS yang berasal dari tanggal sebelumnya
 * akan otomatis ditutup oleh SYSTEM.
 *
 * PIC tetap PIC yang melakukan assignment.
 *
 * Contoh:
 *
 * 18 Agustus
 * Ticket → PROCESS
 * PIC → SW
 *
 * 19 Agustus
 * → AUTO CLOSE
 *
 * pic          = SW
 * pic_selesai  = SW
 * close_type   = AUTO_CLOSE
 *
 */

function checkAutoCloseProcess() {

    try {

        const tickets =
            repository.findProcessFromPreviousDate();

        if (!tickets.length)
            return;

        let closedCount = 0;

        for (const ticket of tickets) {

            /*
             * Waktu ticket ditutup
             */
            const selesai =
                nowWIB();

            /*
             * Hitung durasi dari waktu ticket
             * sampai waktu auto-close.
             */
            const waktuMulai =
                new Date(ticket.waktu).getTime();

            const waktuSelesai =
                new Date(selesai).getTime();

            const durasiMenit =
                Math.max(
                    0,
                    Math.floor(
                        (waktuSelesai - waktuMulai) / 60000
                    )
                );

            /*
             * PIC selesai = PIC yang sebelumnya
             * melakukan assignment.
             */
            const picSelesai =
                ticket.pic;

            const picSelesaiTeam =
                ticket.pic_team ||
                ticket.engineer_team ||
                null;

            repository.autoCloseProcess(

                ticket.id,

                selesai,

                durasiMenit,

                picSelesai,

                picSelesaiTeam

            );

            closedCount++;

            console.log(
                `🤖 AUTO CLOSE`
            );

            console.log(
                `   Ticket : ${ticket.id}`
            );

            console.log(
                `   PIC    : ${picSelesai}`
            );

            console.log(
                `   Team   : ${picSelesaiTeam}`
            );

        }

        console.log(
            `🤖 AUTO CLOSE selesai (${closedCount} ticket)`
        );

    } catch (err) {

        console.error(
            "❌ AUTO CLOSE PROCESS Error"
        );

        console.error(err);

    }

}


/**
 * =====================================================
 * SCHEDULER
 * =====================================================
 */

function startOpenReminderScheduler() {

    console.log(
        "⏰ OPEN Reminder Scheduler Started"
    );

    /*
     * Jalankan langsung saat server start.
     */
    checkOpenReminder();

    checkAutoCloseProcess();


    /*
     * Cek setiap 1 menit.
     *
     * Jadi tidak bergantung pada tepat
     * 00:00:00.
     *
     * Misalnya server melakukan pengecekan:
     *
     * 23:59:59 → belum
     * 00:00:04 → AUTO CLOSE
     */

    setInterval(

        () => {

            checkOpenReminder();

            checkAutoCloseProcess();

        },

        REMINDER_INTERVAL

    );

}


module.exports = {

    startOpenReminderScheduler

};