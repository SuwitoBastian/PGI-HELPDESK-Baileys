const { getSocket } = require("./socket");

class Message {

    constructor(raw) {

        this.raw = raw;

        this.sock = getSocket();

        this.id = raw.key.id;

        this.from = raw.key.remoteJid;

        this.to = raw.key.remoteJid;

        this.fromMe = raw.key.fromMe;

        this.timestamp =
            Number(raw.messageTimestamp);

        this.body =
            this.#extractBody(raw);

        this.pushName =
            raw.pushName || null;

        this.chatId = raw.key.remoteJid;

        //console.log("\n========== CHAT DEBUG ==========");
//console.log("Push Name  :", this.pushName);
//console.log("Chat ID    :", this.chatId);
//console.log("Participant:", this.participant);
//console.log("Body       :", this.body);
//console.log("================================\n");

        this.participant =
            raw.key.participant || raw.key.remoteJid;

        this.participantAlt =
            raw.key.participantAlt || null;

        this.remoteJidAlt =
            raw.key.remoteJidAlt || null;

        this.addressingMode =
            raw.key.addressingMode || null;
                // DEBUG

        this.isGroup =
            this.from.endsWith("@g.us");

    }

    #extractBody(raw) {

        const msg = raw.message;

        if (!msg)
            return "";

        return (
            msg.conversation ||
            msg.extendedTextMessage?.text ||
            msg.imageMessage?.caption ||
            msg.videoMessage?.caption ||
            ""
        );

    }

    // ==========================
    // TAMBAHKAN DI SINI
    // ==========================
async reply(text) {

    return await this.sock.sendMessage(
        this.from,
        {
            text
        },
        {
            quoted: this.raw
        }
    );

}
async react(emoji) {

    if (!this.raw?.key)
        return;

    try {

        return await this.sock.sendMessage(
            this.from,
            {
                react: {
                    text: emoji,
                    key: this.raw.key
                }
            }
        );

    } catch (err) {

        console.error("❌ React Error:", err.message);

    }

}
async getContact() {

    let realJid;

    if (this.participantAlt) {

        realJid = this.participantAlt;

    } else if (this.remoteJidAlt) {

        realJid = this.remoteJidAlt;

    } else {

        realJid = this.participant;

    }

    const jid =
        realJid.split("@")[0];

    return {

        id: {
            user: jid,
            _serialized: realJid
        },

        number: jid,

        pushname: this.pushName || jid,

        name: this.pushName || jid,

        isBusiness: false

    };

}

async getChat() {

    const message = this;

    return {

        id: this.chatId,

        isGroup: this.isGroup,

        async getContact() {

            return await message.getContact();

        }

    };

}

}

module.exports = Message;