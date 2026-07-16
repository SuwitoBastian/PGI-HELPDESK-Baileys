const Message =
    require("./message");

async function parseMessage(sock, raw) {

    return new Message(raw);

}

module.exports = {

    parseMessage

};