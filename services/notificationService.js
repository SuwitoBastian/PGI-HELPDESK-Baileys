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
   Kendala - Template Khusus
========================================================== */

function getKendalaType(kendala = "") {

    const text = kendala
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();


    // ==========================================================
    // PRINTER TERTUKAR / TERTUKER
    // ==========================================================

    const isTukar =
        /\btertukar\b/i.test(text) ||
        /\btertuker\b/i.test(text);


    const isPrinter =
        /\bprinter\b/i.test(text);


    const isHasilPrint =
        /\bhasil\s+(print|cetak)\b/i.test(text);


    const isKwitansiBarcode =
        /\bkwitansi\b/i.test(text) &&
        /\bbarcode\b/i.test(text);


    if (
        isTukar &&
        (
            isPrinter ||
            isHasilPrint ||
            isKwitansiBarcode
        )
    ) {

        return "PRINTER_TERTUKAR";

    }



    // ==========================================================
    // TV
    // ==========================================================

    const isTV =
        /\btv\b/i.test(text);

    if (isTV) {

        return "TV";

    }


    // ==========================================================
    // WIFI
    // ==========================================================

    const isWifi =
        /\bwifi\b/i.test(text) ||
        /\bwi[\s-]?fi\b/i.test(text) ||
        /\binternet\b/i.test(text);


    /*
     * Semua laporan WiFi / Internet
     * masuk Auto Troubleshooting WIFI.
     */

    if (isWifi) {

        return "WIFI";

    }


    // ==========================================================
    // TIDAK TERDETEKSI
    // ==========================================================

    return null;
}

function getKendalaTemplate(kendala = "") {

    const text = kendala
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();


    // ==========================================================
    // PRINTER TERTUKAR
    // ==========================================================

    const isPrinterTertukar =
        text.includes("tertukar") &&
        text.includes("printer") &&
        (
            text.includes("barcode") ||
            text.includes("thermal")
        );

    if (isPrinterTertukar) {

        return `
⚠️ *INFORMASI INSTRUKSI PENANGANAN KENDALA*

Laporan Anda terdeteksi terkait hasil *printer barcode dan thermal tertukar*

📋 *Mohon lakukan langkah berikut:*

Cara 1

1. Matikan kedua printer *(kwitansi & barcode)*.
2. Nyalakan *printer kwitansi* terlebih dahulu.
3. Tunggu hingga printer siap, lalu lakukan *tes print*.
4. Nyalakan *printer barcode*, lalu lakukan *tes print*.

Cara 2

1. Matikan kedua printer *(kwitansi & barcode)*.
2. Nyalakan *printer barcode* terlebih dahulu.
3. Tunggu hingga printer siap, lalu lakukan *tes print*.
4. Nyalakan *printer kwitansi*, lalu lakukan *tes print*.

Mohon lakukan sesuai urutan di atas. 🙏`;
}


    // ==========================================================
    // TV
    // ==========================================================

    if (/\btv\b/i.test(text)) {

        return `
📺 *INFORMASI PENANGANAN KENDALA TV*

Untuk setting TV silakan hubungi PIC/divisi terkait:

📱 *+62 811-8113-3405*

Mohon hubungi nomor tersebut untuk penanganan setting TV ya kak. 🙏`;
}
    // ==========================================================
    // WIFI
    // ==========================================================

    const isWifi =
        /\bwifi\b/i.test(text) ||
        /\bwi[\s-]?fi\b/i.test(text) ||
        /\binternet\b/i.test(text);

    if (isWifi) {

        return `
📡 *PENGECEKAN KENDALA WIFI*

Mohon cek lampu indikator *LOS* pada modem.

🔴 Jika lampu *LOS berwarna merah*, balas:
*MERAH*

🟢 Jika lampu *LOS tidak merah*, balas:
*NORMAL*

ℹ️ *Informasi:*
Silakan balas dengan mengetik salah satu kata di atas tanpa emoji/icon
`;
    }


    return "";
}

