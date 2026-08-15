const ticketRepository =
    require("../../repositories/ticketRepository");

const dashboardLocationService =
    require("../dashboard/dashboardLocationService");

const slaService =
    require("../slaService");


/* ==========================================================
LOCATION ENGINEERS
========================================================== */

function getLocationEngineers(location) {

    if (!location) {

        return [];

    }


    return dashboardLocationService
        .getCurrentLocationNames(
            location
        );

}


/* ==========================================================
GET LOCATION TICKETS
==========================================================

Jika ada filter tanggal:

    findAllByDate()

Jika tidak ada filter tanggal:

    findAll()

========================================================== */

function getLocationTickets(
    start,
    end
) {

    const byDate =
        !!(
            start &&
            end
        );


    if (byDate) {

        return ticketRepository.findAllByDate(
            start,
            end,
            null
        );

    }


    return ticketRepository.findAll(
        null,
        null
    );

}


/* ==========================================================
COUNT LOCATION STATUS
========================================================== */

function countLocationStatus(
    engineerNames,
    start,
    end
) {

    if (!engineerNames.length) {

        return {

            open: 0,

            process: 0,

            closed: 0

        };

    }


    const engineerSet =
        new Set(

            engineerNames.map(
                name =>
                    String(name)
                        .trim()
                        .toLowerCase()
            )

        );


    /*
    ==========================================================
    AMBIL TICKET

    Tanpa filter tanggal:
        ambil seluruh ticket.

    Dengan filter tanggal:
        ambil ticket sesuai periode.

    Tidak menggunakan TEAM_A / TEAM_B.
    ==========================================================
    */

    const tickets =
        getLocationTickets(
            start,
            end
        );


    /*
    ==========================================================
    FILTER LOCATION BERDASARKAN ENGINEER AKTIF
    ==========================================================
    */

    const locationTickets =
        tickets.filter(ticket => {

            const pic =
                String(
                    ticket.pic || ""
                )
                    .trim()
                    .toLowerCase();


            const picSelesai =
                String(
                    ticket.pic_selesai || ""
                )
                    .trim()
                    .toLowerCase();


            /*
            --------------------------------------------------
            OPEN / PROCESS
            --------------------------------------------------

            Ticket masih ditangani oleh PIC aktif.
            */

            if (
                ticket.status === "OPEN" ||
                ticket.status === "PROCESS"
            ) {

                return engineerSet.has(
                    pic
                );

            }


            /*
            --------------------------------------------------
            CLOSED
            --------------------------------------------------

            Ticket dihitung berdasarkan PIC yang
            menyelesaikan ticket.
            */

            if (
                ticket.status === "CLOSED"
            ) {

                return engineerSet.has(
                    picSelesai
                );

            }


            return false;

        });


    return {

        open:
            locationTickets.filter(
                ticket =>
                    ticket.status === "OPEN"
            ).length,


        process:
            locationTickets.filter(
                ticket =>
                    ticket.status === "PROCESS"
            ).length,


        closed:
            locationTickets.filter(
                ticket =>
                    ticket.status === "CLOSED"
            ).length

    };

}


/* ==========================================================
OVERVIEW
========================================================== */

async function getOverview(
    start,
    end,
    team = null,
    location = null
) {

    const byDate =
        !!(
            start &&
            end
        );


    /* ======================================================
    LOCATION MODE
    ====================================================== */

    if (location) {

        const engineerNames =
            getLocationEngineers(
                location
            );


        /*
        ------------------------------------------------------
        STATUS
        ------------------------------------------------------
        */

        const status =
            countLocationStatus(
                engineerNames,
                byDate
                    ? start
                    : null,
                byDate
                    ? end
                    : null
            );


        /*
        ------------------------------------------------------
        TOTAL TICKET
        ------------------------------------------------------
        */

        const today =
            status.open +
            status.process +
            status.closed;


        /*
        ------------------------------------------------------
        SLA
        ------------------------------------------------------
        */

        const sla =
            slaService.getSLAMetrics(
                start,
                end,
                team,
                location
            );


        return {

            today,

            open:
                status.open,

            process:
                status.process,

            closed:
                status.closed,

            sla

        };

    }


    /* ======================================================
    LEGACY TEAM MODE
    ====================================================== */

    const overview = {

        today:

            byDate

                ? ticketRepository.countOpenByDate(
                    start,
                    end,
                    team
                )

                + ticketRepository.countProcessByDate(
                    start,
                    end,
                    team
                )

                + ticketRepository.countClosedByDate(
                    start,
                    end,
                    team
                )

                : ticketRepository.countToday(
                    team
                ),


        open:

            byDate

                ? ticketRepository.countOpenByDate(
                    start,
                    end,
                    team
                )

                : ticketRepository.countOpen(
                    team
                ),


        process:

            byDate

                ? ticketRepository.countProcessByDate(
                    start,
                    end,
                    team
                )

                : ticketRepository.countProcess(
                    team
                ),


        closed:

            byDate

                ? ticketRepository.countClosedByDate(
                    start,
                    end,
                    team
                )

                : ticketRepository.countClosed(
                    team
                )

    };


    const sla =
        slaService.getSLAMetrics(
            start,
            end,
            team
        );


    return {

        ...overview,

        sla

    };

}


/* ==========================================================
EXPORT
========================================================== */

module.exports = {

    getOverview

};