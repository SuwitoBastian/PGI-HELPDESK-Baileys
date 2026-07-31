import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import TicketToolbar from "./TicketToolbar";
import TicketList from "./TicketList";
import TicketInspector from "./TicketInspector";
import TicketPagination from "./TicketPagination";

import {
    assignPIC,
    closeTicket,
    openTicket
} from "../../services/api";

function TicketWorkspace({

    rows = [],

    refresh

}) {

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(25);

    const [selectedTicket, setSelectedTicket] = useState(null);

    const [busyId, setBusyId] = useState(null);
        const filteredRows = useMemo(() => {

        const keyword = search.toLowerCase();

        return rows.filter((ticket) => {

            return (

                String(ticket.id)
                    .includes(keyword)

                ||

                (ticket.nama || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (ticket.cabang || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (ticket.kendala || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (ticket.pic || "")
                    .toLowerCase()
                    .includes(keyword)

            );

        });

    }, [rows, search]);
        const pagedRows = useMemo(() => {

        const start = (page - 1) * pageSize;

        return filteredRows.slice(

            start,

            start + pageSize

        );

    }, [

        filteredRows,

        page,

        pageSize

    ]);
        useEffect(() => {

        if (!pagedRows.length) {

            setSelectedTicket(null);

            return;

        }

        if (!selectedTicket) {

            setSelectedTicket(pagedRows[0]);

            return;

        }

        const current = pagedRows.find(

            x => x.id === selectedTicket.id

        );

        if (!current) {

            setSelectedTicket(

                pagedRows[0]

            );

            return;

        }

        setSelectedTicket(current);

    }, [

        pagedRows,

        selectedTicket

    ]);
    async function handleAssign(ticket) {

        try {

            setBusyId(ticket.id);

            await assignPIC(ticket.id);

            await refresh();

        } finally {

            setBusyId(null);

        }

    }

    async function handleDone(ticket) {

        try {

            setBusyId(ticket.id);

            await closeTicket(ticket.id);

            await refresh();

        } finally {

            setBusyId(null);

        }

    }

    async function handleReopen(ticket) {

        try {

            setBusyId(ticket.id);

            await openTicket(ticket.id);

            await refresh();

        } finally {

            setBusyId(null);

        }

    }

    return (

        <section className="ticket-page">

            <TicketToolbar

                search={search}

                setSearch={setSearch}

                total={filteredRows.length}

                onRefresh={refresh}

            />

            <div className="ticket-workspace">

                <div className="ticket-workspace-left">

                    <TicketList

                        rows={pagedRows}

                        selectedTicket={selectedTicket}

                        onSelect={setSelectedTicket}

                    />

                    <TicketPagination

                        page={page}

                        setPage={setPage}

                        pageSize={pageSize}

                        setPageSize={setPageSize}

                        totalRows={filteredRows.length}

                    />

                </div>

                <div className="ticket-workspace-right">

                    <TicketInspector

                        ticket={selectedTicket}

                        busy={busyId === selectedTicket?.id}

                        onAssign={handleAssign}

                        onDone={handleDone}

                        onReopen={handleReopen}

                    />

                </div>

            </div>

        </section>

    );

}

export default TicketWorkspace;