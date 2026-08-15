const db =
    require("../../database/database");

const dashboardLocationService =
    require("../dashboard/dashboardLocationService");


/* ==========================================================
   Date Helper
========================================================== */

function formatDate(date) {

    return date
        .toISOString()
        .slice(0, 10);

}


function formatDisplayDate(dateString) {

    if (!dateString) {

        return "-";

    }


    return new Date(dateString)
        .toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "short"
            }
        );

}


/* ==========================================================
   Get Engineer Names By Location
========================================================== */

function getLocationEngineerNames(location) {

    if (
        !location ||
        location === "ALL"
    ) {

        return null;

    }


    const engineers =
        dashboardLocationService
            .getCurrentLocationEngineers(
                location
            );


    if (!Array.isArray(engineers)) {

        return [];

    }


    return engineers
        .map(
            engineer =>
                engineer.name
        )
        .filter(Boolean);

}


/* ==========================================================
   Build Engineer Filter
========================================================== */

function addLocationFilter(
    where,
    params,
    location
) {

    const engineerNames =
        getLocationEngineerNames(
            location
        );


    /*
     * ALL
     * Tidak perlu filter engineer.
     */

    if (
        engineerNames === null
    ) {

        return;

    }


    /*
     * Location tidak memiliki engineer.
     * Kondisi dibuat pasti FALSE.
     */

    if (
        engineerNames.length === 0
    ) {

        where.push(
            "1 = 0"
        );

        return;

    }


    /*
     * Ticket yang masih berjalan:
     * gunakan PIC saat ini.
     *
     * Ticket yang sudah CLOSED:
     * gunakan PIC yang menyelesaikan ticket.
     *
     * Dengan begitu lokasi tidak bergantung
     * pada TEAM_A / TEAM_B.
     */

    const placeholders =
        engineerNames
            .map(
                () => "?"
            )
            .join(",");


    where.push(`
        (
            CASE
                WHEN status = 'CLOSED'
                    THEN pic_selesai
                ELSE pic
            END
        ) IN (${placeholders})
    `);


    params.push(
        ...engineerNames
    );

}


/* ==========================================================
   Daily Ticket Trend
========================================================== */

