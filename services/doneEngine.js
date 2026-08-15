const sessionService =
    require('./sessionService');

const doneService =
    require('./doneService');

const notificationService =
    require('./notificationService');

const ticketRepository =
    require('../repositories/ticketRepository');

const engineerService =
    require("./engineerService");

function getPIC(kode) {

    const engineer =
        engineerService.getByCode(kode);

    return engineer
        ? engineer.name
        : null;

}

async function start(msg) {

    sessionService.setState(
        msg.from,
        "WAITING_DONE_PIC"
    );

    console.log("");
    console.log("====================");
    console.log("STATE → WAITING_DONE_PIC");
    console.log("");

    await notificationService.doneChoosePIC(
        msg.from
    );

}

async function showTicketList(msg, session) {

    let text =
`🎫 *IT SUPPORT HELPDESK*

👨‍💻 *PIC Assignment*
${session.selectedPIC}

Silakan pilih ticket yang akan diselesaikan.

`;

    session.daftarTiket.forEach((t, index) => {

        text +=
`${index + 1}.
🎫 ${t.id}
🏢 ${t.cabang}
👨‍💻 Assignment : ${t.pic}
📝 ${t.kendala}

`;

    });

    text +=
`Balas dengan nomor ticket.

0 = Refresh daftar
9 = Batal`;

    await msg.reply(text);

}
async function pilihTicket(msg, session){

    const nomor =
        parseInt(msg.body);

    if(isNaN(nomor))
        return true;

    console.log(
        "NOMOR TICKET DIPILIH :",
        nomor
    );

    // =====================
    // Refresh daftar
    // =====================

    if(nomor === 0){

        await showTicketList(
            msg,
            session
        );

        console.log(
            "🔄 Daftar ticket direfresh"
        );

        return true;

    }

    // =====================
    // Batal
    // =====================

    if(nomor === 9){

        sessionService.reset(msg.from);

        await msg.reply(
`❌ Proses DONE dibatalkan.`
        );

        console.log(
            "❌ Proses DONE dibatalkan"
        );

        return true;

    }

    // =====================
    // Cek ticket
    // =====================

    const ticket =
        session.daftarTiket[nomor-1];

    if(!ticket){

        console.log(
            `❌ Ticket nomor ${nomor} tidak ditemukan`
        );

        await msg.reply(
`❌ Nomor ticket tidak ditemukan.

Silakan pilih nomor yang tersedia.

0 = Refresh daftar
9 = Batal`
        );

        return true;

    }

    console.log(
        "TICKET TERPILIH :",
        ticket.id
    );

    session.selectedTicket =
        ticket;

    sessionService.setState(
        msg.from,
        "WAITING_DONE_CLOSE_PIC"
    );

    console.log(
        "STATE → WAITING_DONE_CLOSE_PIC"
    );

    await notificationService.doneChooseClosePIC(
        msg.from
    );

    console.log(
        "✅ Menu PIC penyelesai terkirim"
    );

    return true;

}
async function confirmDone(msg, session) {

    const jawaban =
    msg.body.trim();

// ======================
// Batal
// ======================

if (jawaban === "9") {

    console.log("❌ Close Ticket dibatalkan");

    sessionService.reset(msg.from);

    await msg.reply("❌ Proses DONE dibatalkan.");

    return true;

}

// ======================
// Kembali
// ======================

if (jawaban === "0") {

    sessionService.setState(
        msg.from,
        "WAITING_DONE_CLOSE_PIC"
    );

await notificationService.doneChooseClosePIC(
    msg.from
);

    return true;

}

if (jawaban !== "1") {

    return true;

}

    // ======================
    // Harus pilih 1
    // ======================


    const ticket =
        session.selectedTicket;

   console.log("");

console.log("Menutup Ticket...");

doneService.close(
    ticket,
    session.selectedClosePIC,
    session.selectedClosePICCode
);

// Kirim notifikasi ke cabang
await notificationService.ticketClosed(

    ticket.chatId,

    ticket,

    session.selectedClosePIC

);

// Tandai link feedback berhasil dikirim
ticketRepository.markFeedbackSent(ticket.id);

// Balasan ke IT
await msg.reply(
`✅ Ticket ${ticket.id} berhasil di-CLOSED.`
);

console.log(
    `✅ Ticket ${ticket.id} CLOSED`
);

sessionService.reset(
    msg.from
);
console.log("");
console.log("====================");
console.log("STATE → IDLE");
console.log("====================");

return true;

}

