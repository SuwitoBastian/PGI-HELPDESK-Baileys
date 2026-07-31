import { useEffect, useMemo, useState } from "react";
import useToast from "../hooks/useToast";
import { assignPIC, closeTicket, openTicket } from "../api";

import TicketToolbar from "./helpdesk/TicketToolbar";
import TicketList from "./helpdesk/TicketList";
import TicketInspector from "./helpdesk/TicketInspector";
import TicketPagination from "./helpdesk/TicketPagination";

export default function TicketTable({ tickets = [], statusFilter = 'ALL', picList = [], onChanged, onRefresh }) {
  const toast = useToast();
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(() => Number(localStorage.getItem('page')) || 0)
  const [busyId, setBusyId] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tickets.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false
      if (!q) return true
      return [t.id, t.cabang, t.nama, t.nomor, t.kendala, t.pic, t.status]
        .map((v) => (v == null ? '' : String(v)).toLowerCase())
        .some((v) => v.includes(q))
    })
  }, [tickets, search, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pageCount - 1)

  useEffect(() => {
    localStorage.setItem('page', String(current))
  }, [current])

  // Reset ke halaman awal saat filter/tab/search berubah
  useEffect(() => {
    setPage(0)
  }, [statusFilter])

  const rows = filtered.slice(current * pageSize, current * pageSize + pageSize)
useEffect(() => {

    if (!rows.length) {
        setSelectedTicket(null);
        return;
    }

    if (!selectedTicket) {
        setSelectedTicket(rows[0]);
        return;
    }

    const latest = rows.find(
        (r) => r.id === selectedTicket.id
    );

    if (latest) {

        setSelectedTicket(latest);

    } else {

        setSelectedTicket(rows[0]);

    }

}, [rows, selectedTicket]);

async function run(id, fn, successMessage = null) {

    try {

        setBusyId(id);

        const result = await fn();

        await onChanged?.();

        if (successMessage) {

            toast.success(
                "Berhasil",
                successMessage
            );

        }

        return result;

    } catch (e) {

        toast.error(
            "Gagal",
            e.message || "Terjadi kesalahan."
        );

        throw e;

    } finally {

        setBusyId(null);

    }

}

  function handleAssign(ticket, pic) {
    if (!pic) return
    run(ticket.id, () => assignPIC(ticket.id, pic))
  }

  function handleClose(ticket) {

      return run(
          ticket.id,
          () => closeTicket(ticket.id),
          "Ticket berhasil diselesaikan."
      );

  }

  function handleReopen(ticket) {
    run(
      ticket.id,
      () => openTicket(ticket.id),
      "Ticket berhasil dibuka kembali."
    );
  }

  return (
<section className="panel">

    <TicketToolbar

        search={search}

        setSearch={(value) => {

            setSearch(value);
            setPage(0);

        }}

        total={filtered.length}

        onRefresh={onRefresh}

    />

    <div className="ticket-workspace">

        <div className="ticket-workspace-left">

            <TicketList

                rows={rows}

                selectedTicket={selectedTicket}

                onSelect={setSelectedTicket}

                busyId={busyId}

                picList={picList}

                onAssign={handleAssign}

                onClose={handleClose}

                onReopen={handleReopen}

            />

        </div>

        <div className="ticket-workspace-right">

            <TicketInspector

                ticket={selectedTicket}

                picList={picList}

                busy={busyId === selectedTicket?.id}

                onAssign={handleAssign}

                onClose={handleClose}

                onReopen={handleReopen}

            />

        </div>

    </div>

    <TicketPagination

        page={current + 1}

        setPage={(p) => setPage(p - 1)}

        pageSize={pageSize}

        setPageSize={(size) => {

            setPageSize(size);

            setPage(0);

        }}

        totalRows={filtered.length}

    />

</section>
  )
}
