import { useEffect, useState } from "react";

import useToast from "../../hooks/useToast";
import ConfirmDialog from "../dialogs/ConfirmDialog";

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

function teamLabel(team) {

    switch (team) {

        case "TEAM_A":
            return "HO - AKR Tower";

        case "TEAM_B":
            return "Head Office";

        default:
            return team;

    }

}

export default function TeamRotation() {

    const toast = useToast();

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: "info",
        title: "",
        message: "",
        confirmText: "Simpan",
        cancelText: "Batal",
        action: null
    });

    const [confirmLoading, setConfirmLoading] =
        useState(false);

    const [loading, setLoading] = useState(true);

    const [current, setCurrent] = useState(null);

    const [next, setNext] = useState(null);

    const [schedule, setSchedule] = useState([]);

    const [engineers, setEngineers] = useState([]);

    const [assignedAKR, setAssignedAKR] = useState([]);

    const [akrEngineers, setAkrEngineers] = useState([]);

    const [headOfficeEngineers, setHeadOfficeEngineers] = useState([]);

    const [nextAKREngineers, setNextAKREngineers] = useState([]);

    const [nextHeadOfficeEngineers, setNextHeadOfficeEngineers] = useState([]);

    const [primaryTeam, setPrimaryTeam] = useState("");

    const [backupTeam, setBackupTeam] = useState("");

    const [showAddEngineer, setShowAddEngineer] =
    useState(false);

    const [newEngineer, setNewEngineer] =
        useState({

            code: "",

            name: ""

        });
    const [editMode, setEditMode] =
        useState(false);

    const [selectedRotationId, setSelectedRotationId] =
    useState(null);

    const [showScheduleAssignment, setShowScheduleAssignment] =
    useState(false);

    const [scheduleAssignment, setScheduleAssignment] =
        useState({
            year: null,
            month: null,
            location: "",
            engineers: []
        });

    const [scheduleAssignmentLoading, setScheduleAssignmentLoading] =
        useState(false);

    const [scheduleAssignments, setScheduleAssignments] =
        useState({});

async function loadRotation() {

    try {

        setLoading(true);

        const res =
            await fetch(
                "/api/operational-rotation"
            );

        if (!res.ok) {

            throw new Error(
                "Gagal mengambil data Team Rotation."
            );

        }

        const data =
            await res.json();

        setCurrent(
            data.current
        );

        setNext(
            data.next
        );

        setPrimaryTeam(
            data.next?.primaryTeam ?? ""
        );

        setBackupTeam(
            data.next?.backupTeam ?? ""
        );

        setSchedule(
            data.schedule || []
        );

        await loadScheduleAssignments(
            data.schedule || []
        );

        setEngineers(
            data.engineers || []
        );

        setSelectedRotationId(
            data.current?.id ?? null
        );

        await handleRotationChange({

            target: {

                value: data.current.id

            }

        });

        // ============================
        // Load Assignment
        // ============================

        if (data.next?.id) {

            await loadAssignment(

                data.next.id,

                true

            );

        }

    }

    catch (err) {

        console.error(err);

    }

    finally {

        setLoading(false);

    }

}

async function loadAssignment(
    rotationId,
    isNext = false
) {

    try {

        const res =
            await fetch(

                rotationId
                    ? `/api/operational-assignment/${rotationId}`
                    : "/api/operational-assignment/current"

            );

        if (!res.ok) {

            throw new Error(
                "Gagal mengambil Assignment."
            );

        }

        const data =
            await res.json();

        if (isNext) {

            setNextAKREngineers(
                data.akr || []
            );

            setNextHeadOfficeEngineers(
                data.headOffice || []
            );

        }

        else {

            setAkrEngineers(
                data.akr || []
            );

            setHeadOfficeEngineers(
                data.headOffice || []
            );

            setAssignedAKR(

                (data.akr || [])
                    .map(engineer => engineer.code)

            );

        }

    }

    catch (err) {

        console.error(err);

    }

}

