const client = require("./waService");

async function ticketCreated(chatId, ticket){

    try{

        await client.sendMessage(

            chatId,

`🎫 *IT SUPPORT HELPDESK*
Halo Kak, Laporan Anda berhasil diterima.
🎫 *Nomor Ticket*
${ticket.id}
🟡 *OPEN*
(Menunggu Assignment PIC)
━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 *PIC Assignment*
GL = Galih
SW = Suwito
RP = Rifaldo
KA = Andi
IW = Iwan
HL = Hilmi

⚠️ *NOTE*
*_Mohon cabang tidak membalas atau mengetik kode PIC._*
*_Kode PIC hanya digunakan oleh tim IT Support untuk proses penanganan tiket._*
*_Silakan menunggu informasi lebih lanjut dari PIC yang menangani._*
*_Terima kasih._*
━━━━━━━━━━━━━━━━━━━━━━`

        );

    }catch(err){

        console.error("❌ Gagal mengirim notifikasi ticket:");
        console.error(err.message);

    }

}

async function ticketAssigned(chatId, ticket, pic){

    await client.sendMessage(

        chatId,


`🎫 *IT SUPPORT HELPDESK*
Halo Kak,
Laporan Anda sedang ditangani.
🎫 *Nomor Ticket*
${ticket.id}
🏢 *Cabang*
${ticket.cabang}
📝 *Kendala*
${ticket.kendala}
👨‍💻 *PIC*
${pic}

📌 Status
🟢 *PROCESS*
*_Mohon menunggu proses perbaikan._*
*_Terima kasih._*
`

    );

}
async function ticketClosed(chatId, ticket, pic) {

    await client.sendMessage(

        chatId,

`🎫 *IT SUPPORT HELPDESK*
Halo Kak,
Kendala Anda telah selesai dikerjakan.
🎫 *Nomor Ticket*
${ticket.id}
🏢 *Cabang*
${ticket.cabang}
📝 *Kendala*
${ticket.kendala}
👨‍💻 *PIC*
${pic}

📌 Status
✅ *CLOSED*

🙏 *Silakan mengisi penilaian layanan berikut:*

https://forms.gle/fct6HcB4FLJJfRKx9

⚠️ *_NOTE_*
*_Penilaian ini wajib diisi sebagai evaluasi dan peningkatan layanan IT Support._*
*_Dan tetap laporan penyelesaian di grup ya._*`

    );

}
async function doneChooseTicket(chatId, pic, tickets){

    let text =
`━━━━━━━━━━━━━━━━━━━━━━
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
async function doneChoosePIC(chatId){

    await client.sendMessage(

        chatId,


`🎫 *IT SUPPORT HELPDESK*

*Pilih PIC*
GL = Galih
SW = Suwito
RP = Rifaldo
KA = Andi
IW = Iwan
HL = Hilmi

*Balas dengan kode PIC*`

    );

}
async function doneConfirm(chatId, ticket){

    await client.sendMessage(

        chatId,

`━━━━━━━━━━━━━━━━━━━━━━
🎫 *IT SUPPORT HELPDESK*
━━━━━━━━━━━━━━━━━━━━━━

Apakah ticket berikut sudah selesai?

🎫 *Nomor Ticket*
${ticket.id}

🏢 *Cabang*
${ticket.cabang}

📝 *Kendala*
${ticket.kendala}

━━━━━━━━━━━━━━━━━━━━━━

Balas:

1️⃣ Ya, tutup ticket

0️⃣ Kembali

9️⃣ Batal`

    );

}

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
module.exports = {

    ticketCreated,
    ticketAssigned,
    ticketClosed,
    openReminder,
    doneChoosePIC,
    doneChooseTicket,
    doneConfirm

};