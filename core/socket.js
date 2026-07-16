let sock = null;

function setSocket(instance) {
    sock = instance;
}

function getSocket() {
    return sock;
}

module.exports = {
    setSocket,
    getSocket
};