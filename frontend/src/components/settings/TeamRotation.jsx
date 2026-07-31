import { useEffect, useState } from "react";

const MONTHS = [

    "",

    "January",

    "February",

    "March",

    "April",

    "May",

    "June",

    "July",

    "August",

    "September",

    "October",

    "November",

    "December"

];

export default function TeamRotation() {

    const [loading, setLoading] = useState(true);

    const [current, setCurrent] = useState(null);

    const [next, setNext] = useState(null);

    const [schedule, setSchedule] = useState([]);

    const [primaryTeam, setPrimaryTeam] = useState("");

    const [backupTeam, setBackupTeam] = useState("");

    async function loadRotation() {

        try {

            setLoading(true);

            const res = await fetch("/api/operational-rotation");

            if (!res.ok) {

                throw new Error(
                    "Gagal mengambil data Team Rotation."
                );

            }

            const data = await res.json();

            setCurrent(data.current);

            setNext(data.next);

            setPrimaryTeam(
                data.next?.primaryTeam ?? ""
            );

            setBackupTeam(
                data.next?.backupTeam ?? ""
            );

            setSchedule(data.schedule);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

async function saveRotation() {

    try {

        const confirmed = window.confirm(
            `Apply Operational Rotation?\n\n` +
            `Period        : ${MONTHS[next.month]} ${next.year}\n` +
            `Primary Team : ${current.backupTeam}\n` +
            `Backup Team  : ${current.primaryTeam}\n\n` +
            `This action will update the operational schedule.`
        );

        if (!confirmed) {
            return;
        }

        const res = await fetch(
            "/api/operational-rotation/update",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    year: next.year,
                    month: next.month,
                    primaryTeam: current.backupTeam,
                    backupTeam: current.primaryTeam
                })
            }
        );

        const result = await res.json();

        if (!res.ok || !result.success) {
            throw new Error(
                result.message ||
                "Failed to apply Operational Rotation."
            );
        }

        alert(
            `Operational Rotation has been applied.\n\n` +
            `Primary Team : ${current.backupTeam}\n` +
            `Backup Team  : ${current.primaryTeam}`
        );

        await loadRotation();

    } catch (err) {

        alert(err.message);

    }

}

    useEffect(() => {

        loadRotation();

    }, []);

    if (loading) {

        return (

            <div className="state">

                Memuat Team Rotation...

            </div>

        );

    }

    const currentPeriod = current
    ? `${current.year}-${current.month}`
    : "";

    const nextPeriod = next
    ? `${next.year}-${next.month}`
    : "";

    return (

                <div className="page-content">

            <div className="page-header">

                <div className="page-header-icon">

                    <i className="bi bi-grid"></i>

                </div>

                <div>

                    <h1 className="page-title">

                        Operational Settings

                    </h1>

                    <p className="page-subtitle">

                        Konfigurasi Team Rotation.

                    </p>

                </div>

            </div>

            <div className="settings-content">

                <h2 className="settings-title">

                    Operational Settings

                </h2>

                <p className="settings-subtitle">

                    Team Rotation

                </p>

                <div className="rotation-grid">

                    {/* Current Operational */}

                    <div className="rotation-card">

                        <div className="rotation-card-header">

                            <h3>

                                Current Operational

                            </h3>
                            
                            <span className="rotation-status active">

                                ACTIVE

                            </span>

                        </div>

                        <div className="rotation-card-body">

                            <div className="rotation-row">

                                <span>Period</span>

                                <strong>

                                    {current
                                        ? `${MONTHS[current.month]} ${current.year}`
                                        : "-"}

                                </strong>

                            </div>

                            <div className="rotation-row">

                                <span>Primary Team</span>

                                <span
                                    className={`badge ${
                                        current?.primaryTeam === "TEAM_A"
                                            ? "badge-team-a"
                                            : "badge-team-b"
                                    }`}
                                >

                                    {current?.primaryTeam ?? "-"}

                                </span>

                            </div>

                            <div className="rotation-row">

                                <span>Backup Team</span>

                                <span
                                    className={`badge ${
                                        current?.backupTeam === "TEAM_A"
                                            ? "badge-team-a"
                                            : "badge-team-b"
                                    }`}
                                >

                                    {current?.backupTeam ?? "-"}

                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Next Operational */}

                        <div className="rotation-card">

                        <div className="rotation-card-header">

                            <h3>

                                Next Operational

                            </h3>

                            <span className="rotation-status next">
                                NEXT
                            </span>

                        </div>

                        <div className="rotation-card-body">

                            <div className="rotation-row">

                                <span>Period</span>

                                <strong>

                                    {next
                                        ? `${MONTHS[next.month]} ${next.year}`
                                        : "-"}

                                </strong>

                            </div>

                            <div className="rotation-row">

                                <span>Primary Team</span>

                                <span
                                    className={`badge ${
                                        primaryTeam === "TEAM_A"
                                            ? "badge-team-a"
                                            : "badge-team-b"
                                    }`}
                                >
                                    {primaryTeam || "-"}
                                </span>

                            </div>

                            <div className="rotation-row">

                                <span>Backup Team</span>

                                <span
                                    className={`badge ${
                                        backupTeam === "TEAM_A"
                                            ? "badge-team-a"
                                            : "badge-team-b"
                                    }`}
                                >
                                    {backupTeam || "-"}
                                </span>

                            </div>

                            <hr />

                            <div className="rotation-actions">

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={saveRotation}
                                >

                                    <i className="bi bi-save"></i>

                                    <span>

                                        Update Next Rotation

                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Rotation Schedule */}

                                <div className="rotation-card">

                    <div className="rotation-card-header">

                        <h3>

                            Rotation Schedule

                        </h3>

                    </div>

                    <div className="rotation-card-body">

                        <div className="table-responsive">

                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>Year</th>

                                        <th>Month</th>

                                        <th>Status</th>

                                        <th>Primary Team</th>

                                        <th>Backup Team</th>

                                        <th>Updated By</th>

                                        <th>Updated At</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {schedule.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="text-center"
                                            >
                                                No rotation schedule available.
                                            </td>

                                        </tr>

                                    ) : (

                                        schedule.map((item) => (

                                            <tr key={`${item.year}-${item.month}`}>

                                                <td>
                                                    {item.year}
                                                </td>

                                                <td>
                                                    {MONTHS[item.month]}
                                                </td>

                                                <td>

                                                    {current &&
                                                    item.year === current.year &&
                                                    item.month === current.month ? (

                                                        <span className="rotation-status active">
                                                            ACTIVE
                                                        </span>

                                                    ) : next &&
                                                    item.year === next.year &&
                                                    item.month === next.month ? (

                                                        <span className="rotation-status next">
                                                            NEXT
                                                        </span>

                                                    ) : (

                                                        <span className="rotation-status scheduled">
                                                            SCHEDULED
                                                        </span>

                                                    )}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge ${
                                                            item.primary_team === "TEAM_A"
                                                                ? "badge-team-a"
                                                                : "badge-team-b"
                                                        }`}
                                                    >
                                                        {item.primary_team}
                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge ${
                                                            item.backup_team === "TEAM_A"
                                                                ? "badge-team-a"
                                                                : "badge-team-b"
                                                        }`}
                                                    >
                                                        {item.backup_team}
                                                    </span>

                                                </td>

                                                <td>
                                                    {item.updated_by || "-"}
                                                </td>

                                                <td>
                                                    {item.updated_at
                                                        ? new Date(item.updated_at).toLocaleString()
                                                        : "-"}
                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}