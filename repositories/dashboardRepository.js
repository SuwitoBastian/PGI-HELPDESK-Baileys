const db = require("../config/database"); // SESUAIKAN DENGAN PROJECT KAMU

function getAllTickets() {

    return db.prepare(`
        SELECT *
        FROM tickets
        ORDER BY waktu DESC
    `).all();

}

function getOpenCount() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE status='OPEN'
    `).get().total;

}

function getProcessCount() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE status='PROCESS'
    `).get().total;

}

function getClosedCount() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE status='CLOSED'
    `).get().total;

}

function getTodayCount() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE DATE(waktu)=DATE('now','localtime')
    `).get().total;

}

function getTopCabang(limit = 5) {

    return db.prepare(`
        SELECT
            cabang,
            COUNT(*) total
        FROM tickets
        GROUP BY cabang
        ORDER BY total DESC
        LIMIT ?
    `).all(limit);

}

function getTopPIC(limit = 5) {

    return db.prepare(`
        SELECT
            pic,
            COUNT(*) total
        FROM tickets
        WHERE pic IS NOT NULL
        GROUP BY pic
        ORDER BY total DESC
        LIMIT ?
    `).all(limit);

}

module.exports = {

    getAllTickets,

    getOpenCount,

    getProcessCount,

    getClosedCount,

    getTodayCount,

    getTopCabang,

    getTopPIC

};