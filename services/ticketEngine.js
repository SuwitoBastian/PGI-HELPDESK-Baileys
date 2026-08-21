const ticketService =
    require('./ticketService');

const assignService =
    require('./assignService');

const sessionService =
    require('./sessionService');

const notificationService =
    require('./notificationService');

const doneEngine =
    require('./doneEngine');

const doneService =
    require('./doneService');

const engineerService =
    require("./engineerService");

/*
|--------------------------------------------------------------------------
| INCOMING
| Pesan dari Cabang
|--------------------------------------------------------------------------
*/

async function handleIncoming(msg) {

    if (msg.from.endsWith("@broadcast"))
        return;
    const session =
        sessionService.get(msg.from);

    // ==========================================================
    // AUTO TROUBLESHOOTING
    // ==========================================================

    if (
        session.state === "AUTO_TROUBLESHOOTING" ||
        session.state === "WIFI_RESTART"
    ) {

        return handleAutoTroubleshooting(
            msg,
            session
        );

    }


    // ==========================================================
    // IDLE
    // ==========================================================

    return handleIdle(msg);

}

/*
|--------------------------------------------------------------------------
| OUTGOING
| Pesan yang diketik IT
|--------------------------------------------------------------------------
*/

async function handleOutgoing(msg) {

    const text =
        msg.body.trim().toUpperCase();

    const session =
        sessionService.get(msg.from);

    // ======================
    // Command yang diizinkan
    // ======================

    const engineerCodes =
        engineerService
            .getAll()
            .map(engineer =>
                engineer.code.toUpperCase()
            );

    const allowedCommands = [

        "DONE",

        "0",

        "9",

        ...engineerCodes

    ];

    const isNumber =
        /^\d+$/.test(text);

    // Jika bukan command dan bukan sedang berada di wizard,
    // abaikan saja.
    if (
        session.state === "IDLE" &&
        !allowedCommands.includes(text) &&
        !isNumber
    ) {
        return;
    }

    // ======================
    // START DONE
    // ======================

    if (text === "DONE") {

        return doneEngine.start(msg);

    }

    // ======================
    // WIZARD DONE
    // ======================

    const handled =
        await doneEngine.handle(msg);

    if (handled) {

        return;

    }

    // ======================
    // ASSIGNMENT
    // ======================

    return handleWaitingAssign(msg);

}

