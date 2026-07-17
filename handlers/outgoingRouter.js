const ticketEngine =
    require("../services/ticketEngine");

module.exports = async (msg) => {

    // Hanya proses pesan yang dikirim akun bot
    if (!msg.fromMe) {
        return;
    }

    // Ignore Status
    if (
        msg.from === "status@broadcast" ||
        msg.from.endsWith("@broadcast")
    ) {
        return;
    }

    // Ignore pesan kosong
    if (!msg.body?.trim()) {
        return;
    }

    const body =
        msg.body.trim().toLowerCase();

    // Command yang diizinkan
    const allowedCommands = [
        "done",
        "gl",
        "sw",
        "rp",
        "ka",
        "iw",
        "hl",
        "0",
        "1",
        "9"
    ];

    // Izinkan semua angka untuk pemilihan nomor ticket
    const isNumber =
        /^\d+$/.test(body);

    // Abaikan pesan selain command
    // dan pilihan nomor ticket
    if (
        !allowedCommands.includes(body) &&
        !isNumber
    ) {
        return;
    }

    try {

        await ticketEngine.handleOutgoing(msg);

    } catch (err) {

        console.error(
            "❌ OUTGOING ROUTER ERROR"
        );

        console.error(err);

    }

};