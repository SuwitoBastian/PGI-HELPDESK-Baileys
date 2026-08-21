const ticketRepository =
    require("../repositories/ticketRepository");

const dashboardRepository =
    require("../repositories/dashboardRepository");

const dashboardLocationService =
    require("../services/dashboard/dashboardLocationService");

const doneService =
    require("../services/doneService");

const slaService =
    require("../services/slaService");

const feedbackService =
    require("../services/feedbackService");

const notificationService =
    require("../services/notificationService");

const overviewAnalytics =
    require("../services/analytics/overviewAnalytics");

const engineerAnalytics =
    require("../services/analytics/engineerAnalytics");

const teamAnalytics =
    require("../services/analytics/teamAnalytics");


const VALID_STATUS = [
    "OPEN",
    "PROCESS",
    "CLOSED"
];


/* ==========================================================
HELPER
========================================================== */

function getTodayDate() {

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

    return `${year}-${month}-${day}`;

}


/* ==========================================================
ANALYTICS HELPER
========================================================== */

async function getDashboardAnalytics(
    start,
    end,
    team,
    location
) {

    const overview =
        await overviewAnalytics.getOverview(
            start,
            end,
            team,
            location
        );


    const engineers =
        engineerAnalytics.getEngineers(
            start,
            end,
            team,
            location
        );


    const teams =
        teamAnalytics.getTeams(
            start,
            end,
            team,
            location
        );


    return {

        overview,

        engineers,

        teams

    };

}


/* ==========================================================
DASHBOARD
========================================================== */

