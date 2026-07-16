const repository =
    require('../repositories/ticketRepository');

function assignByNomor(nomor, kodePIC){

    const ticket =
        repository.findWaitingByNomor(nomor);

    if(!ticket)
        return null;

    const pic =
        daftarPIC[kodePIC];

    if(!pic)
        return null;

    repository.assignPIC(
        ticket.id,
        pic
    );

    return {

        ticket,

        pic

    };

}

const daftarPIC = {

    GL: "Galih",
    GALIH: "Galih",

    SW: "Suwito",
    SUWITO: "Suwito",

    RP: "Rifaldo",
    RIFALDO: "Rifaldo",

    KA: "Andi",
    ANDI: "Andi",

    IW: "Iwan",
    IWAN: "Iwan",

    HL: "Hilmi",
    HILMI: "Hilmi"

};

function assign(ticketId, kodePIC){

    const pic =
        daftarPIC[kodePIC];

    if(!pic)
        return null;

    repository.assignPIC(

        ticketId,

        pic

    );

    return pic;

}

module.exports = {

    assign,

    assignByNomor

};