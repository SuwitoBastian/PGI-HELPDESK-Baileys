const repository =
    require('../repositories/ticketRepository');

const { nowWIB } =
    require("../utils/dateTime");

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

function close(ticket, picSelesai) {

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

    const durasi =
        `${durasiMenit} Menit`;

    repository.closeTicket(

        ticket.id,

        nowWIB(),      // selesai

        durasi,        // durasi

        picSelesai     // pic_selesai

    );

}

module.exports = {

    getTicketsByPIC,

    getProcessByNomor,

    getProcessTickets,

    close

};