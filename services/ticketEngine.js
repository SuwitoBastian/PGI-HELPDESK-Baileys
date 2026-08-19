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

    const jawaban =
        msg.body
            .trim()
            .toUpperCase();

    console.log("");
    console.log("==============================");
    console.log("🤖 AUTO TROUBLESHOOTING");
    console.log("JAWABAN :", jawaban);
    console.log("==============================");


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

        if (jawaban === "MERAH") {

            console.log(
                "🔴 WIFI LOS MERAH → PROVIDER"
            );

            await notificationService.wifiProvider(
                session.autoTroubleshooting.chatId
            );

            sessionService.reset(msg.from);

            return true;
        }


        // ======================================================
        // LOS NORMAL
        // ======================================================

        if (jawaban === "NORMAL") {

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


        await msg.reply(
`⚠️ Mohon pilih salah satu:

🔴 *MERAH*
🟢 *NORMAL*`
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
        // BERHASIL
        // ======================================================

        if (jawaban === "BERHASIL") {

            console.log(
                "✅ WIFI BERHASIL SETELAH RESTART MODEM"
            );

            await msg.reply(
`🎉 *IT SUPPORT HELPDESK*

✅ Kendala WiFi berhasil ditangani.

Tidak diperlukan pembuatan ticket IT Support.

Terima kasih 🙏`
            );

            sessionService.reset(msg.from);

            return true;
        }


        // ======================================================
        // BELUM BERHASIL
        // ======================================================

        if (jawaban === "BELUM BERHASIL") {

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


            // Ticket dibuat seperti laporan normal
            // Tanpa template troubleshooting tambahan

            await notificationService.ticketCreated(
                ticket.chatId,
                ticket,
                false
            );


            sessionService.reset(msg.from);

            return true;
        }


        await msg.reply(
`⚠️ Mohon pilih salah satu:

✅ *BERHASIL*
❌ *BELUM BERHASIL*

ℹ️ *Informasi:*
Silakan balas dengan mengetik salah satu kata di atas tanpa emoji/icon`
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

        sessionService.reset(msg.from);

        return true;
    }


    // ==========================================================
    // TV - BERHASIL
    // ==========================================================

    if (
        data.type === "TV" &&
        jawaban === "BERHASIL"
    ) {

        console.log(
            "✅ Auto Troubleshooting TV berhasil"
        );

        console.log(
            "🎫 Ticket tidak dibuat"
        );


        await notificationService
            .autoTroubleshootingNoTicketSuccess(
                data.chatId,
                data.type
            );


        sessionService.reset(msg.from);

        return true;
    }


    // ==========================================================
    // TV - BELUM BERHASIL
    // TETAP DIARAHKAN KE PIC TV
    // TIDAK MEMBUAT TICKET IT
    // ==========================================================

    if (
        data.type === "TV" &&
        jawaban === "BELUM BERHASIL"
    ) {

        console.log(
            "📺 TV BELUM BERHASIL → TETAP KE PIC TV"
        );


        await msg.reply(
    `📺 *KENDALA TV*

    Untuk kendala yang berkaitan dengan setting atau penggunaan TV, silakan hubungi PIC TV/divisi terkait:

    📞 *+62 811-8113-3405*

    Kendala TV berada di luar penanganan IT Support.

    Apabila PIC belum merespons, mohon menunggu atau menghubungi kembali PIC terkait.

    ❗ *Mohon tidak membuat laporan IT Support untuk kendala TV.*

    Terima kasih 🙏`
        );


        sessionService.reset(msg.from);

        return true;
    }


    // ==========================================================
    // PRINTER - BERHASIL
    // BUAT TICKET + AUTO CLOSE
    // ==========================================================

    if (
        data.type === "PRINTER_TERTUKAR" &&
        jawaban === "BERHASIL"
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


        sessionService.reset(msg.from);

        return true;
    }


    // ==========================================================
    // PRINTER - BELUM BERHASIL
    // BUAT TICKET OPEN NORMAL
    // ==========================================================

    if (
        data.type === "PRINTER_TERTUKAR" &&
        jawaban === "BELUM BERHASIL"
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
        // Tanpa template troubleshooting tambahan

        await notificationService.ticketCreated(
            ticket.chatId,
            ticket,
            false
        );


        sessionService.reset(msg.from);

        return true;
    }


    // ==========================================================
    // JAWABAN TIDAK DIKENAL
    // ==========================================================

    await msg.reply(
`⚠️ Mohon pilih salah satu:

✅ *BERHASIL*
❌ *BELUM BERHASIL*

ℹ️ *Informasi:*
Silakan balas dengan mengetik salah satu kata di atas tanpa emoji/icon`
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
        // DEBUG AUTO TROUBLESHOOTING
        // ======================================================

        console.log("");

        console.log(
            "=============================="
        );

        console.log(
            "🤖 AUTO TROUBLESHOOTING"
        );

        console.log(
            "=============================="
        );

        console.log(
            "GROUP   :",
            msg.from
        );

        console.log(
            "PRIVATE :",
            targetChatId
        );

        console.log(
            "CABANG  :",
            cabang
        );

        console.log(
            "KENDALA :",
            kendala
        );

        console.log(
            "TYPE    :",
            kendalaType
        );

        console.log(
            "STATE   :",
            autoSession.state
        );

        console.log(
            "=============================="
        );

        console.log("");


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
    
    console.log("KODE :", kodePIC);

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

    console.log("STATE : PROCESS");

}

/*
|--------------------------------------------------------------------------
| WAITING CLOSE
|--------------------------------------------------------------------------
*/

async function handleWaitingClose(msg, session) {

    console.log("STATE : WAITING_CLOSE");

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