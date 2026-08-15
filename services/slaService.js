const repository =
    require("../repositories/ticketRepository");

const dashboardLocationService =
    require("./dashboard/dashboardLocationService");

const {
    responseTime,
    resolutionTime,
    totalDuration
} = require("../utils/slaHelper");


/* ==========================================================
   Helper
========================================================== */

function average(values) {

    if (!values.length) {

        return 0;

    }


    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    return Math.round(
        total / values.length
    );

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
   Get Location Engineers
========================================================== */

function getLocationEngineers(location) {

    const normalizedLocation =
        normalizeLocation(
            location
        );


    if (!normalizedLocation) {

        return [];

    }


    return dashboardLocationService
        .getCurrentLocationNames(
            normalizedLocation
        );

}


/* ==========================================================
   SLA Metrics
========================================================== */

function getSLAMetrics(
    start,
    end,
    team = null,
    location = null
) {

    let tickets;


    /*
    ==========================================================
    LOCATION MODE
    ==========================================================
    */

    if (location) {

        const engineerNames =
            getLocationEngineers(
                location
            );


        /*
        Ambil CLOSED ticket berdasarkan
        tanggal saja.

        Kemudian filter berdasarkan engineer
        yang sedang berada di lokasi tersebut.
        */

        const allTickets =
            repository.findClosedForSLA(
                start,
                end,
                null
            );


        if (
            engineerNames.length === 0
        ) {

            tickets = [];

        } else {

            const engineerSet =
                new Set(
                    engineerNames.map(
                        name =>
                            String(name)
                                .trim()
                                .toLowerCase()
                    )
                );


            tickets =
                allTickets.filter(
                    ticket => {

                        /*
                        findClosedForSLA pada versi
                        sekarang belum mengambil pic_selesai.

                        Jadi location mode akan ditangani
                        dengan query khusus di bawah.
                        */

                        return engineerSet.has(
                            String(
                                ticket.pic_selesai || ""
                            )
                                .trim()
                                .toLowerCase()
                        );

                    }
                );

        }

    }


    /*
    ==========================================================
    LEGACY TEAM MODE
    ==========================================================
    */

    else {

        tickets =
            repository.findClosedForSLA(
                start,
                end,
                team
            );

    }


    const responseTimes = [];

    const resolutionTimes = [];

    const totalDurations = [];


    for (const ticket of tickets) {

        responseTimes.push(
            responseTime(ticket)
        );


        totalDurations.push(
            totalDuration(ticket)
        );


        /*
        Resolution hanya dihitung
        jika SLA tidak expired.
        */

        if (
            ticket.sla_status ===
            "NORMAL"
        ) {

            resolutionTimes.push(
                resolutionTime(ticket)
            );

        }

    }


    return {

        totalTicket:
            tickets.length,


        averageResponseTime:
            average(
                responseTimes
            ),


        averageResolutionTime:
            average(
                resolutionTimes
            ),


        averageTotalDuration:
            average(
                totalDurations
            ),


        normalSLA:
            tickets.filter(
                ticket =>
                    ticket.sla_status ===
                    "NORMAL"
            ).length,


        expiredSLA:
            tickets.filter(
                ticket =>
                    ticket.sla_status ===
                    "EXPIRED"
            ).length

    };

}


/* ==========================================================
   Export
========================================================== */

module.exports = {

    getSLAMetrics

};