const db =
    require("../database/database");

/* ==========================================================
   Helper
   ========================================================== */

function buildInClause(values) {

    if (!Array.isArray(values) || values.length === 0) {

        return {
            clause: "1 = 0",
            params: []
        };

    }

    return {
        clause: values
            .map(() => "?")
            .join(", "),
        params: values
    };

}

/* ==========================================================
   Dashboard Location - PROCESS
   ========================================================== */

function countProcessByEngineers(
    engineerNames = [],
    start = null,
    end = null
) {

    const inClause =
        buildInClause(engineerNames);

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
        AND pic IN (${inClause.clause})
    `;

    const params = [
        ...inClause.params
    ];

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

    return db
        .prepare(sql)
        .get(...params)
        .total;

}

/* ==========================================================
   Dashboard Location - CLOSED
   ========================================================== */

function countClosedByEngineers(
    engineerNames = [],
    start = null,
    end = null
) {

    const inClause =
        buildInClause(engineerNames);

    let sql = `
        SELECT COUNT(*) total
        FROM tickets
        WHERE status = 'CLOSED'
        AND pic IN (${inClause.clause})
    `;

    const params = [
        ...inClause.params
    ];

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

/* ==========================================================
   Dashboard Location - TOTAL HANDLED
   PROCESS + CLOSED
   ========================================================== */

function countTotalByEngineers(
    engineerNames = [],
    start = null,
    end = null
) {

    return (
        countProcessByEngineers(
            engineerNames,
            start,
            end
        ) +

        countClosedByEngineers(
            engineerNames,
            start,
            end
        )
    );

}

/* ==========================================================
   Dashboard Location - TICKET LIST
   ========================================================== */

function findTicketsByEngineers(
    engineerNames = [],
    start = null,
    end = null
) {

    const inClause =
        buildInClause(engineerNames);

    let sql = `
        SELECT *
        FROM tickets
        WHERE pic IN (${inClause.clause})
    `;

    const params = [
        ...inClause.params
    ];

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

    sql += `
        ORDER BY waktu DESC
    `;

    return db
        .prepare(sql)
        .all(...params);

}

/* ==========================================================
   Top PIC PROCESS
   ========================================================== */

function topPICByEngineers(
    engineerNames = [],
    start = null,
    end = null,
    limit = 6
) {

    const inClause =
        buildInClause(engineerNames);

    let sql = `
        SELECT
            pic,
            COUNT(*) total
        FROM tickets
        WHERE status = 'PROCESS'
        AND pic IN (${inClause.clause})
    `;

    const params = [
        ...inClause.params
    ];

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

/* ==========================================================
   Top PIC CLOSED
   ========================================================== */

function topPICSelesaiByEngineers(
    engineerNames = [],
    start = null,
    end = null,
    limit = 6
) {

    const inClause =
        buildInClause(engineerNames);

    let sql = `
        SELECT
            pic_selesai,
            COUNT(*) total
        FROM tickets
        WHERE status = 'CLOSED'
        AND pic IN (${inClause.clause})
    `;

    const params = [
        ...inClause.params
    ];

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

    sql += `
        GROUP BY pic_selesai
        ORDER BY total DESC, pic_selesai ASC
        LIMIT ?
    `;

    params.push(limit);

    return db
        .prepare(sql)
        .all(...params);

}

/* ==========================================================
   Top Cabang
   ========================================================== */

function topCabangByEngineers(
    engineerNames = [],
    start = null,
    end = null,
    limit = 10
) {

    const inClause =
        buildInClause(engineerNames);

    let sql = `
        SELECT
            cabang AS name,
            COUNT(*) total
        FROM tickets
        WHERE pic IN (${inClause.clause})
        AND cabang IS NOT NULL
        AND cabang <> ''
    `;

    const params = [
        ...inClause.params
    ];

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

/* ==========================================================
   Export
   ========================================================== */

module.exports = {

    countProcessByEngineers,

    countClosedByEngineers,

    countTotalByEngineers,

    findTicketsByEngineers,

    topPICByEngineers,

    topPICSelesaiByEngineers,

    topCabangByEngineers

};