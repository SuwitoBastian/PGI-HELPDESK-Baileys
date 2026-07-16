const repository =
    require('../repositories/ticketRepository');

const generateTicketId =
    require('../utils/idGenerator');

const { nowWIB } =
    require("../utils/dateTime");

function create(data){

    const ticket={

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
            nowWIB(),

        assignmentGroup:
            data.assignmentGroup

    };

    repository.create(ticket);

console.log(

    "✅ Ticket",

    ticket.id,

    "dibuat"

);

return ticket;

}

module.exports={

    create

};