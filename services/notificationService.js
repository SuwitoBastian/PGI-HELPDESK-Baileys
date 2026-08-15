const client = require("./waService");

const engineerService =
    require("./engineerService");

/* ==========================================================
   Engineer Menu
========================================================== */

function getEngineerMenu() {

    return engineerService

        .getAll()

        .map(engineer =>

            `${engineer.code} = ${engineer.name}`

        )

        .join("\n");

}

/* ==========================================================
   Engineer Code List
========================================================== */

function getEngineerCodeList() {

    return engineerService

        .getAll()

        .map(engineer => engineer.code)

        .join("\n");

}

/* ==========================================================
   Ticket Created
========================================================== */

async function ticketCreated(chatId, ticket){

    try{

        await client.sendMessage(

            chatId,

`🎫 *IT SUPPORT HELPDESK*
📩 Laporan Anda telah kami terima.
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket*   : ${ticket.id}
🟡 *Status*   : OPEN
⏳ *Progress* : Menunggu Assignment PIC
━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 *PIC IT Support*
${getEngineerMenu()
    .split("\n")
    .map(pic => `• ${pic.replace(" = ", " - ")}`)
    .join("\n")}
━━━━━━━━━━━━━━━━━━━━━━
ℹ️ *Informasi*
• Tidak perlu membalas pesan ini.
• Kode PIC hanya digunakan oleh Tim IT Support.
• Kami akan menghubungi kembali setelah PIC ditentukan.

Terima kasih 🙏`

        );

    }catch(err){

        console.error("❌ Gagal mengirim notifikasi ticket:");
        console.error(err.message);

    }

}

/* ==========================================================
   Ticket Assigned
========================================================== */

async function ticketAssigned(chatId, ticket, pic){

    await client.sendMessage(

        chatId,

`🎫 *IT SUPPORT HELPDESK*
🛠️ Laporan sedang diproses.
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket*   : ${ticket.id}
🟢 *Status*   : PROCESS
👨‍💻 *PIC*      : ${pic}
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cabang*    : ${ticket.cabang}
📝 *Kendala*   : ${ticket.kendala}
━━━━━━━━━━━━━━━━━━━━━━
Terima kasih.
Mohon menunggu proses perbaikan 🙏`

    );

}

/* ==========================================================
   Ticket Closed
========================================================== */

async function ticketClosed(chatId, ticket, pic) {

    await client.sendMessage(

        chatId,

`🎉 *IT SUPPORT HELPDESK*
🎉 Kendala Anda telah berhasil diselesaikan.
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket*   : ${ticket.id}
✅ *Status*   : CLOSED
👨‍💻 *PIC*      : ${pic}
━━━━━━━━━━━━━━━━━━━━━━
🏢 *Cabang*    : ${ticket.cabang}
📝 *Kendala*   : ${ticket.kendala}
━━━━━━━━━━━━━━━━━━━━━━
🙏 *_Mohon meluangkan waktu untuk mengisi penilaian layanan berikut:_*
*_Dan ini wajib ya, karena ini akan menjadi bahan evaluasi tim IT Support._*

https://forms.gle/of1HSXAQa6xrsqGJA

Terima kasih atas kerja samanya 🙏`

    );

}

/* ==========================================================
   DONE - Choose Ticket
========================================================== */

async function doneChooseTicket(chatId, pic, tickets){

    let text =
`
🎫 *IT SUPPORT HELPDESK*
━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 *PIC*
${pic}
Silakan pilih ticket yang akan diselesaikan.
`;
    tickets.forEach((t, index)=>{
        text +=
`${index+1}.
🎫 ${t.id}
🏢 ${t.cabang}
📝 ${t.kendala}
`;
    });

    text +=
`━━━━━━━━━━━━━━━━━━━━━━
✍️ Balas dengan *nomor ticket*.

Contoh:
1`;

    await client.sendMessage(chatId, text);

}

/* ==========================================================
   DONE - Choose PIC
========================================================== */

async function doneChoosePIC(chatId){

    await client.sendMessage(

        chatId,

`🎫 *IT SUPPORT HELPDESK*

*Pilih PIC Assignment*
(*_yaitu PIC yang akan menangani ticket ini._*)

${getEngineerMenu()}

*Balas dengan kode PIC*
0 = Kembali
9 = Batal

ℹ️ *Informasi*

*_Mohon cabang tidak perlu membalas._*
*_Kode PIC hanya digunakan oleh tim IT Support_*`

    );

}

async function doneChooseClosePIC(chatId){

    await client.sendMessage(

        chatId,

`🎫 *IT SUPPORT HELPDESK*

Pilih PIC yang menyelesaikan ticket ini.

${getEngineerMenu()}

0 = Kembali
9 = Batal

ℹ️ *Informasi*
*_Mohon cabang tidak perlu membalas._*
*_Kode PIC hanya digunakan oleh tim IT Support_*`

    );

}

/* ==========================================================
   DONE - Confirm
========================================================== */

async function doneConfirm(
    chatId,
    ticket,
    picAssignment,
    picPenyelesai
){

    await client.sendMessage(

        chatId,

`🎫 *IT SUPPORT HELPDESK*
Mohon konfirmasi penyelesaian ticket berikut.
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket*            : ${ticket.id}
🏢 *Cabang*          : ${ticket.cabang}
📝 *Kendala*          : ${ticket.kendala}

👨‍💻 *PIC Assignment* : ${picAssignment}
✅ *PIC Penyelesai*   : ${picPenyelesai}
━━━━━━━━━━━━━━━━━━━━━━
Balas:

1️⃣ Ya, tutup ticket

0️⃣ Kembali

9️⃣ Batal`

    );

}

/* ==========================================================
   OPEN Reminder
========================================================== */

async function openReminder(tickets){

    if(!tickets.length)
        return;

    let text =
`🚨 *OPEN TICKET REMINDER*

Masih terdapat *${tickets.length}* ticket yang belum di-Assignment lebih dari 15 menit.

`;

    tickets.forEach((ticket, index) => {

        const menit =
            ticket.umurMenit;

        text +=
`━━━━━━━━━━━━━━━━━━━━━━
📌 *Ticket #${index + 1}*
━━━━━━━━━━━━━━━━━━━━━━

🎫 ${ticket.id}
👤 ${ticket.nama}
🏢 ${ticket.cabang}
📝 ${ticket.kendala}
⏰ ${menit} menit
📱 WA : https://wa.me/${ticket.nomor}

`;

    });

    text +=
`━━━━━━━━━━━━━━━━━━━━━━

⚠️ *Mohon segera dilakukan Assignment PIC atau ditindaklanjuti.*

🤖 *_Reminder otomatis IT Support Helpdesk_*`;

    const targets = [

        process.env.SPV_IT,

        process.env.ADMIN_IT

    ];

    for(const nomor of targets){

        if(!nomor)
            continue;

        await client.sendMessage(

            `${nomor}@s.whatsapp.net`,

            text

        );

    }

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    ticketCreated,

    ticketAssigned,

    ticketClosed,

    openReminder,

    doneChoosePIC,

    doneChooseTicket,

    doneConfirm,

    doneChooseClosePIC,

    getEngineerCodeList
    

};