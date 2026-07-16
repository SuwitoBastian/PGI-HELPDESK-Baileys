const db = require('../database/database');

function buildDateClause(start, end) {

    if (!start || !end) {

        return {
            where: "",
            params: []
        };

    }

    return {

        where: `
            WHERE DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
        `,

        params: [

            start,

            end

        ]

    };

}

/**
 * Membuat tiket baru
 */
function create(ticket) {

    db.prepare(`
        INSERT INTO tickets (
            id,
            nama,
            nomor,
            chatId,
            cabang,
            kendala,
            waktu,
            selesai,
            durasi,
            status,
            pic,
            waiting_pic,
            assignment_group
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        ticket.id,
        ticket.nama,
        ticket.nomor,
        ticket.chatId,
        ticket.cabang,
        ticket.kendala,
        ticket.waktu,
        null,
        null,
        'OPEN',
        null,
        1,
        ticket.assignmentGroup
    );

}

/**
 * Cari tiket berdasarkan ID
 */
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE id = ?
    `).get(id);

}
function findWaitingByChat(chatId) {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE chatId = ?
        AND status = 'OPEN'
        ORDER BY rowid DESC
        LIMIT 1
    `).get(chatId);

}
function findWaitingByNomor(nomor) {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE nomor = ?
        AND status = 'OPEN'
        ORDER BY rowid DESC
        LIMIT 1
    `).get(nomor);

}

/**
 * Tiket OPEN
 */
function findOpen() {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE status='OPEN'
        ORDER BY waktu DESC
    `).all();

}

/**
 * Tiket PROCESS
 */
function findProcess() {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE status='PROCESS'
        ORDER BY waktu DESC
    `).all();

}
function findProcessByPIC(pic) {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE status = 'PROCESS'
        AND pic = ?
        ORDER BY rowid DESC
    `).all(pic);

}

/**
 * Tiket CLOSED
 */
function findClosed() {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE status='CLOSED'
        ORDER BY selesai DESC
    `).all();

}

/**
 * Assign PIC
 */
function assignPIC(id, pic) {

    db.prepare(`
        UPDATE tickets
        SET
            pic = ?,
            status = 'PROCESS',
            waiting_pic = 0
        WHERE id = ?
    `).run(pic, id);

}

/**
 * Tutup tiket
 */
function closeTicket(id, selesai, durasi, picSelesai) {

    const result = db.prepare(`
        UPDATE tickets
        SET
            status='CLOSED',
            selesai=?,
            durasi=?,
            pic_selesai=?
        WHERE id=?
    `).run(
        selesai,
        durasi,
        picSelesai,
        id
    );

}

/**
 * Buka kembali tiket
 */
function reopen(id) {

    db.prepare(`
        UPDATE tickets
        SET
            status = 'PROCESS',
            selesai = NULL,
            durasi = NULL,
            pic_selesai = NULL
        WHERE id = ?
    `).run(id);

}

function updateState(id, state) {

    db.prepare(`
        UPDATE tickets
        SET status = ?
        WHERE id = ?
    `).run(state, id);

}

function findProcessByNomor(nomor){

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE nomor=?
        AND status='PROCESS'
        ORDER BY rowid DESC
        LIMIT 1
    `).get(nomor);

}

/**
 * Semua ticket
 */
function findAll() {

    return db.prepare(`
        SELECT *
        FROM tickets
        ORDER BY waktu DESC
    `).all();

}
function findAllByDate(start, end) {

    const {
        where,
        params
    } = buildDateClause(start, end);

    const rows = db.prepare(`
        SELECT *
        FROM tickets
        ${where}
        ORDER BY waktu DESC
    `).all(...params);

    return rows;
}

/**
 * Jumlah OPEN
 */
function countOpen() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE status='OPEN'
    `).get().total;

}

function countOpenByDate(start, end) {

    return db.prepare(`

        SELECT COUNT(*) total

        FROM tickets

        WHERE status='OPEN'

        AND DATE(waktu)
        BETWEEN DATE(?)
        AND DATE(?)

    `).get(

        start,

        end

    ).total;

}

function countProcessByDate(start, end) {

    return db.prepare(`

        SELECT COUNT(*) total

        FROM tickets

        WHERE status='PROCESS'

        AND DATE(waktu)
        BETWEEN DATE(?)
        AND DATE(?)

    `).get(

        start,

        end

    ).total;

}

