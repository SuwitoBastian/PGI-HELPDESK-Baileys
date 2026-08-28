const repository =
    require("../repositories/ticketRepository");

const engineerService =
    require("./engineerService");

const dashboardLocationService =
    require("./dashboard/dashboardLocationService");


/* ==========================================================
   Get Engineer Location
========================================================== */

function getEngineerLocation(engineerCode) {

    const rotationLocation =
        dashboardLocationService
            .getCurrentLocationEngineers("AKR");

    const isAKR =
        rotationLocation.some(
            engineer =>
                engineer.code === engineerCode
        );

    return isAKR
        ? "AKR"
        : "HO";

}


/* ==========================================================
   Assign By Nomor
========================================================== */

function assignByNomor(nomor, kodePIC) {

    const ticket =
        repository.findWaitingByNomor(nomor);

    if (!ticket)
        return null;

    const engineer =
        engineerService.getByCode(kodePIC);

    if (!engineer)
        return null;

    const location =
        getEngineerLocation(
            engineer.code
        );

    repository.assignPIC(

        ticket.id,

        engineer.name,

        engineer.team,

        location

    );

    return {

        ticket,

        pic: engineer.name,

        engineer,

        location

    };

}


/* ==========================================================
   Assign By Ticket
========================================================== */

function assign(ticketId, kodePIC) {

    const engineer =
        engineerService.getByCode(kodePIC);

    if (!engineer)
        return null;

    const location =
        getEngineerLocation(
            engineer.code
        );

    repository.assignPIC(

        ticketId,

        engineer.name,

        engineer.team,

        location

    );

    return {

        pic: engineer.name,

        engineer,

        location

    };

}


/* ==========================================================
   Export
========================================================== */

module.exports = {

    assign,

    assignByNomor

};