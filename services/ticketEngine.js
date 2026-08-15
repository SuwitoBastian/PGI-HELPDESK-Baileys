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
/*
|--------------------------------------------------------------------------
| IDLE
|--------------------------------------------------------------------------
*/

async function handleIdle(msg, session) {

    const text =
        msg.body.trim();

    if (
        !text.includes("Cabang") ||
        !text.includes("Kendala")
    ) {

        return;

    }

    const cabang =
        text.match(/Cabang\s*:\s*(.*)/i)?.[1]?.trim();

    const kendala =
        text.match(/Kendala\s*:\s*(.*)/i)?.[1]?.trim();

    if (!cabang || !kendala) {

        console.log("❌ Cabang atau Kendala kosong");

        return;

    }

    const contact =
        await msg.getContact();

    const ticket =
        ticketService.create({

            nama: contact.pushname,

            nomor: contact.id.user,

            chatId: contact.id._serialized,

            cabang,

            kendala,

            assignmentGroup: msg.from

        });


 try {

    await msg.react("👍");

} catch (err) {

    console.log("⚠️ Gagal memberi reaction:", err.message);

}

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