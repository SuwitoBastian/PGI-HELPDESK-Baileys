const sessionService =
    require('./sessionService');

const doneService =
    require('./doneService');

const notificationService =
    require('./notificationService');

const daftarPIC = {

    GL: "Galih",
    GALIH: "Galih",

    SW: "Suwito",
    SUWITO: "Suwito",

    RP: "Rifaldo",
    RIFALDO: "Rifaldo",

    KA: "Andi",
    ANDI: "Andi",

    IW: "Iwan",
    IWAN: "Iwan",

    HL: "Hilmi",
    HILMI: "Hilmi"

};


async function start(msg){

    sessionService.setState(
        msg.from,
        "WAITING_DONE_PIC"
    );

    console.log("");
    console.log("====================");
    console.log("STATE → WAITING_DONE_PIC");
    console.log("");

await msg.reply(
`🎫 *IT SUPPORT HELPDESK*

*Pilih PIC Assignment*
*_(yaitu PIC yang mengambil ticket tersebut)_*

GL = Galih
SW = Suwito
RP = Rifaldo
KA = Andi
IW = Iwan
HL = Hilmi

*Balas dengan kode PIC*
0 = Refresh daftar
9 = Batal
⚠️ *NOTE*
*_Mohon cabang tidak perlu membalas._*
*_Kode PIC hanya digunakan oleh tim IT Support_*`
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

    await msg.reply(
`🎫 *IT SUPPORT HELPDESK*

Pilih PIC yang menyelesaikan ticket ini.

GL = Galih
SW = Suwito
RP = Rifaldo
KA = Andi
IW = Iwan
HL = Hilmi

0 = Kembali
9 = Batal
⚠️ *NOTE*
*_Mohon cabang tidak perlu membalas._*
*_Kode PIC hanya digunakan oleh tim IT Support_*`
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

    await msg.reply(
`🎫 *IT SUPPORT HELPDESK*

Pilih PIC yang menyelesaikan ticket ini.

GL = Galih
SW = Suwito
RP = Rifaldo
KA = Andi
IW = Iwan
HL = Hilmi

0 = Kembali
9 = Batal
⚠️ *NOTE*
*_Mohon cabang tidak perlu membalas._*
*_Kode PIC hanya digunakan oleh tim IT Support_*
`);

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
    session.selectedClosePIC
);

// Kirim notifikasi ke cabang
await notificationService.ticketClosed(

    ticket.chatId,

    ticket,

    session.selectedClosePIC

);

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
        daftarPIC[kode];

    if (!picSelesai) {

        await msg.reply(
`❌ Kode PIC tidak ditemukan.

GL
SW
RP
KA
IW
HL`
        );

        return true;

    }

    session.selectedClosePIC =
        picSelesai;

    sessionService.setState(
        msg.from,
        "WAITING_CONFIRM_DONE"
    );

    const ticket =
        session.selectedTicket;

await msg.reply(

`🎫 *IT SUPPORT HELPDESK*

Apakah ticket berikut sudah selesai?

🎫 *Nomor Ticket*
${ticket.id}

🏢 *Cabang*
${ticket.cabang}

📝 *Kendala*
${ticket.kendala}

👨‍💻 *PIC Assignment*
${session.selectedPIC}

✅ *PIC Penyelesai*
${picSelesai}

Balas:

1️⃣ Ya, tutup ticket

0️⃣ Kembali

9️⃣ Batal`
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
    daftarPIC[kode];


    if(!pic){

    await msg.reply(
`❌ Kode PIC tidak ditemukan.

Gunakan salah satu kode berikut:

GL
SW
RP
KA
IW
HL`
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

let text =
`🎫 *IT SUPPORT HELPDESK*

👨‍💻 *PIC Assignment*
${pic}

Silakan pilih ticket yang akan diselesaikan.

`;

tickets.forEach((t,index)=>{

text +=
`${index+1}.
🎫 ${t.id}
🏢 ${t.cabang}
👨‍💻 Assignment : ${t.pic}
📝 ${t.kendala}

`;

});

text +=
`Balas dengan nomor ticket.

0 = Refresh daftar
9 = Batal
⚠️ *NOTE*
*_Mohon cabang tidak perlu membalas._*
*_Nomor ticket hanya digunakan oleh tim IT Support_*`;

await msg.reply(text);
    return true;

}

module.exports = {

    start,

    handle

};