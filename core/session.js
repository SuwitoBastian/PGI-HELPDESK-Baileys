const {
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");

async function loadSession() {

    return await useMultiFileAuthState("./session");

}

module.exports = {
    loadSession
};