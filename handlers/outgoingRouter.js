const ticketEngine =
    require("../services/ticketEngine");

const engineerService =
    require("../services/engineerService");

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

    // ======================
    // Dynamic Engineer Commands
    // ======================

    const engineerCodes =
        engineerService
            .getAll()
            .map(engineer =>
                engineer.code.toLowerCase()
            );

    const allowedCommands = [

        "done",

        "0",

        "1",

        "9",

        ...engineerCodes

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