async function handleAutoTroubleshooting(
    msg,
    session
) {

    // ==========================================================
    // NORMALISASI JAWABAN
    // ==========================================================

    let jawaban =
        msg.body
            .trim()
            .toUpperCase();


    // ==========================================================
    // NORMALISASI EMOJI
    //
    // 🔴 = MERAH
    // 🟢 = NORMAL
    // ⚫ = MATI
    // ❌ = BELUM BERHASIL
    // ✅ = BERHASIL
    // ==========================================================

    if (jawaban.includes("🔴")) {
        jawaban += " MERAH";
    }

    if (jawaban.includes("🟢")) {
        jawaban += " NORMAL";
    }

    if (jawaban.includes("⚫")) {
        jawaban += " MATI";
    }

    if (jawaban.includes("❌")) {
        jawaban += " BELUM BERHASIL";
    }

    if (jawaban.includes("✅")) {
        jawaban += " BERHASIL";
    }

    // ==========================================================
    // WIFI - CEK LOS
    // ==========================================================

    if (
        session.autoTroubleshooting?.type === "WIFI" &&
        session.state === "AUTO_TROUBLESHOOTING"
    ) {


        // ======================================================
        // LOS MERAH
        // ======================================================

        if (
            jawaban.includes("MERAH")
        ) {

            console.log(
                "🔴 WIFI LOS MERAH → PROVIDER"
            );

            await notificationService.wifiProvider(
                session.autoTroubleshooting.chatId
            );

            sessionService.reset(
                msg.from
            );

            return true;
        }


        // ======================================================
        // LOS NORMAL
        // ======================================================

        if (
            jawaban.includes("NORMAL")
        ) {

            console.log(
                "🟢 WIFI LOS NORMAL → RESTART MODEM"
            );

            session.state =
                "WIFI_RESTART";

            await notificationService.wifiRestart(
                session.autoTroubleshooting.chatId
            );

            return true;
        }


        // ======================================================
        // MODEM MATI
        // LANGSUNG BUAT TICKET OPEN NORMAL
        // ======================================================

        if (
            jawaban.includes("MATI")
        ) {

            console.log(
                "⚫ WIFI MODEM MATI → BUAT TICKET OPEN"
            );

            const data =
                session.autoTroubleshooting;


            const ticket =
                ticketService.create({

                    nama:
                        data.nama,

                    nomor:
                        data.nomor,

                    chatId:
                        data.chatId,

                    cabang:
                        data.cabang,

                    kendala:
                        data.kendala,

                    waktu:
                        data.startedAt,

                    assignmentGroup:
                        data.assignmentGroup

                });


            console.log(
                `🎫 Ticket ${ticket.id} dibuat dari WiFi Troubleshooting - MODEM MATI`
            );


            // Ticket dibuat seperti laporan normal

            await notificationService.ticketCreated(
                ticket.chatId,
                ticket,
                false
            );


            sessionService.reset(
                msg.from
            );

            return true;
        }


        // ======================================================
        // JAWABAN WIFI TIDAK DIKENAL
        // ======================================================

        await msg.reply(
`⚠️ Mohon pilih salah satu:

🔴 *MERAH*
🟢 *NORMAL*
⚫ *MATI*`
        );

        return true;
    }


    // ==========================================================
    // WIFI - RESTART MODEM
    // ==========================================================

    if (
        session.autoTroubleshooting?.type === "WIFI" &&
        session.state === "WIFI_RESTART"
    ) {


        // ======================================================
        // BELUM BERHASIL
        //
        // HARUS DICEK SEBELUM BERHASIL
        // karena "BELUM BERHASIL" mengandung "BERHASIL"
        // ======================================================

        if (
            jawaban.includes("BELUM BERHASIL")
        ) {

            console.log(
                "❌ WIFI BELUM BERHASIL → BUAT TICKET OPEN"
            );

            const data =
                session.autoTroubleshooting;


            const ticket =
                ticketService.create({

                    nama:
                        data.nama,

                    nomor:
                        data.nomor,

                    chatId:
                        data.chatId,

                    cabang:
                        data.cabang,

                    kendala:
                        data.kendala,

                    waktu:
                        data.startedAt,

                    assignmentGroup:
                        data.assignmentGroup

                });


            console.log(
                `🎫 Ticket ${ticket.id} dibuat dari WiFi Troubleshooting`
            );


            await notificationService.ticketCreated(
                ticket.chatId,
                ticket,
                false
            );


            sessionService.reset(
                msg.from
            );

            return true;
        }


        // ======================================================
        // BERHASIL
        // ======================================================

        if (
            jawaban.includes("BERHASIL")
        ) {

            console.log(
                "✅ WIFI BERHASIL SETELAH RESTART MODEM"
            );


            await msg.reply(
`🎉 *IT SUPPORT HELPDESK*

✅ Kendala WiFi berhasil ditangani.

Tidak diperlukan pembuatan ticket IT Support.

Terima kasih 🙏`
            );


            sessionService.reset(
                msg.from
            );

            return true;
        }


        await msg.reply(
`⚠️ Mohon pilih salah satu:

✅ *BERHASIL*
❌ *BELUM BERHASIL*`
        );

        return true;
    }


    // ==========================================================
    // DATA AUTO TROUBLESHOOTING
    // ==========================================================

    const data =
        session.autoTroubleshooting;


    if (!data) {

        console.log(
            "❌ Data Auto Troubleshooting tidak ditemukan"
        );

        sessionService.reset(
            msg.from
        );

        return true;
    }

    // ==========================================================
    // PRINTER - BELUM BERHASIL
    //
    // CEK DULU SEBELUM BERHASIL
    // ==========================================================

    if (
        data.type === "PRINTER_TERTUKAR" &&
        jawaban.includes("BELUM BERHASIL")
    ) {

        const ticket =
            ticketService.create({

                nama:
                    data.nama,

                nomor:
                    data.nomor,

                chatId:
                    data.chatId,

                cabang:
                    data.cabang,

                kendala:
                    data.kendala,

                waktu:
                    data.startedAt,

                assignmentGroup:
                    data.assignmentGroup

            });


        console.log(
            `🎫 Ticket ${ticket.id} dibuat dari Printer Troubleshooting`
        );


        // Ticket dibuat seperti laporan normal

        await notificationService.ticketCreated(
            ticket.chatId,
            ticket,
            false
        );


        sessionService.reset(
            msg.from
        );

        return true;
    }


    // ==========================================================
    // PRINTER - BERHASIL
    // BUAT TICKET + AUTO CLOSE
    // ==========================================================

    if (
        data.type === "PRINTER_TERTUKAR" &&
        jawaban.includes("BERHASIL")
    ) {

        const ticket =
            ticketService.create({

                nama:
                    data.nama,

                nomor:
                    data.nomor,

                chatId:
                    data.chatId,

                cabang:
                    data.cabang,

                kendala:
                    data.kendala,

                waktu:
                    data.startedAt,

                assignmentGroup:
                    data.assignmentGroup

            });


        console.log(
            `🎫 Ticket ${ticket.id} dibuat dari Auto Troubleshooting`
        );


        doneService.close(
            ticket,
            "SYSTEM",
            null
        );


        console.log(
            `🤖 Ticket ${ticket.id} AUTO CLOSED`
        );


        await notificationService
            .autoTroubleshootingSuccess(
                ticket
            );


        sessionService.reset(
            msg.from
        );

        return true;
    }


    // ==========================================================
    // JAWABAN TIDAK DIKENAL
    // ==========================================================

    await msg.reply(
`⚠️ Mohon pilih jawaban sesuai instruksi sebelumnya.`
    );

    return true;
}