async function sendAutoTroubleshooting(
    chatId,
    cabang,
    kendala,
    kendalaType
) {

    try {

        console.log("");
        console.log(
            "========== SEND AUTO TROUBLESHOOTING =========="
        );

        console.log(
            "TYPE    :",
            kendalaType
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
            "==============================================="
        );


// ======================================================
// PRINTER TERTUKAR
// ======================================================

if (
    kendalaType === "PRINTER_TERTUKAR"
) {

    await client.sendMessage(
        chatId,

`🎫 *IT SUPPORT HELPDESK*

⚠️ *PENANGANAN OTOMATIS*

🏢 *Cabang* : ${cabang}
📝 *Kendala* : ${kendala}

⚠️ *INFORMASI INSTRUKSI PENANGANAN KENDALA*

Laporan Anda terdeteksi terkait hasil *printer barcode dan thermal tertukar*

📋 *Mohon lakukan langkah berikut:*

Cara 1

1. Matikan kedua printer *(kwitansi & barcode)*.
2. Nyalakan *printer kwitansi* terlebih dahulu.
3. Tunggu hingga printer siap, lalu lakukan *tes print*.
4. Nyalakan *printer barcode*, lalu lakukan *tes print*.

Cara 2

1. Matikan kedua printer *(kwitansi & barcode)*.
2. Nyalakan *printer barcode* terlebih dahulu.
3. Tunggu hingga printer siap, lalu lakukan *tes print*.
4. Nyalakan *printer kwitansi*, lalu lakukan *tes print*.

Mohon lakukan sesuai urutan di atas. 🙏
━━━━━━━━━━━━━━━━━━━━━━
Setelah melakukan langkah di atas, silakan balas:

✅ *BERHASIL*
❌ *BELUM BERHASIL*

ℹ️ *Informasi:*
Silakan balas dengan mengetik salah satu kata di atas tanpa emoji/icon

🤖 Sistem akan melanjutkan proses sesuai hasil penanganan.

Terima kasih 🙏`
    );

    return true;
}

        // ======================================================
        // TV
        // ======================================================

        if (
            kendalaType === "TV"
        ) {

            await client.sendMessage(
                chatId,

`📺 *KENDALA TV*

Untuk kendala yang berkaitan dengan setting atau penggunaan TV, silakan hubungi PIC TV/divisi terkait:

📞 *+62 811-8113-3405*

Kendala TV berada di luar penanganan IT Support.

Apabila PIC belum merespons, mohon menunggu atau menghubungi kembali PIC terkait.

❗ *Mohon tidak membuat laporan IT Support untuk kendala TV.*

Terima kasih 🙏`
            );

            return true;
        }


        // ======================================================
        // WIFI
        // ======================================================

        if (
            kendalaType === "WIFI"
        ) {

            await client.sendMessage(
                chatId,

`🎫 *IT SUPPORT HELPDESK*

⚠️ *PENANGANAN OTOMATIS*

🏢 *Cabang* : ${cabang}
📝 *Kendala* : ${kendala}

Mohon cek indikator *LOS* pada modem.

Jika lampu *LOS MERAH*, balas:

🔴 *MERAH*

Jika lampu *LOS NORMAL*, balas:

🟢 *NORMAL*

ℹ️ *Informasi:*
Silakan balas dengan mengetik salah satu kata di atas tanpa emoji/icon

🤖 Sistem akan melanjutkan proses sesuai hasil pengecekan.

Terima kasih 🙏

`
            );

            return true;
        }


        // ======================================================
        // TYPE TIDAK DIKENAL
        // ======================================================

        console.log(
            "⚠️ Auto Troubleshooting Type tidak dikenali:",
            kendalaType
        );

        return false;


    } catch (err) {

        console.error(
            "❌ Gagal mengirim Auto Troubleshooting:"
        );

        console.error(
            err.message
        );

        return false;

    }

}

