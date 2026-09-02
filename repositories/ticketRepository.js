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
function assignPIC(
    id,
    pic,
    picTeam,
    location
) {

    db.prepare(`
        UPDATE tickets
        SET
            pic = ?,
            engineer_team = ?,
            pic_team = ?,
            location = ?,
            status = 'PROCESS',
            waiting_pic = 0,
            assigned_at = ?
        WHERE id = ?
    `).run(
        pic,
        picTeam,
        picTeam,
        location,
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
    picSelesaiTeam,
    locationSelesai
) {

    db.prepare(`
        UPDATE tickets
        SET
            status = 'CLOSED',
            selesai = ?,
            durasi = ?,
            pic_selesai = ?,
            pic_selesai_team = ?,
            location_selesai = ?
        WHERE id = ?
    `).run(
        selesai,
        durasi,
        picSelesai,
        picSelesaiTeam,
        locationSelesai,
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
        AND DATE(datetime(waktu, '+7 hours'))
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
        AND DATE(datetime(waktu, '+7 hours'))
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
        AND DATE(datetime(waktu, '+7 hours'))
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
 * ==========================================================
 * Feedback Reminder
 * ==========================================================
 *
 * Ambil customer/pelapor yang memiliki ticket
 * pending Customer Feedback pada bulan berjalan.
 *
 * 1 customer = 1 reminder
 *
 * Setiap reminder dapat berisi beberapa ticket.
 *
 * Production:
 *     findFeedbackReminderTickets(5)
 *
 * Testing:
 *     findFeedbackReminderTickets(5, "2026-09-01")
 *
 * Limit = jumlah customer/pelapor per batch,
 * BUKAN jumlah ticket.
 */
function findFeedbackReminderTickets(
    limit = 10,
    referenceDate = null
) {

    /*
     * Reference date:
     * - Production  : tanggal sekarang
     * - Testing     : bisa kirim tanggal manual
     */
    const dateReference =
        referenceDate ||
        new Date().toISOString();

    /*
     * Ambil YYYY-MM dari tanggal referensi.
     * Reminder hanya berlaku untuk bulan berjalan.
     */
    const yearMonth =
        dateReference.substring(0, 7);

    /*
     * Ambil ticket yang:
     *
     * 1. feedback sudah pernah dikirim
     * 2. ticket berada di bulan berjalan
     * 3. belum ada feedback dari customer
     * 4. reminder belum mencapai 3x
     * 5. belum pernah reminder ATAU
     *    reminder terakhir sudah >= 24 jam
     * 6. memiliki chatId
     */
    const tickets = db.prepare(`
        SELECT
            t.id,
            t.nama,
            t.nomor,
            t.chatId,
            t.cabang,
            t.kendala,
            t.waktu,
            t.selesai,
            t.pic,
            t.pic_selesai,
            t.feedback_sent,
            t.feedback_sent_at,
            t.feedback_reminder_sent_at,
            t.feedback_reminder_count,
            t.location,
            t.location_selesai

        FROM tickets t

        LEFT JOIN feedback f
            ON f.ticket_id = t.id

        WHERE

            /* Feedback sudah pernah dikirim */
            t.feedback_sent = 1

            /* Hanya ticket bulan berjalan */
            AND strftime(
                '%Y-%m',
                t.waktu
            ) = ?

            /* Customer belum mengisi feedback */
            AND f.id IS NULL

            /* Maksimal 3 reminder */
            AND COALESCE(
                t.feedback_reminder_count,
                0
            ) < 3

            /*
             * Belum pernah reminder
             * ATAU sudah lewat 24 jam
             */
            AND (
                t.feedback_reminder_sent_at IS NULL

                OR datetime(
                    t.feedback_reminder_sent_at,
                    '+24 hours'
                ) <= datetime('now', 'localtime')
            )

            /* Chat WhatsApp harus tersedia */
            AND t.chatId IS NOT NULL
            AND TRIM(t.chatId) <> ''

        ORDER BY
            CASE
                WHEN t.feedback_reminder_sent_at IS NULL
                THEN 0
                ELSE 1
            END,
            t.feedback_reminder_sent_at ASC,
            t.waktu ASC
    `).all(
        yearMonth
    );

    /*
     * Kelompokkan ticket berdasarkan chatId.
     *
     * 1 chatId = 1 customer.
     *
     * Kalau satu customer punya beberapa ticket,
     * semua ticket pending feedback-nya digabung
     * menjadi satu reminder.
     */
    const grouped = new Map();

    for (const ticket of tickets) {

        const chatId =
            String(ticket.chatId).trim();

        if (!grouped.has(chatId)) {

            grouped.set(
                chatId,
                {
                    chatId,

                    nama:
                        ticket.nama ||
                        "Bapak/Ibu",

                    nomor:
                        ticket.nomor ||
                        "",

                    tickets: []
                }
            );

        }

        grouped
            .get(chatId)
            .tickets
            .push(ticket);

    }

    /*
     * Ambil maksimal sejumlah customer
     * sesuai limit batch.
     *
     * Default:
     * 10 customer per klik.
     */
    return Array
        .from(grouped.values())
        .slice(0, limit)
        .map(customer => ({

            chatId:
                customer.chatId,

            nama:
                customer.nama,

            nomor:
                customer.nomor,

            ticketCount:
                customer.tickets.length,

            tickets:
                customer.tickets

        }));

}

/**
 * Tandai reminder customer sudah berhasil dikirim.
 *
 * Reminder dihitung berdasarkan chatId/customer,
 * bukan berdasarkan masing-masing ticket.
 *
 * Semua ticket customer pada bulan berjalan
 * disinkronkan dengan count dan timestamp yang sama.
 */
function markFeedbackReminderSent(
    ticketId
) {

    const ticket =
        db.prepare(`
            SELECT
                chatId
            FROM tickets
            WHERE id = ?
        `).get(ticketId);


    if (
        !ticket ||
        !ticket.chatId ||
        !String(ticket.chatId).trim()
    ) {

        return;

    }


    const chatId =
        String(ticket.chatId).trim();

    const now =
        nowWIB();


    /*
     * Ambil count reminder customer saat ini.
     *
     * Gunakan count terbesar dari seluruh
     * ticket customer pada bulan berjalan.
     */
    const current =
        db.prepare(`
            SELECT
                MAX(
                    COALESCE(
                        feedback_reminder_count,
                        0
                    )
                ) AS reminder_count
            FROM tickets
            WHERE
                chatId = ?
                AND strftime(
                    '%Y-%m',
                    waktu
                ) = strftime(
                    '%Y-%m',
                    ?
                )
        `).get(
            chatId,
            now
        );


    const nextCount =
        Math.min(
            3,
            Number(
                current?.reminder_count || 0
            ) + 1
        );


    /*
     * Sinkronkan seluruh ticket customer
     * pada bulan berjalan.
     */
    db.prepare(`
        UPDATE tickets
        SET
            feedback_reminder_sent_at = ?,
            feedback_reminder_count = ?
        WHERE
            chatId = ?
            AND strftime(
                '%Y-%m',
                waktu
            ) = strftime(
                '%Y-%m',
                ?
            )
    `).run(
        now,
        nextCount,
        chatId,
        now
    );

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

    autoCloseProcess,

    findFeedbackReminderTickets,

    markFeedbackReminderSent


};