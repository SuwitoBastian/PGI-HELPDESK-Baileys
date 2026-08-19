const db = require('../database/database');
const { nowWIB } = require("../utils/dateTime");

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
            assignment_group,
            engineer_team
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        ticket.assignmentGroup,
        ticket.engineerTeam
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

/**
 * =====================================================
 * AUTO CLOSE PROCESS
 * Cari ticket PROCESS yang berasal dari tanggal sebelumnya
 * =====================================================
 */
function findProcessFromPreviousDate() {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE status = 'PROCESS'
        AND DATE(waktu) < DATE('now', 'localtime')
        AND pic IS NOT NULL
        AND TRIM(pic) <> ''
        ORDER BY waktu ASC
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
 * Statistik Engineer
 */
function countAssignedByPIC(
    pic,
    start = null,
    end = null,
    engineerTeam = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE pic = ?
    `;

    const params = [pic];

    if (start && end) {

        sql += `
            AND DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    return db.prepare(sql).get(...params).total;

}

function countCompletedByPIC(
    pic,
    start = null,
    end = null,
    engineerTeam = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE pic_selesai = ?
    `;

    const params = [pic];

    if (start && end) {

        sql += `
            AND DATE(selesai)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }

    if (engineerTeam) {

        sql += `
            AND pic_selesai_team = ?
        `;

        params.push(engineerTeam);

    }

    return db.prepare(sql).get(...params).total;

}

function countProcessByPIC(
    pic,
    start = null,
    end = null,
    engineerTeam = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
        AND pic = ?
    `;

    const params = [pic];

    if (start && end) {

        sql += `
            AND DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    return db.prepare(sql).get(...params).total;

}

function countAssignedByPICAndLocation(
    pic,
    start = null,
    end = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE pic = ?
    `;

    const params = [pic];


    if (start && end) {

        sql += `
            AND DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }


    if (location) {

        sql += `
            AND UPPER(TRIM(cabang)) = UPPER(TRIM(?))
        `;

        params.push(location);

    }


    return db
        .prepare(sql)
        .get(...params)
        .total;

}


function countCompletedByPICAndLocation(
    pic,
    start = null,
    end = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE pic_selesai = ?
    `;

    const params = [pic];


    if (start && end) {

        sql += `
            AND DATE(selesai)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }


    if (location) {

        sql += `
            AND UPPER(TRIM(cabang)) = UPPER(TRIM(?))
        `;

        params.push(location);

    }


    return db
        .prepare(sql)
        .get(...params)
        .total;

}


function countProcessByPICAndLocation(
    pic,
    start = null,
    end = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
        AND pic = ?
    `;

    const params = [pic];


    if (start && end) {

        sql += `
            AND DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }


    if (location) {

        sql += `
            AND UPPER(TRIM(cabang)) = UPPER(TRIM(?))
        `;

        params.push(location);

    }


    return db
        .prepare(sql)
        .get(...params)
        .total;

}

