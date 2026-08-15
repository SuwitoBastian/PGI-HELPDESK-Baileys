const ticketRepository =
    require("../repositories/ticketRepository");

const dashboardLocationService =
    require("../services/dashboard/dashboardLocationService");

const dashboardRepository =
    require("../repositories/dashboardRepository");


/* ==========================================================
   Dashboard
========================================================== */

function index(req, res) {

    console.log(
        "=== DASHBOARD CONTROLLER AKTIF ==="
    );

    const location =
        req.query.location || null;

    const engineerTeam =
        req.query.team || null;


    /* ======================================================
       NEW SYSTEM
       Location-based Dashboard
       AKR / HEAD OFFICE
    ====================================================== */

    if (location) {

        console.log(
            "DASHBOARD LOCATION:",
            location
        );

        const locationEngineers =
            dashboardLocationService
                .getCurrentLocationNames(
                    location
                );

        console.log(
            "LOCATION ENGINEERS:",
            locationEngineers
        );


        /* ==================================================
           OPEN

           OPEN belum memiliki PIC.
           Semua engineer tetap boleh mengambil ticket.

           Karena itu OPEN tetap dihitung global.
        ================================================== */

        const open =
            ticketRepository.countOpen();


        /* ==================================================
           PROCESS
        ================================================== */

        const process =
            dashboardRepository
                .countProcessByEngineers(
                    locationEngineers
                );


        /* ==================================================
           CLOSED
        ================================================== */

        const closed =
            dashboardRepository
                .countClosedByEngineers(
                    locationEngineers
                );


        /* ==================================================
           TODAY

           Untuk sementara dihitung dari ticket yang
           ditangani engineer lokasi tersebut hari ini.
        ================================================== */

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        const todayDate =
            `${year}-${month}-${day}`;


        const todayTickets =
            dashboardRepository
                .findTicketsByEngineers(
                    locationEngineers,
                    todayDate,
                    todayDate
                );

        const hariIni =
            todayTickets.length;


        /* ==================================================
           TICKET LIST
        ================================================== */

        const tickets =
            dashboardRepository
                .findTicketsByEngineers(
                    locationEngineers
                );


        const total =
            tickets.length;


        /* ==================================================
           TOP CABANG
        ================================================== */

        const topCabang =
            dashboardRepository
                .topCabangByEngineers(
                    locationEngineers,
                    null,
                    null,
                    10
                );


        /* ==================================================
           TOP PIC
        ================================================== */

        const topPIC =
            dashboardRepository
                .topPICByEngineers(
                    locationEngineers,
                    null,
                    null,
                    6
                );


        /* ==================================================
           RENDER
        ================================================== */

        return res.render(
            "dashboard",
            {

                open,

                process,

                closed,

                hariIni,

                total,

                tickets,

                topCabang,

                topPIC,

                engineerTeam,

                location,

                locationEngineers

            }
        );

    }


    /* ======================================================
       LEGACY SYSTEM
       TEAM_A / TEAM_B

       Dipertahankan supaya bagian lama tidak rusak.
    ====================================================== */

    console.log(
        "DASHBOARD LEGACY TEAM:",
        engineerTeam
    );


    const open =
        ticketRepository.countOpen(
            engineerTeam
        );

    const process =
        ticketRepository.countProcess(
            engineerTeam
        );

    const closed =
        ticketRepository.countClosed(
            engineerTeam
        );

    const hariIni =
        ticketRepository.countToday(
            engineerTeam
        );

    const tickets =
        ticketRepository.findAll();


    const total =
        tickets.length;


    const topCabang =
        ticketRepository.topCabang(
            10,
            engineerTeam
        );

    const topPIC =
        ticketRepository.topPIC(
            6,
            engineerTeam
        );


    return res.render(
        "dashboard",
        {

            open,

            process,

            closed,

            hariIni,

            total,

            tickets,

            topCabang,

            topPIC,

            engineerTeam,

            location: null,

            locationEngineers: []

        }
    );

}


/* ==========================================================
   Export
========================================================== */

module.exports = {

    index

};