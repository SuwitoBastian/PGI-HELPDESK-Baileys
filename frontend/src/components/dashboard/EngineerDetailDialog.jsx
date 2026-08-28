import Modal from "../ui/Modal";

import {
    User,
    CheckCircle2,
    Loader2,
    Activity,
    MapPin
} from "lucide-react";


// =====================================================
// CAPACITY CLASS
// =====================================================

function getCapacityClass(level) {

    switch (level) {

        case "LOW":
            return "capacity-low";

        case "MEDIUM":
            return "capacity-medium";

        case "HIGH":
            return "capacity-high";

        case "FULL":
            return "capacity-full";

        default:
            return "";

    }

}


// =====================================================
// CAPACITY LABEL
// =====================================================

function getCapacityLabel(level) {

    switch (level) {

        case "LOW":
            return "Tersedia";

        case "MEDIUM":
            return "Sibuk";

        case "HIGH":
            return "Beban Tinggi";

        case "FULL":
            return "Kapasitas Penuh";

        default:
            return level || "-";

    }

}


// =====================================================
// CAPACITY DESCRIPTION
// =====================================================

function getCapacityDescription(level) {

    switch (level) {

        case "LOW":
            return "PIC memiliki kapasitas yang cukup untuk menerima assignment baru.";

        case "MEDIUM":
            return "Beban kerja PIC mulai meningkat namun masih dapat menerima assignment bila diperlukan.";

        case "HIGH":
            return "Beban kerja PIC cukup tinggi. Pertimbangkan PIC lain untuk assignment berikutnya.";

        case "FULL":
            return "PIC telah mencapai kapasitas maksimum. Disarankan mengalihkan assignment ke PIC lain.";

        default:
            return "";

    }

}


// =====================================================
// LOCATION LABEL
// =====================================================

function getLocationLabel(location) {

    switch (location) {

        case "AKR":
            return "HO - AKR Tower";

        case "HO":
            return "Head Office";

        default:
            return location || "-";

    }

}


// =====================================================
// COMPONENT
// =====================================================

export default function EngineerDetailDialog({

    engineer,

    onClose

}) {

    if (!engineer) {

        return null;

    }


    const locationLabel =
        getLocationLabel(
            engineer.location
        );


    return (

        <Modal
            open={!!engineer}
            title="Detail PIC"
            onClose={onClose}
        >

            <div className="engineer-dialog">


                {/* =================================================
                    PROFILE
                ================================================= */}

                <div className="engineer-profile">

                    <div className="engineer-profile-left">

                        <div className="engineer-avatar">

                            <User size={28} />

                        </div>


                        <div>

                            <h2>

                                {engineer.name}

                            </h2>


                            {/* LOCATION */}

                            <p className="engineer-location">

                                <MapPin
                                    size={14}
                                    strokeWidth={2}
                                />

                                <span>

                                    {locationLabel}

                                </span>

                            </p>

                        </div>

                    </div>


                    {/* SCORE */}

                    <div className="engineer-score">

                        <span>

                            Skor Performa

                        </span>


                        <strong>

                            {engineer.score ?? 0}

                        </strong>

                    </div>

                </div>


                {/* =================================================
                    METRICS
                ================================================= */}

                <div className="engineer-metrics">


                    {/* ASSIGNED */}

                    <div className="metric-row">

                        <div className="metric-label">

                            <User size={16} />

                            <span>

                                Ditugaskan

                            </span>

                        </div>


                        <strong
                            className={
                                engineer.assigned === 0
                                    ? "metric-zero"
                                    : ""
                            }
                        >

                            {engineer.assigned ?? 0} Tiket

                        </strong>

                    </div>


                    {/* COMPLETED */}

                    <div className="metric-row">

                        <div className="metric-label">

                            <CheckCircle2 size={16} />

                            <span>

                                Selesai

                            </span>

                        </div>


                        <strong>

                            {engineer.completed ?? 0} Tiket

                        </strong>

                    </div>


                    {/* PROCESS */}

                    <div className="metric-row">

                        <div className="metric-label">

                            <Loader2 size={16} />

                            <span>

                                Dalam Proses

                            </span>

                        </div>


                        <strong
                            className={
                                engineer.process === 0
                                    ? "metric-zero"
                                    : ""
                            }
                        >

                            {engineer.process ?? 0} Tiket

                        </strong>

                    </div>


                    {/* CONTRIBUTION */}

                    <div className="metric-row">

                        <div className="metric-label">

                            <Activity size={16} />

                            <span>

                                Kontribusi

                            </span>

                        </div>


                        <strong>

                            {engineer.contribution ?? 0}%

                        </strong>

                    </div>

                </div>


                {/* =================================================
                    CAPACITY
                ================================================= */}

                <div className="capacity-section">

                    <div className="capacity-header">

                        Status Beban Kerja

                    </div>


                    <div
                        className={`leaderboard-capacity ${getCapacityClass(
                            engineer.capacity?.level
                        )}`}
                    >

                        <span className="capacity-dot"></span>


                        <span>

                            {getCapacityLabel(
                                engineer.capacity?.level
                            )}

                        </span>

                    </div>


                    <p className="capacity-description">

                        {getCapacityDescription(
                            engineer.capacity?.level
                        )}

                    </p>

                </div>

            </div>

        </Modal>

    );

}