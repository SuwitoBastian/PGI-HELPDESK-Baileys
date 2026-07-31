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
   Latest Feedback Activity (Pipeline)
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

function findLatest(limit = 5) {

    return latestStmt.all(limit);

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
   List Feedback (Pipeline)
========================================================== */

function findAll(filters = {}) {

    const {

        startDate = null,
        endDate = null,
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

    /* ==========================
       Filter Tanggal
    ========================== */

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

    /* ==========================
       Filter Team
    ========================== */

    if (
        team &&
        team !== "ALL"
    ) {

        sql += `
            AND t.pic_selesai_team = ?
        `;

        params.push(team);

    }

    /* ==========================
       Search
    ========================== */

    if (keyword?.trim()) {

        const search = `%${keyword.trim()}%`;

        sql += `
            AND (

                t.id LIKE ?

                OR t.cabang LIKE ?

                OR IFNULL(f.issue_category,'') LIKE ?

                OR t.pic_selesai LIKE ?

                OR IFNULL(f.comment,'') LIKE ?

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

    return db.prepare(sql).all(...params);

}

/* ==========================================================
   Statistics
========================================================== */

function getStatistics(filters = {}) {

    const rows = findAll(filters);

    const totalLinkSent = rows.length;

    const totalFeedback =
        rows.filter(r =>
            r.feedback_status === "received"
        ).length;

    const waitingFeedback =
        totalLinkSent - totalFeedback;

    const responseRatings =
        rows
            .filter(r => r.response_rating != null)
            .map(r => Number(r.response_rating));

    const solutionRatings =
        rows
            .filter(r => r.solution_rating != null)
            .map(r => Number(r.solution_rating));

    const averageResponseRating =
        responseRatings.length
            ? (
                responseRatings.reduce((a, b) => a + b, 0) /
                responseRatings.length
            ).toFixed(2)
            : 0;

    const averageSolutionRating =
        solutionRatings.length
            ? (
                solutionRatings.reduce((a, b) => a + b, 0) /
                solutionRatings.length
            ).toFixed(2)
            : 0;

    return {

        total_feedback: totalFeedback,

        total_link_sent: totalLinkSent,

        waiting_feedback: waitingFeedback,

        average_response_rating:
            Number(averageResponseRating),

        average_solution_rating:
            Number(averageSolutionRating)

    };

}

module.exports = {

    create,

    findLatest,

    findByTicket,

    findAll,

    getStatistics

};