function countClosedByDate(start, end) {

    return db.prepare(`

        SELECT COUNT(*) total

        FROM tickets

        WHERE status='CLOSED'

        AND DATE(waktu)
        BETWEEN DATE(?)
        AND DATE(?)

    `).get(

        start,

        end

    ).total;

}

function topCabangByDate(limit = 10, start, end){

    return db.prepare(`

        SELECT

            cabang,

            COUNT(*) total

        FROM tickets

        WHERE DATE(waktu)
        BETWEEN DATE(?)
        AND DATE(?)

        GROUP BY cabang

        ORDER BY total DESC

        LIMIT ?

    `).all(

        start,

        end,

        limit

    );

}

function topPICByDate(limit = 6, start, end) {

    return db.prepare(`

        SELECT

            pic,

            COUNT(*) total

        FROM tickets

        WHERE pic IS NOT NULL

        AND DATE(waktu)
        BETWEEN DATE(?)
        AND DATE(?)

        GROUP BY pic

        ORDER BY total DESC

        LIMIT ?

    `).all(

        start,

        end,

        limit

    );

}

/**
 * Jumlah PROCESS
 */
function countProcess() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE status='PROCESS'
    `).get().total;

}

/**
 * Jumlah CLOSED
 */
function countClosed() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE status='CLOSED'
    `).get().total;

}

/**
 * Jumlah ticket hari ini
 */
function countToday() {

    return db.prepare(`
        SELECT COUNT(*) total
        FROM tickets
        WHERE DATE(waktu)=DATE('now','localtime')
    `).get().total;

}

/**
 * Top Cabang
 */
function topCabang(limit = 10){

    return db.prepare(`
        SELECT
            cabang,
            COUNT(*) total
        FROM tickets
        GROUP BY cabang
        ORDER BY total DESC, cabang ASC
        LIMIT ?
    `).all(limit);

}

/**
 * Top PIC Assignment
 */
function topPIC(limit = 6){

    return db.prepare(`
        SELECT
            pic,
            COUNT(*) total
        FROM tickets
        WHERE pic IS NOT NULL
        GROUP BY pic
        ORDER BY total DESC, pic ASC
        LIMIT ?
    `).all(limit);

}

/**
 * Daftar nama PIC yang sudah pernah dipakai (untuk dropdown assign).
 */
function listPICs(){

    return db.prepare(`
        SELECT DISTINCT pic
        FROM tickets
        WHERE pic IS NOT NULL AND TRIM(pic) <> ''
        ORDER BY pic ASC
    `).all().map(r => r.pic);

}

function findOpenReminderTickets() {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE status = 'OPEN'
        AND open_reminder_sent = 0
    `).all();

}

function markOpenReminderSent(ticketIds) 
{
    const stmt = db.prepare(`
        UPDATE tickets
        SET open_reminder_sent = 1
        WHERE id = ?
    `);

    const transaction = db.transaction((ids) => {

        for (const id of ids) {

            stmt.run(id);

        }

    });

    transaction(ticketIds);

}

function topPICSelesaiByDate(limit = 6, start, end) {

    return db.prepare(`
        SELECT
            pic_selesai,
            COUNT(*) total
        FROM tickets
        WHERE pic_selesai IS NOT NULL
        AND DATE(waktu)
        BETWEEN DATE(?)
        AND DATE(?)
        GROUP BY pic_selesai
        ORDER BY total DESC
        LIMIT ?
    `).all(
        start,
        end,
        limit
    );

}

function topPICSelesai(limit = 6) {

    return db.prepare(`
        SELECT
            pic_selesai,
            COUNT(*) total
        FROM tickets
        WHERE pic_selesai IS NOT NULL
        GROUP BY pic_selesai
        ORDER BY total DESC
        LIMIT ?
    `).all(limit);

}

module.exports = {

    create,

    findById,

    findWaitingByChat,

    findOpen,

    findWaitingByNomor,

    findProcess,

    findProcessByPIC,

    findProcessByNomor,

    findClosed,

    assignPIC,

    closeTicket,

    reopen,

    updateState,

    findOpenReminderTickets,

    markOpenReminderSent,

    // Dashboard
    findAll,

    countOpen,

    countProcess,

    countClosed,

    countToday,

    topCabang,

    topPIC,

    topPICSelesai,

    topPICSelesaiByDate,

    findAllByDate,

    countOpenByDate,

    countProcessByDate,

    countClosedByDate,

    topCabangByDate,

    topPICByDate,

    listPICs

};