const repository =
    require("../repositories/ticketRepository");

const notificationService =
    require("../services/notificationService");

const engineerRepository =
    require("../repositories/engineerRepository");

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
 * Semua ticket PROCESS dari tanggal sebelumnya
 * akan otomatis ditutup oleh SYSTEM.
 *
 * Tidak hanya H-1.
 *
 * Contoh:
 *
 * 12 Agustus → PROCESS
 * 19 Agustus → AUTO CLOSE
 *
 * PIC tetap PIC yang melakukan assignment.
 *
 * Setelah auto-close:
 * → Ticket menjadi CLOSED
 * → Kirim notifikasi CLOSED
 * → Kirim link feedback
 * → Tandai feedback sudah dikirim
 *
 */

async function checkAutoCloseProcess() {

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
             * PIC selesai = kode PIC
             * yang sebelumnya melakukan assignment.
             */
            const picSelesai =
                ticket.pic;


            /*
             * Ambil nama engineer berdasarkan kode PIC.
             *
             * Contoh:
             * SW → Suwito
             */
            const engineer =
                engineerRepository.getByCode(
                    picSelesai
                );


            /*
             * Jika engineer ditemukan,
             * gunakan nama engineer.
             *
             * Jika tidak ditemukan,
             * fallback ke kode PIC.
             */
            const picSelesaiName =
                engineer?.name ||
                picSelesai;


            /*
             * Team PIC
             */
            const picSelesaiTeam =
                ticket.pic_team ||
                ticket.engineer_team ||
                null;


            /*
             * ==========================================
             * AUTO CLOSE
             * ==========================================
             */

            repository.autoCloseProcess(

                ticket.id,

                selesai,

                durasiMenit,

                picSelesai,

                picSelesaiTeam

            );


            /*
             * ==========================================
             * KIRIM CLOSED + FEEDBACK
             * ==========================================
             *
             * Gunakan NAMA engineer,
             * bukan kode PIC.
             */

            await notificationService.ticketClosed(

                ticket.chatId,

                ticket,

                picSelesaiName

            );


            /*
             * ==========================================
             * TANDAI FEEDBACK SUDAH DIKIRIM
             * ==========================================
             */

            repository.markFeedbackSent(
                ticket.id
            );


            closedCount++;


            console.log(
                `🤖 AUTO CLOSE`
            );

            console.log(
                `   Ticket : ${ticket.id}`
            );

            console.log(
                `   PIC    : ${picSelesaiName}`
            );

            console.log(
                `   Team   : ${picSelesaiTeam}`
            );

            console.log(
                `   Feedback : SENT`
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
     * Tidak bergantung pada tepat
     * 00:00:00.
     *
     * Misalnya:
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

    startOpenReminderScheduler,
    checkAutoCloseProcess

};