/*
|--------------------------------------------------------------------------
| IDLE
|--------------------------------------------------------------------------
*/
async function handleIdle(msg) {

    const text =
        msg.body.trim();


    // ==========================================================
    // VALIDASI FORMAT LAPORAN
    // ==========================================================

    if (
        !text.includes("Cabang") ||
        !text.includes("Kendala")
    ) {

        return;

    }


    // ==========================================================
    // AMBIL CABANG & KENDALA
    // ==========================================================

    const cabang =
        text.match(
            /Cabang\s*:\s*(.*)/i
        )?.[1]?.trim();


    const kendala =
        text.match(
            /Kendala\s*:\s*(.*)/i
        )?.[1]?.trim();


    if (!cabang || !kendala) {

        console.log(
            "❌ Cabang atau Kendala kosong"
        );

        return;

    }


    // ==========================================================
    // CONTACT
    // ==========================================================

    const contact =
        await msg.getContact();


    // ==========================================================
    // CEK JENIS AUTO TROUBLESHOOTING
    // ==========================================================

    const kendalaType =
        notificationService.getKendalaType(
            kendala
        );


    // ==========================================================
    // AUTO TROUBLESHOOTING
    // ==========================================================

    if (kendalaType) {

        // ======================================================
        // PRIVATE CHAT ID
        // ======================================================

        const targetChatId =
            contact.id._serialized;


        // ======================================================
        // LID CHAT ID
        // ======================================================

        const lidChatId =
            msg.participant ||
            msg.participantAlt ||
            msg.remoteJidAlt ||
            null;


        // ======================================================
        // AMBIL SESSION PRIVATE
        // ======================================================

        const autoSession =
            sessionService.get(
                targetChatId
            );


        // ======================================================
        // TV
        // LANGSUNG KIRIM PESAN PIC
        // TIDAK MEMBUAT SESSION AUTO TROUBLESHOOTING
        // ======================================================

        if (kendalaType === "TV") {

            console.log(
                "📺 KENDALA TV → LANGSUNG ARAHKAN KE PIC TV"
            );

            try {
                await msg.react("🤖");
            } catch (err) {
                console.log(
                    "⚠️ Gagal memberi reaction:",
                    err.message
                );
            }

            await notificationService.sendAutoTroubleshooting(
                targetChatId,
                cabang,
                kendala,
                kendalaType
            );

            return;
        }


        // ======================================================
        // SET SESSION
        // ======================================================

        autoSession.state =
            "AUTO_TROUBLESHOOTING";


        autoSession.autoTroubleshooting = {

            type:
                kendalaType,

            cabang,

            kendala,

            nama:
                contact.pushname,

            nomor:
                contact.id.user,

            chatId:
                targetChatId,

            assignmentGroup:
                msg.from,

            startedAt:
                new Date()

        };


        // ======================================================
        // LINK SESSION LID
        // ======================================================

        if (lidChatId) {

            sessionService.linkSession(

                targetChatId,

                lidChatId

            );

        }

        // ======================================================
        // AUTO TROUBLESHOOTING TIMER
        // 20 MENIT
        // ======================================================

        sessionService.startAutoTroubleshootingTimer(
            targetChatId,
            20 * 60 * 1000,
            async (session) => {

                const chatId =
                    session.autoTroubleshooting?.chatId;

                if (!chatId) {

                    return;

                }


                await notificationService.sendAutoTroubleshootingExpired(
                    chatId
                );

            }
        );

        // ======================================================
        // KIRIM INSTRUKSI AUTO TROUBLESHOOTING
        // ======================================================

        await notificationService.sendAutoTroubleshooting(

            targetChatId,

            cabang,

            kendala,

            kendalaType

        );


        // ======================================================
        // REACTION
        // ======================================================

        try {

            await msg.react("🤖");

        } catch (err) {

            console.log(
                "⚠️ Gagal memberi reaction:",
                err.message
            );

        }


        return;

    }


    // ==========================================================
    // TICKET NORMAL
    // ==========================================================

    const ticket =
        ticketService.create({

            nama:
                contact.pushname,

            nomor:
                contact.id.user,

            chatId:
                contact.id._serialized,

            cabang,

            kendala,

            assignmentGroup:
                msg.from

        });


    console.log(
        `✅ Ticket ${ticket.id} dibuat`
    );


    // ==========================================================
    // REACTION
    // ==========================================================

    try {

        await msg.react("👍");

    } catch (err) {

        console.log(
            "⚠️ Gagal memberi reaction:",
            err.message
        );

    }


    // ==========================================================
    // NOTIFICATION
    // ==========================================================

    await notificationService.ticketCreated(

        contact.id._serialized,

        ticket

    );

}

