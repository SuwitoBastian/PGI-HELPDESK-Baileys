const repository =
    require("../repositories/ticketRepository");

const engineerService =
    require("./engineerService");

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

    repository.assignPIC(

        ticket.id,

        engineer.name,

        engineer.team

    );

    return {

        ticket,

        pic: engineer.name,

        engineer

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

    repository.assignPIC(

        ticketId,

        engineer.name,

        engineer.team

    );

    return {

        pic: engineer.name,

        engineer

    };

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    assign,

    assignByNomor

};