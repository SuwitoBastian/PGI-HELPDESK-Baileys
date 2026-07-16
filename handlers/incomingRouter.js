const ticketEngine =
    require("../services/ticketEngine");

const allowedGroups =
    require("../config/groups");

module.exports = async (msg) => {

    // ========================
    // Ignore WhatsApp Status
    // ========================
    if (
        msg.from === "status@broadcast" ||
        msg.from.endsWith("@broadcast")
    ) {
        return;
    }

    // ========================
    // Ignore pesan bot sendiri
    // ========================
    if (msg.fromMe) {
        return;
    }

    // ========================
    // Ignore pesan kosong
    // ========================
    if (!msg.body?.trim()) {
        return;
    }

    // ========================
    // Ignore pesan lama
    // ========================
    const now =
        Math.floor(Date.now() / 1000);

    const selisih =
        now - msg.timestamp;

    if (selisih > 60) {

        console.log(
            `⏩ Skip pesan lama (${selisih} detik)`
        );

        return;

    }

    // ========================
    // Hanya grup Helpdesk
    // ========================
    if (msg.from.endsWith("@g.us")) {

        const daftarGrup =
            Object.values(allowedGroups);

        if (!daftarGrup.includes(msg.from)) {

            return;

        }

    }

    try {

        await ticketEngine.handleIncoming(msg);

    } catch (err) {

        console.error(
            "❌ INCOMING ROUTER ERROR"
        );

        console.error(err);

    }

};