/*
|--------------------------------------------------------------------------
| WAITING ASSIGN
|--------------------------------------------------------------------------
*/

async function handleWaitingAssign(msg) {

    const kodePIC =
        msg.body
            .trim()
            .toUpperCase();

    const daftarKode =
        engineerService
            .getAll()
            .map(engineer =>
                engineer.code.toUpperCase()
            );

    if (!daftarKode.includes(kodePIC)) {
        return;
    }

    const chat =
        await msg.getChat();

    const contact =
        await chat.getContact();

    const nomor =
        contact.id.user;

    const result =
        assignService.assignByNomor(
            nomor,
            kodePIC
        );

    // Tidak ada ticket OPEN yang menunggu assignment
    if (!result) {
        return;
    }

    const { pic, ticket } = result;

    console.log(
        `✅ ${pic} mengambil ticket ${ticket.id}`
    );

    await notificationService.ticketAssigned(

        ticket.chatId,

        ticket,

        pic

    );

}

/*
|--------------------------------------------------------------------------
| PROCESS
|--------------------------------------------------------------------------
*/

async function handleProcess(msg, session) {

}

/*
|--------------------------------------------------------------------------
| WAITING CLOSE
|--------------------------------------------------------------------------
*/

async function handleWaitingClose(msg, session) {

}

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {

    handleIncoming,

    handleOutgoing

};