function getDailyTrend({

    startDate,

    endDate,

    days = null,

    location = "ALL"

}) {

    const where = [];

    const params = [];


    /* ======================================================
       Periode
    ====================================================== */

    if (days) {

        const end =
            new Date();

        const start =
            new Date();


        start.setDate(
            end.getDate() -
            (days - 1)
        );


        startDate =
            formatDate(
                start
            );

        endDate =
            formatDate(
                end
            );

    }


    if (
        startDate &&
        endDate
    ) {

        where.push(
            "DATE(waktu) BETWEEN DATE(?) AND DATE(?)"
        );


        params.push(
            startDate,
            endDate
        );

    }


    /* ======================================================
       Location
    ====================================================== */

    addLocationFilter(
        where,
        params,
        location
    );


    /* ======================================================
       Main Query
    ====================================================== */

    const sql = `

        SELECT

            DATE(waktu) AS date,

            COUNT(*) AS total,

            SUM(
                CASE
                    WHEN status = 'OPEN'
                    THEN 1
                    ELSE 0
                END
            ) AS open,

            SUM(
                CASE
                    WHEN status = 'PROCESS'
                    THEN 1
                    ELSE 0
                END
            ) AS process,

            SUM(
                CASE
                    WHEN status = 'CLOSED'
                    THEN 1
                    ELSE 0
                END
            ) AS done

        FROM tickets

        ${
            where.length
                ? `WHERE ${where.join(" AND ")}`
                : ""
        }

        GROUP BY
            DATE(waktu)

        ORDER BY
            DATE(waktu)

    `;


    const rows =
        db.prepare(sql)
            .all(...params);


    /* ======================================================
       Tidak Ada Data
    ====================================================== */

    if (
        !rows.length &&
        startDate &&
        endDate
    ) {

        const trend = [];

        const current =
            new Date(startDate);

        const last =
            new Date(endDate);


        while (
            current <= last
        ) {

            trend.push({

                date:
                    formatDate(
                        current
                    ),

                total: 0,

                open: 0,

                process: 0,

                done: 0

            });


            current.setDate(
                current.getDate() + 1
            );

        }


        return {

            summary: {

                totalTicket: 0,

                averagePerDay: 0,

                peakDay: null,

                peakTicket: 0

            },

            comparison: {

                current: 0,

                previous: 0,

                difference: 0,

                percentage: 0,

                isNew: false,

                trend: "flat"

            },

            insight: [],

            trend

        };

    }


    if (!rows.length) {

        return {

            summary: {

                totalTicket: 0,

                averagePerDay: 0,

                peakDay: null,

                peakTicket: 0

            },

            comparison: {

                current: 0,

                previous: 0,

                difference: 0,

                percentage: 0,

                isNew: false,

                trend: "flat"

            },

            insight: [],

            trend: []

        };

    }


    /* ======================================================
       Build Timeline
    ====================================================== */

    const map =
        new Map();


    rows.forEach(
        row => {

            map.set(
                row.date,
                row
            );

        }
    );


    const firstDate =
        startDate ||
        rows[0].date;


    const lastDate =
        endDate ||
        rows[
            rows.length - 1
        ].date;


    const trend = [];


    const current =
        new Date(firstDate);

    const last =
        new Date(lastDate);


    while (
        current <= last
    ) {

        const date =
            formatDate(
                current
            );


        trend.push(

            map.get(date) || {

                date,

                total: 0,

                open: 0,

                process: 0,

                done: 0

            }

        );


        current.setDate(
            current.getDate() + 1
        );

    }


    /* ======================================================
       Summary
    ====================================================== */

    const totalTicket =
        trend.reduce(
            (
                sum,
                item
            ) =>
                sum +
                item.total,
            0
        );


    const averagePerDay =
        trend.length
            ? Number(
                (
                    totalTicket /
                    trend.length
                ).toFixed(2)
            )
            : 0;


    const peak =
        trend.reduce(

            (
                max,
                item
            ) =>

                item.total >
                max.total

                    ? item

                    : max,

            {
                total: 0
            }

        );


    const summary = {

        totalTicket,

        averagePerDay,

        peakDay:
            peak.date ||
            null,

        peakTicket:
            peak.total ||
            0

    };


    /* ======================================================
       Previous Period
    ====================================================== */

    let previousTotal = 0;


    if (days) {

        const currentEnd =
            new Date(
                endDate
            );


        const currentStart =
            new Date(
                startDate
            );


        const previousEnd =
            new Date(
                currentStart
            );


        previousEnd.setDate(
            previousEnd.getDate() - 1
        );


        const previousStart =
            new Date(
                previousEnd
            );


        previousStart.setDate(

            previousStart.getDate() -
            (days - 1)

        );


        const previousWhere = [];

        const previousParams = [];


        previousWhere.push(
            "DATE(waktu) BETWEEN DATE(?) AND DATE(?)"
        );


        previousParams.push(

            formatDate(
                previousStart
            ),

            formatDate(
                previousEnd
            )

        );


        /*
         * Gunakan lokasi engineer
         * yang sama dengan periode sekarang.
         */

        addLocationFilter(

            previousWhere,

            previousParams,

            location

        );


        const previousSql = `

            SELECT

                COUNT(*) AS total

            FROM tickets

            WHERE
                ${previousWhere.join(
                    " AND "
                )}

        `;


        previousTotal =

            db.prepare(
                previousSql
            )
            .get(
                ...previousParams
            )
            ?.total || 0;

    }


    /* ======================================================
       Comparison
    ====================================================== */

    const difference =
        totalTicket -
        previousTotal;


    let percentage = 0;

    let isNew = false;


    if (
        previousTotal === 0
    ) {

        if (
            totalTicket > 0
        ) {

            percentage = 100;

            isNew = true;

        }

    } else {

        percentage =
            Number(

                (
                    difference /
                    previousTotal *
                    100

                ).toFixed(2)

            );

    }


    const comparison = {

        current:
            totalTicket,

        previous:
            previousTotal,

        difference,

        percentage,

        isNew,

        trend:

            difference > 0

                ? "up"

                : difference < 0

                    ? "down"

                    : "flat"

    };


    /* ======================================================
       Insight
    ====================================================== */

    const insight = [];


    if (
        comparison.trend === "up"
    ) {

        insight.push({

            type: "success",

            icon: "📈",

            text:

                comparison.isNew

                    ? "Belum ada tiket pada periode sebelumnya."

                    : `Tiket naik ${comparison.percentage}% dibanding periode sebelumnya.`

        });

    }


    else if (
        comparison.trend === "down"
    ) {

        insight.push({

            type: "danger",

            icon: "📉",

            text:

                `Tiket turun ${Math.abs(
                    comparison.percentage
                )}% dibanding periode sebelumnya.`

        });

    }


    else {

        insight.push({

            type: "secondary",

            icon: "➖",

            text:
                "Jumlah tiket sama dengan periode sebelumnya."

        });

    }


    if (
        summary.peakDay
    ) {

        insight.push({

            type: "warning",

            icon: "🔥",

            text:

                `Puncak tiket terjadi pada ${formatDisplayDate(
                    summary.peakDay
                )} dengan ${summary.peakTicket} tiket.`

        });

    }


    insight.push({

        type: "info",

        icon: "📅",

        text:

            `Rata-rata ${summary.averagePerDay} tiket per hari.`

    });


    insight.push({

        type: "primary",

        icon: "📋",

        text:

            `Total ${summary.totalTicket} tiket pada periode terpilih.`

    });


    return {

        summary,

        comparison,

        insight,

        trend

    };

}


/* ==========================================================
   Export
========================================================== */

module.exports = {

    getDailyTrend

};