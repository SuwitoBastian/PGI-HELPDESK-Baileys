const ticketRepository = require("../repositories/ticketRepository");

const http = require("http");

const BATCH_SIZE = 5;
const BATCH_INTERVAL_MS = 10 * 60 * 1000; // 10 menit

const QC_INVENTARIS_HOST =
    process.env.QC_INVENTARIS_HOST || "127.0.0.1";

const QC_INVENTARIS_PORT =
    Number(process.env.QC_INVENTARIS_PORT || 3001);

const FEEDBACK_REMINDER_SECRET =
    process.env.FEEDBACK_REMINDER_SECRET || "";

let reminderRunning = false;


/* ==========================================================
   Sleep
========================================================== */

function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/* ==========================================================
   Kirim HTTP ke QC-Inventaris
========================================================== */

function sendToQCInventaris(chatId, message) {

    return new Promise((resolve, reject) => {

        const body = JSON.stringify({
            chatId,
            message
        });


        const options = {

            hostname:
                QC_INVENTARIS_HOST,

            port:
                QC_INVENTARIS_PORT,

            path:
                "/internal/feedback-reminder",

            method:
                "POST",

            headers: {

                "Content-Type":
                    "application/json",

                "Content-Length":
                    Buffer.byteLength(body),

                "Authorization":
                    `Bearer ${FEEDBACK_REMINDER_SECRET}`

            },

            timeout:
                30 * 1000

        };


        const req =
            http.request(
                options,
                (res) => {

                    let data = "";


                    res.on(
                        "data",
                        chunk => {
                            data += chunk;
                        }
                    );


                    res.on(
                        "end",
                        () => {

                            let response;

                            try {

                                response =
                                    JSON.parse(data);

                            } catch {

                                response = {
                                    ok: false,
                                    message: data
                                };

                            }


                            if (
                                res.statusCode >= 200 &&
                                res.statusCode < 300 &&
                                response.ok
                            ) {

                                return resolve(response);

                            }


                            const error =
                                new Error(
                                    response.message ||
                                    `QC-Inventaris HTTP ${res.statusCode}`
                                );

                            error.statusCode =
                                res.statusCode;

                            reject(error);

                        }
                    );

                }
            );


        req.on(
            "timeout",
            () => {

                req.destroy(
                    new Error(
                        "Timeout menghubungi QC-Inventaris"
                    )
                );

            }
        );


        req.on(
            "error",
            err => {
                reject(err);
            }
        );


        req.write(body);

        req.end();

    });

}


/* ==========================================================
   Format Pesan Reminder
========================================================== */

function buildReminderMessage(customer) {

    const tickets =
        customer.tickets || [];


    const ticketCount =
        tickets.length;

    const ticketList =
        tickets
            .map((ticket, index) => {

                const engineer =
                    ticket.pic_selesai ||
                    ticket.pic ||
                    "-";


                return (
                    `${index + 1}. 🎫 *TICKET* : ${ticket.id}\n` +
                    `   🏢 *Cabang* : ${ticket.cabang || "-"}\n` +
                    `   📝 *Kendala* : ${ticket.kendala || "-"}\n` +
                    `   👨‍💻 *PIC* : ${engineer}`
                );

            })
            .join("\n\n");


    return (
`🔔 *REMINDER CUSTOMER FEEDBACK*\n\n` +

`Halo kak 🙏\n\n` +

`⚠️ *Perhatian*\n\n` +

`Kami mengingatkan kembali bahwa terdapat ` +
`${ticketCount} ticket yang sampai saat ini ` +
`*belum diisi penilaian feedback-nya.*\n\n` +

`Mohon segera meluangkan waktu untuk ` +
`memberikan penilaian terhadap layanan ` +
`*IT Support.*\n\n` +

`━━━━━━━━━━━━━━━━━━━━━━\n` +
`🎫 *DAFTAR TICKET PENDING*\n` +
`━━━━━━━━━━━━━━━━━━━━━━\n\n` +

`${ticketList}\n\n` +

`━━━━━━━━━━━━━━━━━━━━━━\n\n` +

`⚠️ *Mohon penilaian feedback untuk seluruh ` +
`ticket di atas segera diisi melalui link berikut:*\n\n` +

`https://forms.gle/of1HSXAQa6xrsqGJA\n\n` +

`Customer feedback menjadi bahan evaluasi dan ` +
`peningkatan kualitas layanan tim IT Support.\n\n` +

`*Mohon dapat segera ditindaklanjuti.*\n\n` +

`Terima kasih atas kerja samanya 🙏\n\n` +

`🤖 _Reminder otomatis IT Support Helpdesk_`
    );

}


/* ==========================================================
   Kirim Reminder 1 Customer
========================================================== */

