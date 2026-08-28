import React, { useState } from "react";
import {
    fmt,
    statusBadge,
    formatDuration
} from "./helpers";

import ConfirmDialog from "../dialogs/ConfirmDialog";
import { Loader2 } from "lucide-react";

function TicketInspector({

    ticket,

    picList = [],

    onAssign,

    onClose,

    onReopen,

    busy

}) {

    const [dialog, setDialog] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    action: null
    });

    function openCloseDialog() {

    setDialog({

        open: true,

        type: "success",

        title: "Selesaikan Ticket",

        message: "Ticket ini akan dipindahkan ke status CLOSED.",

        action: "close"

    });

    }

    function openReopenDialog() {

        setDialog({

            open: true,

            type: "info",

            title: "Reopen Ticket",

            message: "Ticket ini akan dikembalikan ke status PROCESS.",

            action: "reopen"

        });

    }

    function closeDialog() {

        setDialog(prev => ({

            ...prev,

            open: false

        }));

    }

    if (!ticket) {

        return (

            <aside className="ticket-inspector empty">

                <div className="empty-icon">

                    📭

                </div>

                <h3>

                    Belum ada ticket dipilih

                </h3>

                <p>

                    Pilih salah satu ticket di sebelah kiri
                    untuk melihat detail dan melakukan action.

                </p>

            </aside>

        );

    }
    const badge = statusBadge(ticket.status);

    return (

        <aside className="ticket-inspector">

            <div className="inspector-header">

                <div>

                    <small>

                        Ticket

                    </small>

                    <h2>

                        #{ticket.id}

                    </h2>

                </div>

                <span className={`status-badge ${badge.cls}`}>

                    {badge.label}

                </span>

            </div>

            <section className="inspector-card problem-section">

                <label>

                    Kendala

                </label>

                <div className="problem-box">

                    {ticket.kendala}

                </div>

            </section>

            <section className="inspector-card info-section">

                <label>

                    Informasi Ticket

                </label>

                <div className="info-grid">

                    <div className="info-row">

                        <span>

                            Cabang

                        </span>

                        <strong>

                            {ticket.cabang || "-"}

                        </strong>

                    </div>

                    <div className="info-row">

                        <span>

                            Pelapor

                        </span>

                        <strong>

                            {ticket.nama || "-"}

                        </strong>

                    </div>

                    <div className="info-row">

                        <span>

                            Nomor

                        </span>

                        <strong className="info-phone">

                            {ticket.nomor || "-"}

                        </strong>

                    </div>

                    <div className="info-row">

                        <span>

                            PIC Assignment

                        </span>

                        <strong>

                            {ticket.pic || "-"}

                        </strong>

                    </div>
                    {ticket.status === "CLOSED" && (

                        <div className="info-row">

                            <span>
                                PIC Penyelesai
                            </span>

                            <strong>
                                {ticket.pic_selesai || "-"}
                            </strong>

                        </div>

                    )}

                    <div className="info-row">

                        <span>

                            Dibuat

                        </span>

                        <strong className="info-date">

                            {fmt(ticket.waktu)}

                        </strong>

                    </div>

                    <div className="info-row">

                        <span>

                            SLA

                        </span>

                        <strong className="info-sla">

                            {formatDuration(ticket.durasi)}

                        </strong>

                    </div>

                </div>

            </section>
            <section className="inspector-card action-section">

                <label>
                    Aksi
                </label>

                <div className="action-buttons">

                    {ticket.status !== "CLOSED" && (

                        <select
                            value={ticket?.pic || ""}
                            disabled={busy}
                            onChange={(e) => {

                                if (!e.target.value) return;

                                onAssign(ticket, e.target.value);

                                e.target.value = "";

                            }}
                        >

                            <option value="">
                                PIC...
                            </option>

                            {picList.map((pic) => (

                                <option
                                    key={pic}
                                    value={pic}
                                >
                                    {pic}
                                </option>

                            ))}

                        </select>

                    )}

                    {ticket.status !== "CLOSED" && (

                        <button
                            className="btn btn-success"
                            disabled={busy}
                            onClick={openCloseDialog}
                        >
                            {busy ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="spin"
                                    />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    ✔ Tandai Selesai
                                </>
                            )}
                        </button>

                    )}

                    {ticket.status === "CLOSED" && (

                        <button
                            className="btn btn-warning"
                            disabled={busy}
                            onClick={openReopenDialog}
                        >
                            {busy ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="spin"
                                    />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    ↺ Reopen Ticket
                                </>
                            )}
                        </button>

                    )}

                </div>

            </section>
        <ConfirmDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        confirmText={
        dialog.action === "close"
            ? "Selesaikan"
            : "Reopen"
    }
    cancelText="Batal"
    loading={busy}
    onCancel={closeDialog}

    onConfirm={async () => {

        try {

            if (dialog.action === "close") {

                await onClose(ticket);

            }

            if (dialog.action === "reopen") {

                await onReopen(ticket);

            }

            closeDialog();

        } catch {

            // toast sudah ditangani TicketTable

        }

    }}
    >
        <div className="dialog-ticket-info">

            <div className="dialog-info-row">
                <span className="dialog-label">Ticket</span>
                <span className="dialog-value">{ticket.id}</span>
            </div>

            <div className="dialog-info-row">
                <span className="dialog-label">Cabang</span>
                <span className="dialog-value">{ticket.cabang}</span>
            </div>

            <div className="dialog-info-row">
                <span className="dialog-label">PIC</span>
                <span className="dialog-value">{ticket.pic || "-"}</span>
            </div>

        </div>

</ConfirmDialog>
        </aside>

    );

}

export default TicketInspector;