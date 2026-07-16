const ticketRepository =
    require("../repositories/ticketRepository");

function index(req,res){

    const open =
        ticketRepository.countOpen();

    const process =
        ticketRepository.countProcess();

    const closed =
        ticketRepository.countClosed();

    const hariIni =
        ticketRepository.countToday();

    const tickets =
        ticketRepository.findAll();

    const total =
        tickets.length;

    const topCabang =
        ticketRepository.topCabang(10);

    const topPIC =
        ticketRepository.topPIC(6);

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
            topPIC
        }
    );

}

module.exports = {

    index

};