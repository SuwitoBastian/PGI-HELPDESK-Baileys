function index(req, res) {

    console.log("=== DASHBOARD CONTROLLER AKTIF ===");

    const engineerTeam = req.query.team || null;

    console.log({
    all: ticketRepository.countOpen(),
    teamA: ticketRepository.countOpen("TEAM_A"),
    teamB: ticketRepository.countOpen("TEAM_B")
});

    const open =
        ticketRepository.countOpen(engineerTeam);

    const process =
        ticketRepository.countProcess(engineerTeam);

    const closed =
        ticketRepository.countClosed(engineerTeam);

    const hariIni =
        ticketRepository.countToday(engineerTeam);

    const tickets =
        ticketRepository.findAll(); // sementara jangan difilter dulu

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

    res.render(
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
            engineerTeam
        }
    );

}

module.exports = {

    index

};