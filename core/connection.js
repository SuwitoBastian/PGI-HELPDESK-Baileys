const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");

async function createConnection() {

    const { state, saveCreds } =
        await useMultiFileAuthState("./session");

    const { version } =
        await fetchLatestBaileysVersion();

    const sock = makeWASocket({

        version,

        auth: {

            creds: state.creds,

            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino({ level: "silent" })
            )

        },

        printQRInTerminal: true,

        logger: pino({
            level: "silent"
        })

    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {

        const {
            connection,
            lastDisconnect
        } = update;

        console.log(update);

        if (connection === "open") {

            console.log("🟢 Baileys Connected");

        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            console.log("🔴 Connection Closed");

            if (shouldReconnect) {

                createConnection();

            }

        }

    });

    return sock;

}

module.exports = createConnection;