async function loadScheduleAssignments(scheduleList) {

    try {

        const assignments = {};

        await Promise.all(
            scheduleList.map(async (rotation) => {

                try {

                    const res = await fetch(
                        `/api/operational-assignment/${rotation.id}`
                    );

                    if (!res.ok) {
                        return;
                    }

                    const data = await res.json();

                    assignments[rotation.id] = {
                        akr: data.akr || [],
                        headOffice: data.headOffice || []
                    };

                } catch (err) {

                    console.error(
                        `Gagal load assignment rotation ${rotation.id}`,
                        err
                    );

                    assignments[rotation.id] = {
                        akr: [],
                        headOffice: []
                    };

                }

            })
        );

        setScheduleAssignments(assignments);

    } catch (err) {

        console.error(
            "Gagal mengambil seluruh assignment schedule:",
            err
        );

    }

}

function openScheduleAssignment(item, location) {

    try {

        setScheduleAssignmentLoading(true);

        setShowScheduleAssignment(true);

        const assignment =
            scheduleAssignments[item.id] || {
                akr: [],
                headOffice: []
            };

        const engineers =
            location === "AKR"
                ? assignment.akr
                : assignment.headOffice;

        setScheduleAssignment({

            year: item.year,

            month: item.month,

            location,

            engineers

        });

    } catch (err) {

        console.error(
            "Gagal membuka assignment:",
            err
        );

        setScheduleAssignment({

            year: item.year,

            month: item.month,

            location,

            engineers: []

        });

    } finally {

        setScheduleAssignmentLoading(false);

    }

}

function saveRotation() {

    if (!next || !current) {
        return;
    }

    setConfirmDialog({

        open: true,

        type: "info",

        title:
            "Terapkan Rotasi Operasional ?",

        message:
            `Periode        : ${MONTHS[next.month]} ${next.year}\n` +
            `PIC : ${teamLabel(current.backupTeam)}\n` +
            `Tim Backup : ${teamLabel(current.primaryTeam)}\n\n` +
            `Tindakan ini akan memperbarui jadwal operasional.`,

        confirmText:
            "Konfirmasi",

        cancelText:
            "Batal",

        action:
            applyRotation

    });

}

async function applyRotation() {

    try {

        setConfirmLoading(true);

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
                "Gagal menerapkan Operational Rotation."
            );
        }

        setConfirmDialog(prev => ({
            ...prev,
            open: false,
            action: null
        }));

        toast.success(
            "Operational Rotation",
            `Operational Rotation berhasil diterapkan.\n` +
            `PIC: ${current.backupTeam}\n` +
            `Backup Team: ${current.primaryTeam}`
        );

        await loadRotation();

    } catch (err) {

        setConfirmDialog(prev => ({
            ...prev,
            open: false,
            action: null
        }));

        toast.error(
            "Operational Rotation Gagal",
            err.message ||
            "Gagal menerapkan Operational Rotation."
        );

    } finally {

        setConfirmLoading(false);

    }

}

function toggleAssignedAKR(code) {

    setAssignedAKR(previous => {

        if (previous.includes(code)) {

            return previous.filter(item => item !== code);

        }

        return [

            ...previous,

            code

        ];

    });

}

/* ==========================================================
   Handle Assignment Period
========================================================== */

async function handleRotationChange(e) {

    try {

        const rotationId =
            Number(e.target.value);

        setSelectedRotationId(
            rotationId
        );

        await loadAssignment(
            rotationId
        );

    }

    catch (err) {

        console.error(err);

    }

}

function saveAssignment() {

    if (assignedAKR.length < 3) {

        toast.warning(
            "Assignment Engineer",
            "Minimal pilih 3 engineer untuk HO - AKR Tower."
        );

        return;

    }

    const selectedSchedule =
        schedule.find(
            r => r.id === selectedRotationId
        );

    setConfirmDialog({

        open: true,

        type: "info",

        title:
            "Simpan Assignment Engineer?",

        message:
            `Periode : ${
                selectedSchedule?.month || "-"
            }/${
                selectedSchedule?.year || "-"
            }\n\n` +
            `HO - AKR Tower : ${assignedAKR.length} Engineer\n` +
            `Head Office : ${
                engineers.length - assignedAKR.length
            } Engineer`,

        confirmText:
            "Simpan",

        cancelText:
            "Batal",

        action:
            applyAssignment

    });

}

