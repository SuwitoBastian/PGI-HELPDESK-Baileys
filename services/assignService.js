const repository =
    require("../repositories/ticketRepository");

const daftarPIC =
    require("../config/pic");

const engineers =
    require("../config/engineers");

function assignByNomor(nomor, kodePIC) {

    const ticket =
        repository.findWaitingByNomor(nomor);

    if (!ticket)
        return null;

    const pic =
        daftarPIC[kodePIC];

    if (!pic)
        return null;

    const engineer =
        engineers[kodePIC];

    if (!engineer)
        return null;

    repository.assignPIC(

        ticket.id,

        pic,

        engineer.team

    );

    return {

        ticket,

        pic,

        engineer

    };

}

function assign(ticketId, kodePIC) {

    const pic =
        daftarPIC[kodePIC];

    if (!pic)
        return null;

    const engineer =
        engineers[kodePIC];

    if (!engineer)
        return null;

    repository.assignPIC(

        ticketId,

        pic,

        engineer.team

    );

    return {

        pic,

        engineer

    };

}

module.exports = {

    assign,

    assignByNomor

};