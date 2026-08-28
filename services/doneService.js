const repository =
    require('../repositories/ticketRepository');

const { nowWIB } =
    require("../utils/dateTime");

const engineerService =
    require("./engineerService");

const dashboardLocationService =
    require("./dashboard/dashboardLocationService");


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


// ======================================
// Tentukan Location Engineer
// ======================================

function getEngineerLocation(engineerCode) {

    const akrEngineers =
        dashboardLocationService
            .getCurrentLocationEngineers("AKR");

    const isAKR =
        akrEngineers.some(
            engineer =>
                engineer.code === engineerCode
        );

    return isAKR
        ? "AKR"
        : "HO";

}


// ======================================
// CLOSE TICKET
// ======================================

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

    let picSelesaiTeam = null;

    let locationSelesai = null;


    // ======================================
    // SYSTEM AUTO CLOSE
    // ======================================

    if (picSelesai === "SYSTEM") {

        picSelesaiTeam = "AUTO";

        locationSelesai = null;

    }

    // ======================================
    // NORMAL CLOSE
    // ======================================

    else {

        const engineer =
            engineerService.getByCode(kodePIC);

        picSelesaiTeam =
            engineer
                ? engineer.team
                : null;


        if (engineer) {

            locationSelesai =
                getEngineerLocation(
                    engineer.code
                );

        }

    }


    repository.closeTicket(

        ticket.id,

        nowWIB(),          // selesai

        durasi,            // durasi

        picSelesai,        // pic_selesai

        picSelesaiTeam,    // pic_selesai_team

        locationSelesai    // location_selesai

    );

}


module.exports = {

    getTicketsByPIC,

    getProcessByNomor,

    getProcessTickets,

    close

};