async function autoTroubleshootingSuccess(ticket) {

    await client.sendMessage(

        ticket.chatId,

`🎉 *IT SUPPORT HELPDESK*

✅ *PENANGANAN OTOMATIS BERHASIL*
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket* : ${ticket.id}
🟢 *Status* : CLOSED
🤖 *Closed By* : SYSTEM
━━━━━━━━━━━━━━━━━━━━━━
Kendala *${ticket.kendala}* telah berhasil
ditangani melalui instruksi otomatis.

Tidak diperlukan tindakan lebih lanjut
dari Tim IT Support.

Terima kasih 🙏`

    );

}

async function autoTroubleshootingNoTicketSuccess(
    chatId,
    type
) {

    let message = "";

    if (type === "TV") {

        message = `
🎉 *IT SUPPORT HELPDESK*

✅ *PENANGANAN BERHASIL*
━━━━━━━━━━━━━━━━━━━━━━
📺 Kendala TV telah diarahkan ke PIC/divisi terkait.
Tidak diperlukan pembuatan ticket IT Support.
Terima kasih 🙏
`;
    }


    if (type === "WIFI") {

        message = `
🎉 *IT SUPPORT HELPDESK*

✅ *PENANGANAN BERHASIL*
━━━━━━━━━━━━━━━━━━━━━━
📡 Kendala WiFi telah diarahkan melalui KC untuk ditindaklanjuti dengan provider.
Tidak diperlukan pembuatan ticket IT Support.
Terima kasih 🙏
`;
    }


    if (!message)
        return;


    await client.sendMessage(
        chatId,
        message
    );
}

/* ==========================================================
   WIFI - PROVIDER
========================================================== */

async function wifiProvider(chatId) {

    await client.sendMessage(

        chatId,

`📡 *INFORMASI KENDALA WIFI*

Jika lampu *LOS berwarna merah*, silakan chat *KC masing-masing* ya kak.

Nanti KC akan menghubungi provider untuk penanganan lebih lanjut. 🙏

Tidak perlu membuat ticket IT Support untuk kondisi ini.`

    );

}


/* ==========================================================
   WIFI - RESTART MODEM
========================================================== */

async function wifiRestart(chatId) {

    await client.sendMessage(

        chatId,

`📡 *PENGECEKAN KENDALA WIFI*

Karena lampu LOS tidak merah, silakan coba *restart modem* terlebih dahulu.

🔄 Matikan modem, tunggu sekitar 1 menit, lalu nyalakan kembali.

🎥 *Panduan restart modem:*
https://youtu.be/xFcYzBdXUpA?si=CeLGiJrpMv2V2IFg

Setelah dicoba, balas:

✅ *BERHASIL*
❌ *BELUM BERHASIL*

ℹ️ *Informasi:*
Silakan balas dengan mengetik salah satu kata di atas tanpa emoji/icon`

    );

}

/* ==========================================================
   Ticket Created
========================================================== */

async function ticketCreated(
    chatId,
    ticket,
    includeKendalaTemplate = true
){

    try{

        const kendalaTemplate =
            includeKendalaTemplate
                ? getKendalaTemplate(ticket.kendala)
                : "";

        await client.sendMessage(

            chatId,

`🎫 *IT SUPPORT HELPDESK*
📩 Laporan Anda telah kami terima.
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket*   : ${ticket.id}
🟡 *Status*   : OPEN
⏳ *Progress* : Menunggu Assignment PIC
━━━━━━━━━━━━━━━━━━━━━━
${kendalaTemplate}
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

    sendAutoTroubleshooting,

    ticketAssigned,

    ticketClosed,

    openReminder,

    doneChoosePIC,

    doneChooseTicket,

    doneConfirm,

    doneChooseClosePIC,

    getEngineerCodeList,

    getKendalaTemplate,

    getKendalaType,

    autoTroubleshootingSuccess,

    autoTroubleshootingNoTicketSuccess,

    wifiProvider,

    wifiRestart
    

};