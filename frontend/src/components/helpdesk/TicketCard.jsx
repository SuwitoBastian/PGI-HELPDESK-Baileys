import React from "react";
import {
    fmt,
    statusBadge,
    slaClass,
    truncate,
    initials,
    formatDuration
} from "./helpers";

function TicketCard({

    ticket,
    active,
    onClick

}) {

    const badge = statusBadge(ticket.status);

    const displayPIC =
        ticket.status === "CLOSED"
            ? (ticket.pic_selesai || ticket.pic)
            : ticket.pic;

    const picName =
        displayPIC && displayPIC.trim()
            ? displayPIC
            : "Belum Assign";

    const avatar =
        displayPIC && displayPIC.trim()
            ? initials(displayPIC)
            : "?";
        return (

        <article
            className={`ticket-card ${active ? "active" : ""}`}
            onClick={onClick}
        >

            <header className="ticket-card-header">

                <div className="ticket-card-left">

                    <span className={`status-badge ${badge.cls}`}>
                        {badge.label}
                    </span>

                    <span
                        className={`sla-chip ${slaClass(ticket.durasi)}`}
                    >
                        {formatDuration(ticket.durasi)}
                    </span>

                </div>

                <span className="ticket-id">
                    #{ticket.id}
                </span>

            </header>

            <div className="ticket-problem">

                {truncate(ticket.kendala)}

            </div>

            <div className="ticket-meta">

                <div className="ticket-meta-item">

                    <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M3 21h18" />
                        <path d="M5 21V7l8-4 6 3v15" />
                    </svg>

                    <span>

                        {ticket.cabang || "-"}

                    </span>

                </div>

                <div className="ticket-meta-item">

                    <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M20 21V19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>

                    <span>

                        {ticket.nama || "-"}

                    </span>

                </div>

            </div>

            <footer className="ticket-footer">

                <div className="ticket-pic">

                    <div className="ticket-avatar">

                        {avatar}

                    </div>

                    <div className="ticket-pic-info">

                        <small>

                            PIC

                        </small>

                        <strong>

                            {picName}

                        </strong>

                    </div>

                </div>

                <div className="ticket-time">

                    {fmt(ticket.waktu)}

                </div>

            </footer>

        </article>

    );

}

export default TicketCard;