function findProcessNormalSLA() {

    return db.prepare(`
        SELECT *
        FROM tickets
        WHERE status = 'PROCESS'
        AND sla_status = 'NORMAL'
        AND assigned_at IS NOT NULL
        ORDER BY assigned_at ASC
    `).all();

}
function markSLAExpired(id) {

    db.prepare(`
        UPDATE tickets
        SET sla_status = 'EXPIRED'
        WHERE id = ?
    `).run(id);

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
 * Ticket CLOSED untuk perhitungan SLA Metrics
 */
function findClosedForSLA(
    start,
    end,
    engineerTeam = null
) {

    let sql = `
        SELECT
            id,
            waktu,
            assigned_at,
            selesai,
            sla_status,
            pic_selesai
        FROM tickets
        WHERE status = 'CLOSED'
    `;

    const params = [];

    if (start && end) {

        sql += `
            AND DATE(selesai)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }

    if (engineerTeam) {

        sql += `
            AND pic_selesai_team = ?
        `;

        params.push(engineerTeam);

    }

    sql += `
        ORDER BY selesai DESC
    `;

    return db.prepare(sql).all(...params);

}

/**
 * Assign PIC
 */
function assignPIC(id, pic, picTeam) {

    db.prepare(`
        UPDATE tickets
        SET
            pic = ?,
            engineer_team = ?,
            pic_team = ?,
            status = 'PROCESS',
            waiting_pic = 0,
            assigned_at = ?
        WHERE id = ?
    `).run(
        pic,
        picTeam,
        picTeam,
        nowWIB(),
        id
    );

}

/**
 * Tutup tiket
 */
function closeTicket(
    id,
    selesai,
    durasi,
    picSelesai,
    picSelesaiTeam
) {

    db.prepare(`
        UPDATE tickets
        SET
            status = 'CLOSED',
            selesai = ?,
            durasi = ?,
            pic_selesai = ?,
            pic_selesai_team = ?
        WHERE id = ?
    `).run(
        selesai,
        durasi,
        picSelesai,
        picSelesaiTeam,
        id
    );

}

/**
 * =====================================================
 * AUTO CLOSE PROCESS
 * Menutup ticket PROCESS dari tanggal sebelumnya
 * PIC tetap PIC yang melakukan assignment
 * =====================================================
 */
function autoCloseProcess(
    id,
    selesai,
    durasi,
    picSelesai,
    picSelesaiTeam
) {

    db.prepare(`
        UPDATE tickets
        SET
            status = 'CLOSED',
            selesai = ?,
            durasi = ?,
            pic_selesai = ?,
            pic_selesai_team = ?,
            close_type = 'AUTO_CLOSE'
        WHERE id = ?
        AND status = 'PROCESS'
    `).run(
        selesai,
        durasi,
        picSelesai,
        picSelesaiTeam,
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
function addLocationFilter(sql, params, location) {

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return sql;
}

function findAll(
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT *
        FROM tickets
    `;

    const params = [];

    const conditions = [];

    if (engineerTeam) {

        conditions.push(`
            pic_team = ?
        `);

        params.push(engineerTeam);

    }

    if (location) {

        conditions.push(`
            UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `);

        params.push(location);

    }

    if (conditions.length) {

        sql += `
            WHERE
                ${conditions.join(" AND ")}
        `;

    }

    sql += `
        ORDER BY waktu DESC
    `;

    return db
        .prepare(sql)
        .all(...params);

}

function findAllByDate(
    start,
    end,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT *
        FROM tickets
        WHERE DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    sql += `
        ORDER BY waktu DESC
    `;

    return db
        .prepare(sql)
        .all(...params);

}

/**
 * Total Ticket
 */
function countTotal(
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
    `;

    const params = [];

    const conditions = [];

    if (engineerTeam) {

        conditions.push(`
            pic_team = ?
        `);

        params.push(engineerTeam);

    }

    if (location) {

        conditions.push(`
            UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `);

        params.push(location);

    }

    if (conditions.length) {

        sql += `
            WHERE
                ${conditions.join(" AND ")}
        `;

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

function countTotalByDate(
    start,
    end,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

/**
 * Jumlah OPEN
 */
function countOpen(
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'OPEN'
    `;

    const params = [];

    if (engineerTeam) {

        sql += `
            AND engineer_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

function countOpenByDate(
    start,
    end,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'OPEN'
        AND DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND engineer_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

function countProcessByDate(
    start,
    end,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
        AND DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

function countClosedByDate(
    start,
    end,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'CLOSED'
        AND DATE(selesai)
            BETWEEN DATE(?)
            AND DATE(?)
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND pic_selesai_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

/**
 * Jumlah AUTO RESOLVED
 * Ticket CLOSED oleh SYSTEM / AUTO
 */
function countAutoResolved(
    start = null,
    end = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'CLOSED'
        AND pic_selesai = 'SYSTEM'
        AND pic_selesai_team = 'AUTO'
    `;

    const params = [];

    if (start && end) {

        sql += `
            AND DATE(selesai)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

function countBranchHandled(
    engineerTeam = null,
    start = null,
    end = null
) {

    let sql = `
        SELECT COUNT(DISTINCT cabang) total
        FROM tickets
        WHERE status = 'CLOSED'
    `;

    const params = [];

    if (start && end) {

        sql += `
            AND DATE(selesai)
            BETWEEN DATE(?)
            AND DATE(?)
        `;

        params.push(
            start,
            end
        );

    }

    if (engineerTeam) {

        sql += `
            AND pic_selesai_team = ?
        `;

        params.push(engineerTeam);

    }

    return db.prepare(sql).get(...params).total;

}

function topCabangByDate(
    start,
    end,
    limit = 10,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT
            cabang AS name,
            COUNT(*) AS total
        FROM tickets
        WHERE DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
        AND cabang IS NOT NULL
        AND cabang <> ''
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    sql += `
        GROUP BY cabang
        ORDER BY total DESC, cabang ASC
        LIMIT ?
    `;

    params.push(limit);

    return db
        .prepare(sql)
        .all(...params);

}

function topPICByDate(
    start,
    end,
    limit = 6,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT
            pic,
            COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
        AND pic IS NOT NULL
        AND pic <> ''
        AND DATE(waktu)
            BETWEEN DATE(?)
            AND DATE(?)
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    sql += `
        GROUP BY pic
        ORDER BY total DESC, pic ASC
        LIMIT ?
    `;

    params.push(limit);

    return db
        .prepare(sql)
        .all(...params);

}

/**
 * Jumlah PROCESS
 */
function countProcess(
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
    `;

    const params = [];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

/**
 * Jumlah CLOSED
 */
function countClosed(
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'CLOSED'
    `;

    const params = [];

    if (engineerTeam) {

        sql += `
            AND pic_selesai_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

/**
 * Jumlah ticket hari ini
 */
function countToday(
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE DATE(waktu)
            = DATE('now', 'localtime')
    `;

    const params = [];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

/**
 * Top Cabang
 */
function topCabang(
    limit = 10,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT
            cabang AS name,
            COUNT(*) AS total
        FROM tickets
        WHERE cabang IS NOT NULL
        AND cabang <> ''
    `;

    const params = [];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    sql += `
        GROUP BY cabang
        ORDER BY total DESC, cabang ASC
        LIMIT ?
    `;

    params.push(limit);

    return db
        .prepare(sql)
        .all(...params);

}

/**
 * Top PIC Assignment
 */
/**
 * Top PIC Assignment
 */
function topPIC(
    limit = 6,
    engineerTeam = null,
    location = null
) {

    let sql = `
        SELECT
            pic,
            COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
        AND pic IS NOT NULL
        AND pic <> ''
    `;

    const params = [];

    if (engineerTeam) {

        sql += `
            AND pic_team = ?
        `;

        params.push(engineerTeam);

    }

    if (location) {

        sql += `
            AND UPPER(TRIM(cabang))
                = UPPER(TRIM(?))
        `;

        params.push(location);

    }

    sql += `
        GROUP BY pic
        ORDER BY total DESC, pic ASC
        LIMIT ?
    `;

    params.push(limit);

    return db
        .prepare(sql)
        .all(...params);

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

/**
 * Feedback Google Form
 */
function markFeedbackSent(ticketId) {

    db.prepare(`
        UPDATE tickets
        SET
            feedback_sent = 1,
            feedback_sent_at = ?
        WHERE id = ?
    `).run(

        nowWIB(),

        ticketId

    );

}

function topPICSelesaiByDate(
    start,
    end,
    limit = 6,
    engineerTeam = null
) {

    let sql = `
        SELECT
            pic_selesai,
            COUNT(*) total
        FROM tickets
        WHERE
            status = 'CLOSED'
            AND pic_selesai IS NOT NULL
            AND pic_selesai <> ''
            AND DATE(selesai)
                BETWEEN DATE(?)
                AND DATE(?)
    `;

    const params = [
        start,
        end
    ];

    if (engineerTeam) {

        sql += `
            AND pic_selesai_team = ?
        `;

        params.push(engineerTeam);

    }

    sql += `
        GROUP BY pic_selesai
        ORDER BY total DESC, pic_selesai ASC
        LIMIT ?
    `;

    params.push(limit);

    return db.prepare(sql).all(...params);

}

function topPICSelesai(
    limit = 6,
    engineerTeam = null
) {

    let sql = `
        SELECT
            pic_selesai,
            COUNT(*) total
        FROM tickets
        WHERE
            status = 'CLOSED'
            AND pic_selesai IS NOT NULL
            AND pic_selesai <> ''
    `;

    const params = [];

    if (engineerTeam) {

        sql += `
            AND pic_selesai_team = ?
        `;

        params.push(engineerTeam);

    }

    sql += `
        GROUP BY pic_selesai
        ORDER BY total DESC, pic_selesai ASC
        LIMIT ?
    `;

    params.push(limit);

    return db.prepare(sql).all(...params);

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

    markFeedbackSent,

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

    countAutoResolved,

    topCabangByDate,

    topPICByDate,

    listPICs,

    findProcessNormalSLA,

    findClosedForSLA,

    markSLAExpired,

    countAssignedByPIC,

    countCompletedByPIC,

    countProcessByPIC,

    countTotal,

    countTotalByDate,

    countBranchHandled,

    countAssignedByPICAndLocation,

    countCompletedByPICAndLocation,

    countProcessByPICAndLocation,

    findProcessFromPreviousDate,

    autoCloseProcess

};