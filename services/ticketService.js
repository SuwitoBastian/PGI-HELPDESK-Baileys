const repository =
    require('../repositories/ticketRepository');

const generateTicketId =
    require('../utils/idGenerator');

const { nowWIB } =
    require("../utils/dateTime");

const operationalRotationService =
    require("./operationalRotationService");

function create(data){

    const ticket = {

        id:
            generateTicketId(),

        nama:
            data.nama,

        nomor:
            data.nomor,

        chatId:
            data.chatId,

        cabang:
            data.cabang,

        kendala:
            data.kendala,

        waktu:
            data.waktu instanceof Date
                ? data.waktu.toISOString()
                : data.waktu || nowWIB(),

        assignmentGroup:
            data.assignmentGroup,

        engineerTeam:
            operationalRotationService.getPrimaryTeam()

    };

    repository.create(ticket);

    console.log(

        "✅ Ticket",

        ticket.id,

        "dibuat"

    );

    return ticket;

}

module.exports = {

    create

};