async function dashboard(req, res) {

    try {

        const {
            start,
            end,
            team,
            location
        } = req.query;


        const engineerTeam =
            team || null;

        const dashboardLocation =
            location || null;


        const useFilter =
            !!(
                start &&
                end
            );


        /* ======================================================
        LOCATION MODE
        ====================================================== */

        if (dashboardLocation) {

            const engineerNames =
                dashboardLocationService
                    .getCurrentLocationNames(
                        dashboardLocation
                    );


            /*
            ------------------------------------------------------
            ANALYTICS
            ------------------------------------------------------
            */

            const analytics =
                await getDashboardAnalytics(
                    start,
                    end,
                    engineerTeam,
                    dashboardLocation
                );


            /*
            ------------------------------------------------------
            PERIODE
            ------------------------------------------------------
            */

            const dateStart =
                useFilter
                    ? start
                    : null;

            const dateEnd =
                useFilter
                    ? end
                    : null;


            /*
            ------------------------------------------------------
            TICKETS
            ------------------------------------------------------
            */

            const tickets =
                dashboardRepository
                    .findTicketsByEngineers(
                        engineerNames,
                        dateStart,
                        dateEnd
                    );


            /*
            ------------------------------------------------------
            STATUS
            ------------------------------------------------------
            */

            const open =
                tickets.filter(
                    ticket =>
                        ticket.status === "OPEN"
                ).length;


            const process =
                tickets.filter(
                    ticket =>
                        ticket.status === "PROCESS"
                ).length;


            const closed =
                tickets.filter(
                    ticket =>
                        ticket.status === "CLOSED"
                ).length;


            const total =
                tickets.length;


            /*
            ------------------------------------------------------
            HARI INI
            ------------------------------------------------------
            */

            const todayDate =
                getTodayDate();


            const todayTickets =
                dashboardRepository
                    .findTicketsByEngineers(
                        engineerNames,
                        todayDate,
                        todayDate
                    );


            const hariIni =
                todayTickets.length;


            /*
            ------------------------------------------------------
            TOP CABANG
            ------------------------------------------------------
            */

            const topCabang =
                dashboardRepository
                    .topCabangByEngineers(
                        engineerNames,
                        dateStart,
                        dateEnd,
                        10
                    );


            /*
            ------------------------------------------------------
            TOP PIC PROCESS
            ------------------------------------------------------
            */

            const topPIC =
                dashboardRepository
                    .topPICByEngineers(
                        engineerNames,
                        dateStart,
                        dateEnd,
                        6
                    );


            /*
            ------------------------------------------------------
            PIC LIST
            ------------------------------------------------------
            */

            const picList =
                ticketRepository.listPICs();


            /*
            ------------------------------------------------------
            SLA
            ------------------------------------------------------
            */

            const sla =
                slaService.getSLAMetrics(
                    start,
                    end,
                    engineerTeam,
                    dashboardLocation
                );


            /*
            ------------------------------------------------------
            CUSTOMER FEEDBACK
            ------------------------------------------------------
            */

            const feedback =
                feedbackService.getLatestFeedback(
                    5,
                    dashboardLocation
                );


            const feedbackStatistics =
                feedbackService.getStatistics({

                    startDate:
                        start || null,

                    endDate:
                        end || null,

                    team:
                        engineerTeam || "ALL",

                    keyword:
                        ""

                });


            /*
            ------------------------------------------------------
            RESPONSE
            ------------------------------------------------------
            */

            return res.json({

                open,

                process,

                closed,

                hariIni,

                total,

                tickets,

                topCabang,

                topPIC,

                picList,

                sla,

                feedback,

                feedbackStatistics,

                analytics

            });

        }


        /* ======================================================
        LEGACY TEAM MODE
        ====================================================== */

        const useDateFilter =
            !!(
                start &&
                end
            );


        /*
        ------------------------------------------------------
        ANALYTICS
        ------------------------------------------------------
        */

        const analytics =
            await getDashboardAnalytics(
                start,
                end,
                engineerTeam,
                null
            );


        /*
        ------------------------------------------------------
        OPEN
        ------------------------------------------------------
        */

        const open =
            useDateFilter

                ? ticketRepository.countOpenByDate(
                    start,
                    end,
                    engineerTeam
                )

                : ticketRepository.countOpen(
                    engineerTeam
                );


        /*
        ------------------------------------------------------
        PROCESS
        ------------------------------------------------------
        */

        const process =
            useDateFilter

                ? ticketRepository.countProcessByDate(
                    start,
                    end,
                    engineerTeam
                )

                : ticketRepository.countProcess(
                    engineerTeam
                );


        /*
        ------------------------------------------------------
        CLOSED
        ------------------------------------------------------
        */

        const closed =
            useDateFilter

                ? ticketRepository.countClosedByDate(
                    start,
                    end,
                    engineerTeam
                )

                : ticketRepository.countClosed(
                    engineerTeam
                );


        /*
        ------------------------------------------------------
        HARI INI
        ------------------------------------------------------
        */

        const hariIni =
            ticketRepository.countToday(
                engineerTeam
            );


        /*
        ------------------------------------------------------
        TOTAL
        ------------------------------------------------------
        */

        const total =
            useDateFilter

                ? ticketRepository.countTotalByDate(
                    start,
                    end,
                    engineerTeam
                )

                : ticketRepository.countTotal(
                    engineerTeam
                );


        /*
        ------------------------------------------------------
        TICKETS
        ------------------------------------------------------
        */

        const tickets =
            useDateFilter

                ? ticketRepository.findAllByDate(
                    start,
                    end,
                    engineerTeam
                )

                : ticketRepository.findAll(
                    engineerTeam
                );


        /*
        ------------------------------------------------------
        TOP CABANG
        ------------------------------------------------------
        */

        const topCabang =
            useDateFilter

                ? ticketRepository.topCabangByDate(
                    start,
                    end,
                    10,
                    engineerTeam
                )

                : ticketRepository.topCabang(
                    10,
                    engineerTeam
                );


        /*
        ------------------------------------------------------
        TOP PIC
        ------------------------------------------------------
        */

        const topPIC =
            useDateFilter

                ? ticketRepository.topPICByDate(
                    start,
                    end,
                    6,
                    engineerTeam
                )

                : ticketRepository.topPIC(
                    6,
                    engineerTeam
                );


        /*
        ------------------------------------------------------
        PIC LIST
        ------------------------------------------------------
        */

        const picList =
            ticketRepository.listPICs();


        /*
        ------------------------------------------------------
        SLA
        ------------------------------------------------------
        */

        const sla =
            slaService.getSLAMetrics(
                start,
                end,
                engineerTeam
            );


        /*
        ------------------------------------------------------
        CUSTOMER FEEDBACK
        ------------------------------------------------------
        */

        const feedback =
            feedbackService.getLatestFeedback(
                5
            );


        const feedbackStatistics =
            feedbackService.getStatistics({

                startDate:
                    start || null,

                endDate:
                    end || null,

                team:
                    engineerTeam || "ALL",

                keyword:
                    ""

            });


        /*
        ------------------------------------------------------
        RESPONSE
        ------------------------------------------------------
        */

        return res.json({

            open,

            process,

            closed,

            hariIni,

            total,

            tickets,

            topCabang,

            topPIC,

            picList,

            sla,

            feedback,

            feedbackStatistics,

            analytics

        });

    }

    catch (err) {

        console.error(
            "Dashboard API Error:",
            err
        );


        return res.status(500).json({

            error:
                err.message ||
                "Gagal memuat dashboard"

        });

    }

}


