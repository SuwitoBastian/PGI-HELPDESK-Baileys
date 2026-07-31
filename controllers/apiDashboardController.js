const ticketRepository =
    require("../repositories/ticketRepository");

const doneService =
    require("../services/doneService");

const slaService =
    require("../services/slaService");

const feedbackService =
    require("../services/feedbackService");

const VALID_STATUS = ["OPEN", "PROCESS", "CLOSED"];

/**
 * Data dashboard JSON untuk React.
 */

function dashboard(req, res) {

    const {
        start,
        end,
        team
    } = req.query;

    const engineerTeam = team || null;

    const useFilter =
        start && end;

    const open = useFilter
        ? ticketRepository.countOpenByDate(
            start,
            end,
            engineerTeam
        )
        : ticketRepository.countOpen(
            engineerTeam
        );

    const process = useFilter
        ? ticketRepository.countProcessByDate(
            start,
            end,
            engineerTeam
        )
        : ticketRepository.countProcess(
            engineerTeam
        );

    const closed = useFilter
        ? ticketRepository.countClosedByDate(
            start,
            end,
            engineerTeam
        )
        : ticketRepository.countClosed(
            engineerTeam
        );

    const hariIni =
        ticketRepository.countToday(
            engineerTeam
        );

    const total = useFilter
        ? ticketRepository.countTotalByDate(
            start,
            end,
            engineerTeam
        )
        : ticketRepository.countTotal(
            engineerTeam
        );

    const tickets = useFilter
        ? ticketRepository.findAllByDate(
            start,
            end,
            engineerTeam
        )
        : ticketRepository.findAll(
            engineerTeam
        );

    const topCabang = useFilter
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

    const topPIC = useFilter
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

    const picList =
        ticketRepository.listPICs();

    const sla =
        slaService.getSLAMetrics(
            start,
            end,
            engineerTeam
        );

    // =====================================================
    // Customer Feedback
    // =====================================================

    const feedback =
        feedbackService.getLatestFeedback(5);

    const feedbackStatistics =
        feedbackService.getStatistics({

            startDate: start || null,

            endDate: end || null,

            team: engineerTeam || "ALL",

            keyword: ""

        });

    res.json({

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

        feedbackStatistics

    });

}

/**
 * Tutup tiket dari dashboard.
 */
function closeTicket(req, res) {

    const ticket =
        ticketRepository.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({
            error: "Tiket tidak ditemukan"
        });
    }

    doneService.close(
        ticket,
        ticket.pic
    );

    res.json({
        ok: true
    });

}

/**
 * Buka kembali tiket.
 */
function reopenTicket(req, res) {

    const ticket =
        ticketRepository.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({
            error: "Tiket tidak ditemukan"
        });
    }

    ticketRepository.reopen(
        req.params.id
    );

    res.json({
        ok: true
    });

}

/**
 * Assign PIC.
 */
function assignPIC(req, res) {

    const ticket =
        ticketRepository.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({
            error: "Tiket tidak ditemukan"
        });
    }

    const pic = (
        req.body &&
        req.body.pic
            ? String(req.body.pic)
            : ""
    ).trim();

    if (!pic) {
        return res.status(400).json({
            error: "PIC wajib diisi"
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

/**
 * Ubah status tiket.
 */
function changeStatus(req, res) {

    const ticket =
        ticketRepository.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({
            error: "Tiket tidak ditemukan"
        });
    }

    const status = (
        req.body &&
        req.body.status
            ? String(req.body.status)
            : ""
    )
        .trim()
        .toUpperCase();

    if (!VALID_STATUS.includes(status)) {
        return res.status(400).json({
            error:
                `Status tidak valid. Pilih salah satu: ${VALID_STATUS.join(", ")}`
        });
    }

    if (status === "CLOSED") {

        doneService.close(
            ticket,
            ticket.pic
        );

    } else if (status === "OPEN") {

        ticketRepository.reopen(
            req.params.id
        );

    } else {

        ticketRepository.updateState(
            req.params.id,
            "PROCESS"
        );

    }

    res.json({
        ok: true
    });

}

module.exports = {
    dashboard,
    closeTicket,
    reopenTicket,
    assignPIC,
    changeStatus
};