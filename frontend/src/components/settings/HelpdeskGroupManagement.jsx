import { useEffect, useState } from "react";
import { RefreshCw, UsersRound } from "lucide-react";

export default function HelpdeskGroupManagement() {

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [togglingId, setTogglingId] = useState(null);

    /* ==========================================================
       LOAD GROUPS
    ========================================================== */

    async function loadGroups() {

        try {

            setLoading(true);
            setError("");

            const res =
                await fetch("/api/helpdesk-groups");

            const result =
                await res.json();

            if (!res.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Gagal memuat grup Helpdesk."
                );

            }

            setGroups(
                result.groups || []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Gagal memuat grup Helpdesk."
            );

        } finally {

            setLoading(false);

        }

    }

    /* ==========================================================
       TOGGLE GROUP
    ========================================================== */

    async function toggleGroup(id) {

        try {

            setTogglingId(id);
            setError("");

            const res =
                await fetch(
                    `/api/helpdesk-groups/${id}/toggle`,
                    {
                        method: "POST"
                    }
                );

            const result =
                await res.json();

            if (!res.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Gagal mengubah status grup."
                );

            }

            setGroups(prev =>
                prev.map(group =>
                    group.id === id
                        ? result.group
                        : group
                )
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Gagal mengubah status grup."
            );

        } finally {

            setTogglingId(null);

        }

    }

    /* ==========================================================
       INITIAL LOAD
    ========================================================== */

    useEffect(() => {

        loadGroups();

    }, []);

    /* ==========================================================
       LOADING
    ========================================================== */

    if (loading) {

        return (

            <div className="page-card">

                <div className="state loading">
                    Memuat grup Helpdesk...
                </div>

            </div>

        );

    }

    /* ==========================================================
       RENDER
    ========================================================== */

    return (

        <div className="page-card">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "24px",
                    gap: "20px"
                }}
            >

                <div>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "var(--text-primary, #0f172a)",
                            letterSpacing: "-0.5px"
                        }}
                    >
                        Manajemen Grup Helpdesk
                    </h2>

                    <p
                        style={{
                            margin: "7px 0 0",
                            fontSize: "15px",
                            color: "var(--text-secondary, #64748b)"
                        }}
                    >
                        Atur grup WhatsApp yang aktif untuk menerima
                        pemrosesan Helpdesk.
                    </p>

                </div>

                {/* ==================================================
                    REFRESH
                ================================================== */}

                <button
                    type="button"
                    onClick={loadGroups}
                    disabled={loading}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        height: "42px",
                        padding: "0 17px",
                        border: "none",
                        borderRadius: "9px",
                        background: "#2563eb",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: loading
                            ? "wait"
                            : "pointer",
                        boxShadow:
                            "0 3px 8px rgba(37, 99, 235, 0.22)",
                        transition:
                            "all 0.2s ease",
                        opacity: loading ? 0.65 : 1,
                        flexShrink: 0
                    }}
                    onMouseEnter={e => {
                        if (!loading) {
                            e.currentTarget.style.background =
                                "#1d4ed8";
                        }
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background =
                            "#2563eb";
                    }}
                >

                    <RefreshCw
                        size={16}
                        strokeWidth={2.2}
                    />

                    Refresh

                </button>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div
                    className="state error"
                    style={{
                        marginBottom: "16px"
                    }}
                >
                    ⚠️ {error}
                </div>

            )}

            {/* ==================================================
                GROUP LIST
            ================================================== */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}
            >

                {groups.map(group => (

                    <div
                        key={group.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            minHeight: "76px",
                            padding: "12px 18px",
                            border:
                                "1px solid var(--border-color, #e5e7eb)",
                            borderRadius: "11px",
                            background:
                                "var(--card-bg, #ffffff)",
                            transition:
                                "border-color 0.2s ease, box-shadow 0.2s ease"
                        }}
                    >

                        {/* ==================================================
                            GROUP INFO
                        ================================================== */}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                minWidth: 0
                            }}
                        >

                            {/* GROUP ICON */}

                            <div
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    minWidth: "42px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background:
                                        group.enabled
                                            ? "rgba(37, 99, 235, 0.10)"
                                            : "rgba(100, 116, 139, 0.10)",
                                    color:
                                        group.enabled
                                            ? "#2563eb"
                                            : "#94a3b8",
                                    transition:
                                        "all 0.2s ease"
                                }}
                            >

                                <UsersRound
                                    size={21}
                                    strokeWidth={2}
                                />

                            </div>

                            {/* TEXT */}

                            <div
                                style={{
                                    minWidth: 0
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: 650,
                                        lineHeight: "22px",
                                        color:
                                            "var(--text-primary, #0f172a)"
                                    }}
                                >
                                    {group.groupName}
                                </div>
                                
                            </div>

                        </div>

                        {/* ==================================================
                            TOGGLE
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() =>
                                toggleGroup(group.id)
                            }
                            disabled={
                                togglingId === group.id
                            }
                            aria-label={
                                `Ubah status ${group.groupName}`
                            }
                            aria-pressed={
                                group.enabled
                            }
                            style={{
                                position: "relative",
                                width: "54px",
                                height: "30px",
                                padding: 0,
                                border: "none",
                                borderRadius: "999px",
                                background:
                                    group.enabled
                                        ? "#2563eb"
                                        : "#cbd5e1",
                                cursor:
                                    togglingId === group.id
                                        ? "wait"
                                        : "pointer",
                                transition:
                                    "background 0.2s ease",
                                opacity:
                                    togglingId === group.id
                                        ? 0.65
                                        : 1,
                                flexShrink: 0
                            }}
                        >

                            <span
                                style={{
                                    position: "absolute",
                                    top: "4px",
                                    left:
                                        group.enabled
                                            ? "28px"
                                            : "4px",
                                    width: "22px",
                                    height: "22px",
                                    borderRadius: "50%",
                                    background: "#ffffff",
                                    transition:
                                        "left 0.2s ease",
                                    boxShadow:
                                        "0 1px 4px rgba(15, 23, 42, 0.20)"
                                }}
                            />

                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}