async function handle(msg){

    const session =
    sessionService.get(msg.from);
    console.log("");

// =========================
// PILIH TICKET
// =========================

if (session.state === "WAITING_DONE_TICKET") {

    return pilihTicket(msg, session);
}
if (session.state === "WAITING_DONE_CLOSE_PIC") {
    

    const kode =
        msg.body.trim().toUpperCase();

    if (kode === "9") {

        sessionService.reset(msg.from);

        await msg.reply("❌ Proses DONE dibatalkan.");

        return true;

    }


    if (kode === "0") {
        console.log("MASUK MENU KEMBALI");

        await showTicketList(msg, session);

sessionService.setState(
    msg.from,
    "WAITING_DONE_TICKET"
);

return true;

}

    const picSelesai =
        getPIC(kode);

    if (!picSelesai) {

await msg.reply(
`❌ Kode PIC tidak ditemukan.

Gunakan salah satu kode berikut:

${notificationService.getEngineerCodeList()}`
);

        return true;

    }

    session.selectedClosePIC =
        picSelesai;

    session.selectedClosePICCode =
        kode;

    sessionService.setState(
        msg.from,
        "WAITING_CONFIRM_DONE"
    );

    const ticket =
        session.selectedTicket;

await notificationService.doneConfirm(

    msg.from,

    ticket,

    session.selectedPIC,

    picSelesai

);

    return true;

}
if (session.state === "WAITING_CONFIRM_DONE") {

    return confirmDone(msg, session);

}
// =========================
// PILIH PIC
// =========================

if (session.state !== "WAITING_DONE_PIC")
    return false;

    const kode =
    msg.body
        .trim()
        .toUpperCase();
    // ======================
// Batal
// ======================

if (kode === "9") {

    sessionService.reset(msg.from);

    await msg.reply(
`❌ Proses DONE dibatalkan.`
    );

    console.log("");
    console.log("====================");
    console.log("STATE → IDLE");
    console.log("====================");

    return true;

}

// ======================
// Refresh daftar PIC
// ======================

if (kode === "0") {

    sessionService.setState(
        msg.from,
        "WAITING_DONE_PIC"
    );

    await notificationService.doneChoosePIC(
        msg.from
    );

    return true;

}
    

const pic =
    getPIC(kode);

    if(!pic){

await msg.reply(
`❌ Kode PIC tidak ditemukan.

Gunakan salah satu kode berikut:

${notificationService.getEngineerCodeList()}`
);

    return true;

    }
    

const tickets =
    doneService.getTicketsByPIC(pic);

if (tickets.length === 0) {

    console.log("");
    console.log(`❌ ${pic} tidak memiliki ticket PROCESS`);

    await msg.reply(
`❌ Tidak ada ticket PROCESS milik ${pic}.

Wizard DONE dibatalkan.

Silakan ketik DONE kembali jika ingin mencoba lagi.`
    );

    sessionService.setState(
        msg.from,
        "IDLE"
    );

    console.log(`
====================
STATE → IDLE
====================
`);

    return true;

}

session.selectedPIC = pic;
session.daftarTiket = tickets;

session.selectedTicket = null;
session.selectedClosePIC = null;

sessionService.setState(
    msg.from,
    "WAITING_DONE_TICKET"
);

console.log("");
console.log("====================");
console.log("STATE → WAITING_DONE_TICKET");

await notificationService.doneChooseTicket(
    msg.from,
    pic,
    tickets
);

return true;

}

module.exports = {

    start,

    handle

};