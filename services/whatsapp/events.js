const { parseMessage } = require("./parser");

function registerEvents(sock, incomingRouter, outgoingRouter) {

    sock.ev.on("messages.upsert", async ({ messages, type }) => {

        const raw = messages[0];

        if (!raw)
            return;

        if (raw.key.remoteJid === "status@broadcast")
            return;

        if (!raw.message)
            return;
        const msg = await parseMessage(sock, raw);

        if (msg.fromMe) {

            await outgoingRouter(msg);

        } else {

            await incomingRouter(msg);

        }

    });

}

module.exports = {
    registerEvents
};