/* ==========================================================
TUTUP TIKET
========================================================== */

async function closeTicket(req, res) {

    try {

        const ticket =
            ticketRepository.findById(
                req.params.id
            );


        if (!ticket) {

            return res.status(404).json({

                error:
                    "Tiket tidak ditemukan"

            });

        }


        // ======================================================
        // TUTUP TICKET
        // ======================================================

        doneService.close(
            ticket,
            ticket.pic
        );


        // ======================================================
        // KIRIM FEEDBACK KE PELAPOR
        // Hanya jika feedback belum pernah dikirim
        // ======================================================

        if (!ticket.feedback_sent) {

            try {

                await notificationService.ticketClosed(

                    ticket.chatId,

                    ticket,

                    ticket.pic

                );


                ticketRepository.markFeedbackSent(
                    ticket.id
                );


                console.log(
                    `📨 Feedback Dashboard terkirim → ${ticket.id}`
                );


            } catch (feedbackError) {

                console.error(
                    `❌ Gagal mengirim feedback → ${ticket.id}`
                );

                console.error(
                    feedbackError.message
                );

            }

        }


        // ======================================================
        // RESPONSE
        // Ticket tetap dianggap berhasil CLOSED
        // meskipun WhatsApp gagal mengirim feedback
        // ======================================================

        return res.json({

            ok: true

        });


    } catch (err) {

        console.error(
            "❌ Dashboard Close Ticket Error:"
        );

        console.error(err);


        return res.status(500).json({

            error:
                "Gagal menutup tiket"

        });

    }

}


/* ==========================================================
BUKA KEMBALI TIKET
========================================================== */

function reopenTicket(req, res) {

    const ticket =
        ticketRepository.findById(
            req.params.id
        );


    if (!ticket) {

        return res.status(404).json({

            error:
                "Tiket tidak ditemukan"

        });

    }


    ticketRepository.reopen(
        req.params.id
    );


    res.json({

        ok: true

    });

}


/* ==========================================================
ASSIGN PIC
========================================================== */

function assignPIC(req, res) {

    const ticket =
        ticketRepository.findById(
            req.params.id
        );


    if (!ticket) {

        return res.status(404).json({

            error:
                "Tiket tidak ditemukan"

        });

    }


    const pic = (

        req.body &&
        req.body.pic

            ? String(
                req.body.pic
            )

            : ""

    ).trim();


    if (!pic) {

        return res.status(400).json({

            error:
                "PIC wajib diisi"

        });

    }


    ticketRepository.assignPIC(
        req.params.id,
        pic
    );


    res.json({

        ok: true

    });

}


/* ==========================================================
UBAH STATUS
========================================================== */

function changeStatus(req, res) {

    const ticket =
        ticketRepository.findById(
            req.params.id
        );


    if (!ticket) {

        return res.status(404).json({

            error:
                "Tiket tidak ditemukan"

        });

    }


    const status = (

        req.body &&
        req.body.status

            ? String(
                req.body.status
            )

            : ""

    )
        .trim()
        .toUpperCase();


    if (
        !VALID_STATUS.includes(
            status
        )
    ) {

        return res.status(400).json({

            error:
                `Status tidak valid. Pilih salah satu: ${VALID_STATUS.join(", ")}`

        });

    }


    if (
        status === "CLOSED"
    ) {

        doneService.close(
            ticket,
            ticket.pic
        );

    }

    else if (
        status === "OPEN"
    ) {

        ticketRepository.reopen(
            req.params.id
        );

    }

    else {

        ticketRepository.updateState(
            req.params.id,
            "PROCESS"
        );

    }


    res.json({

        ok: true

    });

}


/* ==========================================================
EXPORT
========================================================== */

module.exports = {

    dashboard,

    closeTicket,

    reopenTicket,

    assignPIC,

    changeStatus

};