const db = require("../database/database");

const dashboardLocationService =
    require("../services/dashboard/dashboardLocationService");

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

    const engineerNames =
        dashboardLocationService
            .getCurrentLocationNames(
                normalizedLocation
            );


    /*
    --------------------------------------------------------
    Tidak ada engineer aktif di lokasi tersebut.
    Jangan sampai fallback mengambil feedback lokasi lain.
    --------------------------------------------------------
    */

    if (
        engineerNames.length === 0
    ) {

        return [];

    }


    const placeholders =
        engineerNames
            .map(() => "?")
            .join(", ");


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

            AND t.pic IN (
                ${placeholders}
            )


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
            ...engineerNames,
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
       Filter Tanggal
    ====================================================== */

    if (startDate) {

        sql += `
            AND date(
                COALESCE(
                    f.feedback_at,
                    t.feedback_sent_at
                )
            ) >= date(?)
        `;

        params.push(startDate);
    }


    if (endDate) {

        sql += `
            AND date(
                COALESCE(
                    f.feedback_at,
                    t.feedback_sent_at
                )
            ) <= date(?)
        `;

        params.push(endDate);
    }


    /* ======================================================
       Filter Location
    ====================================================== */

    const normalizedLocation =
        normalizeLocation(location);


    if (normalizedLocation) {

        const engineerNames =
            dashboardLocationService
                .getCurrentLocationNames(
                    normalizedLocation
                );


        /*
         * Tidak ada engineer aktif di lokasi tersebut.
         * Supaya tidak salah menampilkan seluruh feedback,
         * langsung kembalikan hasil kosong.
         */

        if (engineerNames.length === 0) {

            return [];

        }


        const placeholders =
            engineerNames
                .map(() => "?")
                .join(", ");


        sql += `
            AND t.pic IN (${placeholders})
        `;


        params.push(
            ...engineerNames
        );

    }


    /* ======================================================
       Legacy Team Filter
       
       Hanya digunakan apabila LOCATION tidak diberikan.
       Jadi sistem lama tetap kompatibel.
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
       Search
    ====================================================== */

    if (keyword?.trim()) {

        const search =
            `%${keyword.trim()}%`;


        sql += `
            AND (
                t.id LIKE ?
                OR t.cabang LIKE ?
                OR IFNULL(f.issue_category, '') LIKE ?
                OR t.pic_selesai LIKE ?
                OR IFNULL(f.comment, '') LIKE ?
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
       Order
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
========================================================== */

function getStatistics(filters = {}) {

    const rows =
        findAll(filters);


    const totalLinkSent =
        rows.length;


    const totalFeedback =
        rows.filter(
            row =>
                row.feedback_status === "received"
        ).length;


    const waitingFeedback =
        totalLinkSent -
        totalFeedback;


    const responseRatings =
        rows
            .filter(
                row =>
                    row.response_rating != null
            )
            .map(
                row =>
                    Number(row.response_rating)
            );


    const solutionRatings =
        rows
            .filter(
                row =>
                    row.solution_rating != null
            )
            .map(
                row =>
                    Number(row.solution_rating)
            );


    const averageResponseRating =
        responseRatings.length
            ? (
                responseRatings.reduce(
                    (a, b) => a + b,
                    0
                ) /
                responseRatings.length
            ).toFixed(2)
            : 0;


    const averageSolutionRating =
        solutionRatings.length
            ? (
                solutionRatings.reduce(
                    (a, b) => a + b,
                    0
                ) /
                solutionRatings.length
            ).toFixed(2)
            : 0;


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