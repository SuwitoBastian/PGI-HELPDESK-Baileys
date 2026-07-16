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

    // Hanya command yang boleh diproses
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

    // Abaikan semua pesan yang dikirim bot sendiri
    // selain command di atas
    if (!allowedCommands.includes(body)) {
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