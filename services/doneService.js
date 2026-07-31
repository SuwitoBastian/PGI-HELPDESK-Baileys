const repository =
    require('../repositories/ticketRepository');

const { nowWIB } =
    require("../utils/dateTime");

const engineers =
    require("../config/engineers");

function getTicketsByPIC(pic){

    return repository.findProcessByPIC(pic);

}

function getProcessByNomor(nomor){

    return repository.findProcessByNomor(nomor);

}

// ======================================
// Ambil semua ticket yang masih PROCESS
// ======================================

function getProcessTickets(){

    return repository.findProcess();

}

function close(ticket, picSelesai, kodePIC) {

    const selesai =
        new Date();

    const mulai =
        new Date(ticket.waktu);

    const durasiMenit =
        Math.max(
            1,
            Math.floor(
                (selesai - mulai) / 60000
            )
        );

    const durasi = durasiMenit;

    const engineer =
        engineers[kodePIC];

    const picSelesaiTeam =
        engineer
            ? engineer.team
            : null;

    repository.closeTicket(

        ticket.id,

        nowWIB(),          // selesai

        durasi,            // durasi

        picSelesai,        // pic_selesai

        picSelesaiTeam     // pic_selesai_team

    );

}

module.exports = {

    getTicketsByPIC,

    getProcessByNomor,

    getProcessTickets,

    close

};