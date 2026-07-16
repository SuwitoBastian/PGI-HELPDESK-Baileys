const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode-terminal");
const incomingRouter =
    require("../../handlers/incomingRouter");

const outgoingRouter =
    require("../../handlers/outgoingRouter");
const appStartup =
    require("../../appStartup");

const { loadSession } = require("./session");
const { setSocket } = require("./socket");
const { registerEvents } = require("./events");

async function connect() {

    const { state, saveCreds } =
        await loadSession();

    const { version } =
        await fetchLatestBaileysVersion();

    console.log("");
    console.log("================================");
    console.log("Starting Baileys...");
    console.log("================================");

    const sock = makeWASocket({

        version,

        auth: {

            creds: state.creds,

            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino({ level: "silent" })
            )

        },

        logger: pino({
            level: "silent"
        }),

        browser: [
            "PGI Helpdesk",
            "Chrome",
            "1.0.0"
        ]

    });
    setSocket(sock);

    registerEvents(
        sock,
        incomingRouter,
        outgoingRouter
    );

    sock.ev.on(
        "creds.update",
        saveCreds
    );

sock.ev.on(
    "connection.update",
    (update) => {

        const {
            connection,
            lastDisconnect,
            qr
        } = update;

        // Tampilkan QR
        if (qr) {

            console.clear();

            console.log("");
            console.log("================================");
            console.log("SCAN QR WHATSAPP");
            console.log("================================");

            qrcode.generate(qr, {
                small: true
            });

        }

        if (connection === "connecting") {

            console.log("🟡 Connecting...");

        }

        if (connection === "open") {

            console.log("");
            console.log("================================");
            console.log("🟢 BAILEYS CONNECTED");
            console.log("================================");

            appStartup.start();

        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            console.log("🔴 Connection Closed");

            if (shouldReconnect) {

                console.log("♻️ Reconnecting...");

                setTimeout(() => {

    connect();

}, 3000);

            } else {

                console.log("❌ Session Logout");

            }

        }

    }
);

    return sock;

}

module.exports = {
    connect
};