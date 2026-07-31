import React from "react";

function TicketToolbar({

    search,
    setSearch,
    total,
    onRefresh

}) {

    return (

        <div className="ticket-toolbar">

            <div className="toolbar-left">

                <h2>

                    Helpdesk Ticket

                    <span className="ticket-count">

                        {total} Ticket

                    </span>

                </h2>

            </div>

            <div className="toolbar-right">

                <div className="toolbar-search">

                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="7"/>
                        <line x1="20" y1="20" x2="16.5" y2="16.5"/>
                    </svg>

                    <input
                        type="text"
                        placeholder="Cari ticket..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                    />

                </div>

                <button
                    className="toolbar-refresh"
                    onClick={onRefresh}
                >
                    ↻ Refresh
                </button>

            </div>

        </div>

    );

}

export default TicketToolbar;