async function sendReminder(customer) {

    /*
     * Pastikan customer memiliki ticket.
     */

    if (
        !customer ||
        !Array.isArray(customer.tickets) ||
        !customer.tickets.length
    ) {

        return {

            status: "SKIPPED",

            reason:
                "NO_PENDING_TICKETS"

        };

    }


    /*
     * Ambil ulang ticket dari database.
     *
     * Tujuannya agar sebelum mengirim reminder,
     * kondisi ticket benar-benar masih valid.
     */

    const pendingTickets = [];


    for (
        const ticket of customer.tickets
    ) {

        const latestTicket =
            ticketRepository.findById(
                ticket.id
            );


        /*
         * Ticket sudah tidak ditemukan.
         */

        if (!latestTicket) {

            console.log(
                `⚠️ Ticket tidak ditemukan → ${ticket.id}`
            );

            continue;

        }


        /*
         * Cek ulang apakah feedback sudah diisi.
         */

        const feedback =
            require("../repositories/feedbackRepository")
                .findByTicket(
                    ticket.id
                );


        if (feedback) {

            console.log(
                `⏭️ Feedback sudah masuk → ${ticket.id}`
            );

            continue;

        }


        /*
         * Feedback harus memang sudah pernah
         * dikirim ke customer.
         */

        if (!latestTicket.feedback_sent) {

            console.log(
                `⏭️ Feedback belum pernah dikirim → ${ticket.id}`
            );

            continue;

        }


        /*
         * Ticket harus mempunyai chatId.
         */

        if (
            !latestTicket.chatId ||
            !String(
                latestTicket.chatId
            ).trim()
        ) {

            console.log(
                `⚠️ Chat ID tidak tersedia → ${ticket.id}`
            );

            continue;

        }


        pendingTickets.push(
            latestTicket
        );

    }


    /*
     * Setelah pengecekan ulang,
     * bisa saja semua ticket sudah tidak memenuhi
     * syarat reminder.
     */

    if (!pendingTickets.length) {

        return {

            status: "SKIPPED",

            reason:
                "NO_PENDING_TICKETS"

        };

    }


    /*
     * Gunakan chatId dari ticket pertama
     * sebagai tujuan WhatsApp.
     */

    const chatId =
        pendingTickets[0].chatId;


    /*
     * Buat object customer baru yang hanya
     * berisi ticket yang benar-benar pending.
     */

    const reminderCustomer = {

        chatId,

        nama:
            customer.nama ||
            pendingTickets[0].nama ||
            "Customer",

        nomor:
            customer.nomor ||
            pendingTickets[0].nomor ||
            "",

        tickets:
            pendingTickets

    };


    /*
     * Buat pesan reminder.
     */

    const message =
        buildReminderMessage(
            reminderCustomer
        );


    /*
     * Kirim melalui QC-Inventaris.
     *
     * Helpdesk
     *    ↓
     * QC-Inventaris
     *    ↓
     * Baileys
     *    ↓
     * WhatsApp Customer
     */

    await sendToQCInventaris(
        chatId,
        message
    );


    /*
     * Hanya tandai ticket sebagai reminder
     * setelah pengiriman berhasil.
     */

    for (
        const ticket of pendingTickets
    ) {

        ticketRepository.markFeedbackReminderSent(
            ticket.id
        );


        console.log(
            `🔔 Feedback reminder terkirim → ${ticket.id}`
        );

    }

        console.log(
            `📨 Reminder terkirim ke ${customer.nama || "Customer"} → ${pendingTickets.length} ticket`
        );


    return {

        status: "SENT",

        chatId,

        ticketCount:
            pendingTickets.length,

        ticketIds:
            pendingTickets.map(
                ticket => ticket.id
            )

    };

}

/* ==========================================================
   Jalankan Reminder
========================================================== */

async function runReminder(
    referenceDate = null
) {

    /*
     * Mencegah dua proses reminder
     * berjalan bersamaan.
     */
    if (reminderRunning) {

        return {

            ok: false,

            reason:
                "REMINDER_ALREADY_RUNNING"

        };

    }


    reminderRunning = true;


    const result = {

        total: 0,

        sent: 0,

        skipped: 0,

        failed: 0

    };


    try {

        console.log(
            "🔔 Feedback Reminder dimulai"
        );


        if (referenceDate) {

            console.log(
                `📅 Mode simulasi tanggal: ${referenceDate}`
            );

        }


        while (true) {

            /*
             * Ambil maksimal 5 ticket.
             *
             * Kalau referenceDate diberikan,
             * repository akan menggunakan bulan
             * tersebut sebagai bulan referensi.
             */
            const tickets =
                ticketRepository
                    .findFeedbackReminderTickets(
                        BATCH_SIZE,
                        referenceDate
                    );


            /*
             * Tidak ada ticket lagi.
             */
            if (!tickets.length) {

                console.log(
                    "✅ Feedback Reminder selesai"
                );

                break;

            }


            console.log(
                `📦 Batch ditemukan: ${tickets.length} customer`
            );


            /*
             * Proses satu per satu.
             *
             * Sengaja tidak Promise.all()
             * supaya pesan tidak bersamaan.
             */
            for (const customer of tickets) {

                result.total++;


                try {

                    const response =
                        await sendReminder(customer);


                    if (
                        response.status === "SENT"
                    ) {

                        result.sent++;


                    } else if (
                        response.status === "SKIPPED"
                    ) {

                        result.skipped++;


                    } else {

                        result.failed++;

                    }


                } catch (err) {

                    result.failed++;


                    console.error(
                        `❌ Reminder gagal → ${customer.nama || customer.chatId}`
                    );


                    console.error(
                        err.message
                    );

                }

            }


            /*
             * Kalau batch kurang dari 5,
             * berarti kemungkinan besar sudah
             * batch terakhir.
             */
            if (
                tickets.length < BATCH_SIZE
            ) {

                console.log(
                    "ℹ️ Batch terakhir selesai"
                );

                break;

            }


            /*
             * Tunggu 10 menit sebelum mengambil
             * batch berikutnya.
             */
            console.log(
                "⏳ Menunggu 10 menit sebelum batch berikutnya..."
            );


            await sleep(
                BATCH_INTERVAL_MS
            );

        }


        return {

            ok: true,

            ...result

        };


    } finally {

        reminderRunning = false;

    }

}


/* ==========================================================
   Status
========================================================== */

function isRunning() {

    return reminderRunning;

}


/* ==========================================================
   Export
========================================================== */

module.exports = {

    runReminder,

    isRunning,

    sendReminder

};