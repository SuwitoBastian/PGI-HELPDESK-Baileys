const { getSocket } = require("./whatsapp/socket");

async function sendMessage(jid, text) {

    const sock = getSocket();

    if (!sock) {

        throw new Error("WhatsApp belum terkoneksi");

    }

    return await sock.sendMessage(

        jid,

        {
            text
        }

    );

}

module.exports = {

    sendMessage

};