async function applyAssignment() {

    try {

        setConfirmLoading(true);

        const res = await fetch(
            "/api/operational-assignment",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    rotationId: selectedRotationId,
                    akrCodes: assignedAKR
                })
            }
        );

        const result =
            await res.json();

        if (!res.ok || !result.success) {

            throw new Error(
                result.message ||
                "Gagal menyimpan assignment."
            );

        }

        setConfirmDialog(prev => ({
            ...prev,
            open: false,
            action: null
        }));

        toast.success(
            "Assignment Engineer",
            "Assignment berhasil diperbarui."
        );

        await loadRotation();

    } catch (err) {

        setConfirmDialog(prev => ({
            ...prev,
            open: false,
            action: null
        }));

        toast.error(
            "Assignment Engineer Gagal",
            err.message ||
            "Gagal menyimpan assignment."
        );

    } finally {

        setConfirmLoading(false);

    }

}


async function saveEngineer() {

    console.log("EDIT MODE =", editMode);

    try {

        if (!newEngineer.code.trim()) {

            toast.warning(
                "Engineer",
                "Kode Engineer wajib diisi."
            );

            return;

        }

        if (!newEngineer.name.trim()) {

            toast.warning(
                "Engineer",
                "Nama Engineer wajib diisi."
            );

            return;

        }

        const url =

            editMode

                ? `/api/engineers/${newEngineer.code}`

                : "/api/engineers";

        const method =

            editMode

                ? "PUT"

                : "POST";

        const body =

            editMode

                ? {

                    name: newEngineer.name

                }

                : newEngineer;

        console.log({
            url,
            method,
            body
        });
        const res = await fetch(

            url,

            {

                method,

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(body)

            }

        );

        const result =
            await res.json();

        if (!result.success) {

            throw new Error(

                result.message

            );

        }

        toast.success(
            "Engineer",
            editMode
                ? "Engineer berhasil diperbarui."
                : "Engineer berhasil ditambahkan."
        );

        setEditMode(false);

        setShowAddEngineer(false);

        setNewEngineer({

            code: "",

            name: ""

        });

        await loadRotation();


    }

    catch (err) {

        toast.error(
            "Engineer Gagal",
            err.message ||
            "Gagal menyimpan engineer."
        );

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

    const akrMembers =
        akrEngineers;

    const hoMembers =
        headOfficeEngineers;

    const nextAKRMembers =
        nextAKREngineers;

    const nextHOMembers =
        nextHeadOfficeEngineers;

    return (

            <div className="page-content">

            <div className="settings-content">

                <h2 className="settings-title">
                    Rotasi Tim
                </h2>

                <div className="rotation-grid">

                    {/* ======================================================
                        Current Operational
                    ====================================================== */}

                    <div className="rotation-card">

                        <div className="rotation-card-header">

                            <h3>
                                Operasional Saat Ini
                            </h3>

                            <span className="rotation-status active">
                                AKTIF
                            </span>

                        </div>

                        <div className="rotation-card-body">

                            <div className="rotation-row">

                                <span>
                                    Periode
                                </span>

                                <strong>
                                    {current
                                        ? `${MONTHS[current.month]} ${current.year}`
                                        : "-"}
                                </strong>

                            </div>


                            {/* HO - AKR Tower */}

                            <div className="rotation-location-row">

                                <div className="rotation-location-title">

                                    <span className="location-icon location-akr">

                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                                            <circle cx="12" cy="10" r="2.5" />
                                        </svg>

                                    </span>

                                    <span>
                                        HO - AKR Tower
                                    </span>

                                </div>

                                <strong>
                                    {akrMembers.length} PIC
                                </strong>

                            </div>


                            <div className="rotation-engineers">

                                {akrMembers.map(engineer => (

                                    <div
                                        key={engineer.code}
                                        className="rotation-engineer"
                                    >

                                        <span className="rotation-engineer-code">
                                            {engineer.code}
                                        </span>

                                        <span className="rotation-engineer-name">
                                            {engineer.name}
                                        </span>

                                    </div>

                                ))}

                            </div>


                            {/* Head Office */}

                            <div className="rotation-location-row">

                                <div className="rotation-location-title">

                                    <span className="location-icon location-ho">

                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 21h18" />
                                            <path d="M5 21V9l7-5 7 5v12" />
                                            <path d="M9 21v-5h6v5" />
                                            <path d="M9 10h.01" />
                                            <path d="M15 10h.01" />
                                        </svg>

                                    </span>

                                    <span>
                                        Head Office
                                    </span>

                                </div>

                                <strong>
                                    {hoMembers.length} PIC
                                </strong>

                            </div>


                            <div className="rotation-engineers">

                                {hoMembers.map(engineer => (

                                    <div
                                        key={engineer.code}
                                        className="rotation-engineer"
                                    >

                                        <span className="rotation-engineer-code">
                                            {engineer.code}
                                        </span>

                                        <span className="rotation-engineer-name">
                                            {engineer.name}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>


                    {/* ======================================================
                        Next Operational
                    ====================================================== */}

                    <div className="rotation-card">

                        <div className="rotation-card-header">

                            <h3>
                                Operasional Berikutnya
                            </h3>

                            <span className="rotation-status next">
                                SELANJUTNYA
                            </span>

                        </div>

                        <div className="rotation-card-body">

                            <div className="rotation-row">

                                <span>
                                    Periode
                                </span>

                                <strong>
                                    {next
                                        ? `${MONTHS[next.month]} ${next.year}`
                                        : "-"}
                                </strong>

                            </div>


                            {/* HO - AKR Tower */}

                            <div className="rotation-location-row">

                                <div className="rotation-location-title">

                                    <span className="location-icon location-akr">

                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                                            <circle cx="12" cy="10" r="2.5" />
                                        </svg>

                                    </span>

                                    <span>
                                        HO - AKR Tower
                                    </span>

                                </div>

                                <strong>
                                    {nextAKRMembers.length} PIC
                                </strong>

                            </div>


                            <div className="rotation-engineers">

                                {nextAKRMembers.map(engineer => (

                                    <div
                                        key={engineer.code}
                                        className="rotation-engineer"
                                    >

                                        <span className="rotation-engineer-code">
                                            {engineer.code}
                                        </span>

                                        <span className="rotation-engineer-name">
                                            {engineer.name}
                                        </span>

                                    </div>

                                ))}

                            </div>


                            {/* Head Office */}

                            <div className="rotation-location-row">

                                <div className="rotation-location-title">

                                    <span className="location-icon location-ho">

                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 21h18" />
                                            <path d="M5 21V9l7-5 7 5v12" />
                                            <path d="M9 21v-5h6v5" />
                                            <path d="M9 10h.01" />
                                            <path d="M15 10h.01" />
                                        </svg>

                                    </span>

                                    <span>
                                        Head Office
                                    </span>

                                </div>

                                <strong>
                                    {nextHOMembers.length} PIC
                                </strong>

                            </div>


                            <div className="rotation-engineers">

                                {nextHOMembers.map(engineer => (

                                    <div
                                        key={engineer.code}
                                        className="rotation-engineer"
                                    >

                                        <span className="rotation-engineer-code">
                                            {engineer.code}
                                        </span>

                                        <span className="rotation-engineer-name">
                                            {engineer.name}
                                        </span>

                                    </div>

                                ))}

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
                                        Update Rotasi Berikutnya
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </div>
               {/* ======================================================
                    Engineer Management
                ====================================================== */}

                <div className="rotation-card engineer-management-card">

                    <div className="rotation-card-header">

                        <h3>

                            PIC Manajemen

                        </h3>

                        <button
                            className="btn-add-engineer"
                            onClick={() => {

                                setEditMode(false);

                                setNewEngineer({

                                    code: "",

                                    name: ""

                                });

                                setShowAddEngineer(true);

                            }}
                        >

                            + Tambah PIC

                        </button>

                    </div>

                    <div className="rotation-card-body">

                        <div className="form-group">

                            <label>

                                Periode Penugasan

                            </label>

                            <select

                                className="form-control"

                                value={selectedRotationId ?? ""}

                                onChange={handleRotationChange}

                            >

                                {schedule.map(rotation => (

                                    <option

                                        key={rotation.id}

                                        value={rotation.id}

                                    >

                                        {MONTHS[rotation.month]} {rotation.year}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="engineer-list">

                            {

                                engineers.map(engineer => (

                                    <div
                                        key={engineer.code}
                                        className="engineer-item"
                                    >

                                        <div className="engineer-info">

                                            <input
                                                className="engineer-checkbox"
                                                type="checkbox"
                                                checked={
                                                    assignedAKR.includes(
                                                        engineer.code
                                                    )
                                                }
                                                onChange={() =>
                                                   toggleAssignedAKR(
                                                        engineer.code
                                                    )
                                                }
                                            />

                                            <span className="engineer-code">

                                                {engineer.code}

                                            </span>

                                            <span className="engineer-name">

                                                {engineer.name}

                                            </span>

                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px"
                                            }}
                                        >

                                            <span
                                                className={`engineer-team ${
                                                    assignedAKR.includes(engineer.code)
                                                        ? "team-a"
                                                        : "team-b"
                                                }`}
                                            >
                                                {
                                                    assignedAKR.includes(engineer.code)
                                                        ? "HO - AKR Tower"
                                                        : "Head Office"
                                                }
                                            </span>

                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => {

                                                    setEditMode(true);

                                                    setNewEngineer({

                                                        code: engineer.code,

                                                        name: engineer.name

                                                    });

                                                    setShowAddEngineer(true);

                                                }}
                                            >

                                                <svg
                                                    width="15"
                                                    height="15"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M12 20h9" />
                                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                </svg>

                                            </button>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                        <div className="engineer-summary">

                            <div className="engineer-summary-card">

                                <div className="engineer-summary-title">

                                    HO - AKR Tower

                                </div>

                                <div className="engineer-summary-value">

                                    {assignedAKR.length} PIC

                                </div>

                            </div>

                            <div className="engineer-summary-card">

                                <div className="engineer-summary-title">

                                    Head Office

                                </div>

                                <div className="engineer-summary-value">

                                    {engineers.length - assignedAKR.length} PIC

                                </div>

                            </div>

                        </div>

                        <div className="engineer-actions">

                        <button
                            className="btn btn-primary"
                            onClick={saveAssignment}
                            disabled={assignedAKR.length < 3}
                        >

                            Simpan AKR / HO

                        </button>

                    </div>

                </div>

                </div>


                {/* Rotation Schedule */}

                <div className="rotation-card rotation-schedule-card">

                    <div className="rotation-card-header">

                        <h3>

                            Jadwal Penugasan Operasional

                        </h3>

                    </div>

                    <div className="rotation-card-body">

                        <div className="table-responsive">

                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>Tahun</th>

                                        <th>Bulan</th>

                                        <th>Status</th>

                                        <th>HO - AKR Tower</th>

                                        <th>Head Office</th>

                                        <th>Diperbarui Oleh</th>

                                        <th>Diperbarui Pada</th>

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
                                                            AKTIF
                                                        </span>

                                                    ) : next &&
                                                    item.year === next.year &&
                                                    item.month === next.month ? (

                                                        <span className="rotation-status next">
                                                            SELANJUTNYA
                                                        </span>

                                                    ) : (

                                                        <span className="rotation-status scheduled">
                                                            DIJADWALKAN
                                                        </span>

                                                    )}

                                                </td>

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="schedule-engineer-count"
                                                        onClick={() =>
                                                            openScheduleAssignment(
                                                                item,
                                                                "AKR"
                                                            )
                                                        }
                                                    >

                                                        <span className="schedule-engineer-count-number">

                                                            {
                                                                scheduleAssignments[item.id]
                                                                    ?.akr
                                                                    ?.length ?? 0
                                                            }

                                                        </span>

                                                        <span className="schedule-engineer-count-label">
                                                            PIC
                                                        </span>

                                                    </button>

                                                </td>

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="schedule-engineer-count"
                                                        onClick={() =>
                                                            openScheduleAssignment(
                                                                item,
                                                                "HO"
                                                            )
                                                        }
                                                    >

                                                        <span className="schedule-engineer-count-number">

                                                            {
                                                                scheduleAssignments[item.id]
                                                                    ?.headOffice
                                                                    ?.length ?? 0
                                                            }

                                                        </span>

                                                        <span className="schedule-engineer-count-label">
                                                            PIC
                                                        </span>

                                                    </button>

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

            {/* =====================================
                Add Engineer Modal
            ===================================== */}

            {showAddEngineer && (

                <div className="modal-backdrop">

                    <div className="engineer-modal">

                        <h3>{editMode
                                ? "Edit Engineer"
                                : "Add Engineer"}
                        </h3>

                        <div className="form-group">

                            <label>Code</label>

                            <input
                                type="text"
                                value={newEngineer.code}
                                maxLength={5}
                                disabled={editMode}
                                onChange={(e) =>
                                    setNewEngineer({
                                        ...newEngineer,
                                        code: e.target.value.toUpperCase()
                                    })
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>Name</label>

                            <input
                                type="text"
                                value={newEngineer.name}
                                onChange={(e) =>
                                    setNewEngineer({
                                        ...newEngineer,
                                        name: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="modal-actions">

                            <button
                                className="btn btn-secondary"
                                onClick={() => {

                                    setShowAddEngineer(false);

                                    setNewEngineer({

                                        code: "",

                                        name: ""

                                    });

                                }}
                            >

                                Cancel

                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={saveEngineer}
                            >

                                Save

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* =====================================
                Schedule Assignment Modal
            ===================================== */}

            {showScheduleAssignment && (

                <div
                    className="modal-backdrop"
                    onClick={() => setShowScheduleAssignment(false)}
                >

                    <div
                        className="assignment-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="assignment-modal-header">

                            <div>

                                <h3>
                                    Penugasan PIC
                                </h3>

                                <p>
                                    {MONTHS[scheduleAssignment.month]}{" "}
                                    {scheduleAssignment.year}
                                    {" Â· "}
                                    {scheduleAssignment.location === "AKR"
                                        ? "HO - AKR Tower"
                                        : "Head Office"}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="assignment-modal-close"
                                onClick={() =>
                                    setShowScheduleAssignment(false)
                                }
                            >
                                X
                            </button>

                        </div>

                        <div className="assignment-modal-body">

                            {scheduleAssignmentLoading ? (

                                <div className="assignment-empty">
                                    Loading assignment...
                                </div>

                            ) : scheduleAssignment.engineers.length === 0 ? (

                                <div className="assignment-empty">

                                    <div className="assignment-empty-icon">
                                        <i className="bi bi-person-x"></i>
                                    </div>

                                    <strong>
                                        Tidak ada data
                                    </strong>

                                    <span>
                                        Belum ada PIC yang ditugaskan
                                        pada lokasi ini untuk periode tersebut.
                                    </span>

                                </div>

                            ) : (

                                <div className="assignment-engineer-list">

                                    {scheduleAssignment.engineers.map(
                                        (engineer) => (

                                            <div
                                                key={engineer.code}
                                                className="assignment-engineer-item"
                                            >

                                                <div className="assignment-engineer-avatar">
                                                    {engineer.code}
                                                </div>

                                                <div className="assignment-engineer-info">

                                                    <strong>
                                                        {engineer.name}
                                                    </strong>

                                                    <span>
                                                        PIC
                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

            <ConfirmDialog
                open={confirmDialog.open}
                type={confirmDialog.type}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
                cancelText={confirmDialog.cancelText}
                loading={confirmLoading}
                onConfirm={() => {
                    if (confirmDialog.action) {
                        confirmDialog.action();
                    }
                }}
                onCancel={() => {
                    if (confirmLoading) {
                        return;
                    }

                    setConfirmDialog(prev => ({
                        ...prev,
                        open: false,
                        action: null
                    }));
                }}
            />

        </div>

    );

}
