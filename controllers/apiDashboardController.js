const ticketRepository =
    require("../repositories/ticketRepository");

const doneService =
    require("../services/doneService");

const VALID_STATUS = ["OPEN", "PROCESS", "CLOSED"];

/**
 * Data dashboard dalam bentuk JSON.
 * Field-nya sama persis dengan yang dirender dashboardController (EJS),
 * plus picList untuk dropdown assign PIC.
 */
function dashboard(req, res) {

    const { start, end } = req.query;

    const useFilter =
        start && end;

    const open = useFilter
        ? ticketRepository.countOpenByDate(start, end)
        : ticketRepository.countOpen();

    const process = useFilter
        ? ticketRepository.countProcessByDate(start, end)
        : ticketRepository.countProcess();

    const closed = useFilter
        ? ticketRepository.countClosedByDate(start, end)
        : ticketRepository.countClosed();

    const hariIni =
        ticketRepository.countToday();

    const tickets = useFilter
        ? ticketRepository.findAllByDate(start, end)
        : ticketRepository.findAll();

    const total =
        tickets.length;

    const topCabang = useFilter
        ? ticketRepository.topCabangByDate(
            10,
            start,
            end
        )
        : ticketRepository.topCabang(10);

    const topPIC = useFilter
        ? ticketRepository.topPICByDate(
            6,
            start,
            end
        )
        : ticketRepository.topPIC(6);

    const picList =
        ticketRepository.listPICs();

    res.json({

        open,

        process,

        closed,

        hariIni,

        total,

        tickets,

        topCabang,

        topPIC,

        picList

    });

}

/**
 * Tutup tiket dari dashboard.
 * Pakai ulang doneService.close (menghitung durasi otomatis).
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
 * Buka kembali tiket dari dashboard.
 */
function reopenTicket(req, res) {

    const ticket = ticketRepository.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: "Tiket tidak ditemukan" });
    }

    ticketRepository.reopen(req.params.id);

    res.json({ ok: true });

}

/**
 * Assign PIC ke tiket -> status menjadi PROCESS.
 */
function assignPIC(req, res) {

    const ticket = ticketRepository.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: "Tiket tidak ditemukan" });
    }

    const pic = (req.body && req.body.pic ? String(req.body.pic) : "").trim();

    if (!pic) {
        return res.status(400).json({ error: "PIC wajib diisi" });
    }

    ticketRepository.assignPIC(req.params.id, pic);

    res.json({ ok: true });

}

/**
 * Ubah status tiket.
 * CLOSED  -> doneService.close (set selesai + durasi)
 * OPEN    -> reopen
 * PROCESS -> updateState
 */
function changeStatus(req, res) {

    const ticket = ticketRepository.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: "Tiket tidak ditemukan" });
    }

    const status = (req.body && req.body.status ? String(req.body.status) : "")
        .trim()
        .toUpperCase();

    if (!VALID_STATUS.includes(status)) {
        return res.status(400).json({
            error: `Status tidak valid. Pilih salah satu: ${VALID_STATUS.join(", ")}`
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

    res.json({ ok: true });

}

module.exports = {
    dashboard,
    closeTicket,
    reopenTicket,
    assignPIC,
    changeStatus
};
