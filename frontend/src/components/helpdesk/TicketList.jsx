import React from "react";
import TicketCard from "./TicketCard";

function TicketList({

    rows = [],

    selectedTicket,

    onSelect

}) {

    if (rows.length === 0) {

        return (

            <div className="ticket-list-empty">

                <div className="empty-emoji">
                    📭
                </div>

                <h3>
                    Tidak ada ticket
                </h3>

                <p>
                    Tidak ada data yang sesuai dengan filter.
                </p>

            </div>

        );

    }

    return (

        <div className="ticket-list">

            {rows.map((ticket) => (

                <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    active={selectedTicket?.id === ticket.id}
                    onClick={() => onSelect(ticket)}
                />

            ))}

        </div>

    );

}

export default TicketList;