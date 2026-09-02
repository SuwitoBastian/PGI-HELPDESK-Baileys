const db = require("../database/database");

/* ==========================================================
   Create Feedback
========================================================== */

const insert = db.prepare(`
    INSERT INTO feedback (
        ticket_id,
        branch,
        issue_category,
        engineer,
        response_rating,
        solution_rating,
        comment,
        feedback_at,
        source
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function create({
    ticketId = null,
    branch,
    issueCategory,
    engineer,
    responseRating,
    solutionRating,
    comment,
    feedbackAt,
    source = "GOOGLE_FORM"
}) {
    return insert.run(
        ticketId,
        branch,
        issueCategory,
        engineer,
        responseRating,
        solutionRating,
        comment,
        feedbackAt,
        source
    );
}


/* ==========================================================
   Latest Feedback Activity
========================================================== */

const latestStmt = db.prepare(`
    SELECT
        t.id AS ticket_id,
        t.cabang AS branch,
        f.issue_category AS issue_category,
        t.pic_selesai AS engineer,
        t.pic_selesai_team AS team,
        t.status,
        t.waktu,
        t.assigned_at,
        t.selesai,
        t.durasi,
        t.feedback_sent,
        t.feedback_sent_at,
        f.response_rating,
        f.solution_rating,
        f.comment,
        f.feedback_at,

        CASE
            WHEN f.id IS NULL
                THEN 'waiting'
            ELSE 'received'
        END AS feedback_status

    FROM tickets t

    LEFT JOIN feedback f
        ON f.ticket_id = t.id

    WHERE t.feedback_sent = 1

    ORDER BY datetime(
        COALESCE(
            f.feedback_at,
            t.feedback_sent_at,
            t.selesai,
            t.assigned_at,
            t.waktu
        )
    ) DESC

    LIMIT ?
`);

function findLatest(
    limit = 5,
    location = null
) {

    const normalizedLocation =
        normalizeLocation(location);


    /*
    ========================================================
    ALL LOCATION
    ========================================================
    */

    if (!normalizedLocation) {

        return latestStmt.all(
            limit
        );

    }


    /*
    ========================================================
    LOCATION MODE
    ========================================================
    */

    const sql = `

        SELECT

            t.id AS ticket_id,

            t.cabang AS branch,

            f.issue_category AS issue_category,

            t.pic_selesai AS engineer,

            t.pic_selesai_team AS team,

            t.status,

            t.waktu,

            t.assigned_at,

            t.selesai,

            t.durasi,

            t.feedback_sent,

            t.feedback_sent_at,

            f.response_rating,

            f.solution_rating,

            f.comment,

            f.feedback_at,

            CASE

                WHEN f.id IS NULL
                    THEN 'waiting'

                ELSE 'received'

            END AS feedback_status


        FROM tickets t


        LEFT JOIN feedback f

            ON f.ticket_id = t.id


        WHERE

            t.feedback_sent = 1

            AND COALESCE(t.location_selesai, t.location) = ?


        ORDER BY datetime(

            COALESCE(

                f.feedback_at,

                t.feedback_sent_at,

                t.selesai,

                t.assigned_at,

                t.waktu

            )

        ) DESC


        LIMIT ?

    `;


    return db
        .prepare(sql)
        .all(
            normalizedLocation,
            limit
        );

}


/* ==========================================================
   Ticket Feedback
========================================================== */

const ticketStmt = db.prepare(`
    SELECT *
    FROM feedback
    WHERE ticket_id = ?
    LIMIT 1
`);

function findByTicket(ticketId) {
    return ticketStmt.get(ticketId);
}


/* ==========================================================
   Normalize Location
========================================================== */

function normalizeLocation(location) {

    const value =
        String(location || "")
            .trim()
            .toUpperCase();

    if (
        value === "AKR" ||
        value === "HO-AKR" ||
        value === "HO_AKR"
    ) {
        return "AKR";
    }

    if (
        value === "HO" ||
        value === "HEAD_OFFICE"
    ) {
        return "HO";
    }

    return null;
}


/* ==========================================================
   List Feedback
   Location menjadi filter utama.
   Team tetap dipertahankan sebagai LEGACY fallback.
========================================================== */

function findAll(filters = {}) {

    const {
        startDate = null,
        endDate = null,
        location = null,
        team = "ALL",
        keyword = ""
    } = filters;


    /*
     * ==========================================================
     * PERIODE TICKET
     * ==========================================================
     *
     * Format ticket:
     *
     * 260831-XXXXXX
     *
     * 26 = tahun
     * 08 = bulan
     * 31 = tanggal
     *
     * Hasil:
     *
     * 2026-08-31
     *
     * Jika format ticket tidak valid,
     * periode menggunakan feedback_at.
     */

    const periodDateSql = `
        CASE

            WHEN
                t.id IS NOT NULL
                AND t.id GLOB '[0-9][0-9][0-9][0-9][0-9][0-9]-*'
                AND length(t.id) >= 7

            THEN
                '20'
                || substr(t.id, 1, 2)
                || '-'
                || substr(t.id, 3, 2)
                || '-'
                || substr(t.id, 5, 2)

            ELSE
                date(f.feedback_at)

        END
    `;


    let sql = `
        SELECT

            t.id AS ticket_id,

            t.cabang AS branch,

            f.issue_category AS issue_category,

            t.pic_selesai AS engineer,

            t.pic_selesai_team AS team,

            t.status,

            t.waktu,

            t.assigned_at,

            t.selesai,

            t.durasi,

            t.feedback_sent,

            t.feedback_sent_at,

            f.id,

            f.response_rating,

            f.solution_rating,

            f.comment,

            f.feedback_at,

            ${periodDateSql} AS period_date,


            CASE

                WHEN f.id IS NULL
                    THEN 'waiting'

                ELSE 'received'

            END AS feedback_status


        FROM tickets t


        LEFT JOIN feedback f

            ON f.ticket_id = t.id


        WHERE t.feedback_sent = 1
    `;


    const params = [];


    /* ======================================================
       FILTER TANGGAL
       ====================================================== */

    if (startDate) {

        sql += `
            AND date(
                ${periodDateSql}
            ) >= date(?)
        `;

        params.push(startDate);

    }


    if (endDate) {

        sql += `
            AND date(
                ${periodDateSql}
            ) <= date(?)
        `;

        params.push(endDate);

    }


    /* ======================================================
       FILTER LOCATION
       ====================================================== */

    const normalizedLocation =
        normalizeLocation(location);


    if (normalizedLocation) {

        sql += `
            AND COALESCE(t.location_selesai, t.location) = ?
        `;

        params.push(
            normalizedLocation
        );

    }


    /* ======================================================
       LEGACY TEAM FILTER
       
       Hanya digunakan apabila LOCATION
       tidak diberikan.
       ====================================================== */

    else if (
        team &&
        team !== "ALL"
    ) {

        sql += `
            AND t.pic_selesai_team = ?
        `;

        params.push(team);

    }


    /* ======================================================
       SEARCH
       ====================================================== */

    if (keyword?.trim()) {

        const search =
            `%${keyword.trim()}%`;


        sql += `
            AND (

                t.id LIKE ?

                OR t.cabang LIKE ?

                OR IFNULL(
                    f.issue_category,
                    ''
                ) LIKE ?

                OR t.pic_selesai LIKE ?

                OR IFNULL(
                    f.comment,
                    ''
                ) LIKE ?

            )
        `;


        params.push(

            search,

            search,

            search,

            search,

            search

        );

    }


    /* ======================================================
       ORDER
       ====================================================== */

    sql += `
        ORDER BY datetime(

            COALESCE(

                f.feedback_at,

                t.feedback_sent_at,

                t.selesai,

                t.assigned_at,

                t.waktu

            )

        ) DESC
    `;


    return db

        .prepare(sql)

        .all(...params);

}


/* ==========================================================
   Statistics
   ----------------------------------------------------------
   Customer Feedback Activity:
   - Jika tidak ada filter tanggal:
     otomatis menggunakan bulan berjalan
   - Jika ada filter tanggal:
     gunakan tanggal yang diberikan
   - Data lama tidak dihapus / diubah
   - Ticket periode lama dianggap EXPIRED secara logic
========================================================== */

function getStatistics(filters = {}) {

    const {
        startDate = null,
        endDate = null,
        location = null,
        team = "ALL",
        keyword = ""
    } = filters;


    /*
    ==========================================================
    PERIODE DEFAULT
    ==========================================================

    Kalau Activity tidak memberikan tanggal,
    otomatis gunakan:

    tanggal 1 bulan berjalan
            sampai
    hari ini
    */

    let effectiveStartDate =
        startDate;

    let effectiveEndDate =
        endDate;


    if (!effectiveStartDate && !effectiveEndDate) {

        const now =
            new Date();

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                now.getDate()
            ).padStart(2, "0");


        effectiveStartDate =
            `${year}-${month}-01`;

        effectiveEndDate =
            `${year}-${month}-${day}`;

    }


    /*
    ==========================================================
    AMBIL DATA
    ==========================================================
    */

    const rows =
        findAll({

            startDate:
                effectiveStartDate,

            endDate:
                effectiveEndDate,

            location,

            team,

            keyword

        });


    /*
    ==========================================================
    TOTAL LINK TERKIRIM
    ==========================================================
    */

    const totalLinkSent =
        rows.length;


    /*
    ==========================================================
    TOTAL FEEDBACK DITERIMA
    ==========================================================
    */

    const totalFeedback =
        rows.filter(
            row =>
                row.feedback_status ===
                "received"
        ).length;


    /*
    ==========================================================
    BELUM MENGISI
    ==========================================================
    */

    const waitingFeedback =
        rows.filter(
            row =>
                row.feedback_status ===
                "waiting"
        ).length;


    /*
    ==========================================================
    RESPONSE RATING
    ==========================================================
    */

    const responseRatings =
        rows
            .filter(
                row =>
                    row.response_rating != null
            )
            .map(
                row =>
                    Number(
                        row.response_rating
                    )
            );


    /*
    ==========================================================
    SOLUTION RATING
    ==========================================================
    */

    const solutionRatings =
        rows
            .filter(
                row =>
                    row.solution_rating != null
            )
            .map(
                row =>
                    Number(
                        row.solution_rating
                    )
            );


    /*
    ==========================================================
    AVERAGE RESPONSE
    ==========================================================
    */

    const averageResponseRating =
        responseRatings.length
            ? (
                responseRatings.reduce(
                    (a, b) =>
                        a + b,
                    0
                ) /
                responseRatings.length
            ).toFixed(2)
            : 0;


    /*
    ==========================================================
    AVERAGE SOLUTION
    ==========================================================
    */

    const averageSolutionRating =
        solutionRatings.length
            ? (
                solutionRatings.reduce(
                    (a, b) =>
                        a + b,
                    0
                ) /
                solutionRatings.length
            ).toFixed(2)
            : 0;


    /*
    ==========================================================
    RESULT
    ==========================================================
    */

    return {

        total_feedback:
            totalFeedback,

        total_link_sent:
            totalLinkSent,

        waiting_feedback:
            waitingFeedback,

        average_response_rating:
            Number(
                averageResponseRating
            ),

        average_solution_rating:
            Number(
                averageSolutionRating
            )

    };

}


/* ==========================================================
   Export
========================================================== */

module.exports = {

    create,

    findLatest,

    findByTicket,

    findAll,

    getStatistics

};