import { Trophy, MapPin } from "lucide-react";
import { useState } from "react";

import EngineerDetailDialog from "./EngineerDetailDialog";


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

export default function EngineerLeaderboardCard({

    engineers = [],

    location = ""

}) {


    const [
        selectedEngineer,
        setSelectedEngineer
    ] = useState(null);


    /*
    =====================================================
    LOCATION MODE
    =====================================================

    Jika location dipilih:

        AKR
        HO

    maka lokasi tidak perlu ditampilkan lagi
    pada setiap engineer karena sudah diketahui
    dari halaman yang sedang dibuka.

    ALL:
        lokasi engineer tetap ditampilkan.
    */

    const showEngineerLocation =
        !location;


    return (

        <div className="card engineer-leaderboard-card">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="card-header">

                <div className="card-title">

                    <Trophy
                        size={20}
                        strokeWidth={2}
                    />

                    <span>
                        Peringkat PIC
                    </span>

                </div>


                <p className="card-description">

                    Performa PIC berdasarkan
                    penyelesaian tiket dan skor.

                </p>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="card-content">

                <div className="leaderboard-list">


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {engineers.length === 0 ? (

                        <div className="leaderboard-empty">

                            Belum ada data PIC.

                        </div>

                    ) : (

                        engineers.map(
                            (engineer, index) => (

                                <div
                                    key={
                                        `${engineer.location || "ALL"}-${engineer.code || engineer.name}-${index}`
                                    }
                                    className="leaderboard-item"
                                    onClick={() =>
                                        setSelectedEngineer(
                                            engineer
                                        )
                                    }
                                >


                                    {/* =================================================
                                        TOP
                                    ================================================= */}

                                    <div className="leaderboard-top">


                                        {/* =============================================
                                            LEFT
                                        ============================================= */}

                                        <div className="leaderboard-left">


                                            {/* =============================================
                                                RANK
                                            ============================================= */}

                                            <div
                                                className={
                                                    `leaderboard-rank rank-${
                                                        index === 0
                                                            ? "gold"
                                                            : index === 1
                                                                ? "silver"
                                                                : index === 2
                                                                    ? "bronze"
                                                                    : "default"
                                                    }`
                                                }
                                            >

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </div>


                                            {/* =============================================
                                                PIC
                                            ============================================= */}

                                            <div>

                                                <div className="leaderboard-name">

                                                    {engineer.name}

                                                </div>


                                                {/* =============================================
                                                    LOCATION

                                                    Hanya tampil pada ALL Performance.
                                                ============================================= */}

                                                {showEngineerLocation && (

                                                    <div className="leaderboard-team">

                                                        {engineer.location && (

                                                            <>

                                                                <MapPin
                                                                    size={12}
                                                                    strokeWidth={2}
                                                                />

                                                                <span>

                                                                    {
                                                                        getLocationLabel(
                                                                            engineer.location
                                                                        )
                                                                    }

                                                                </span>

                                                            </>

                                                        )}

                                                    </div>

                                                )}


                                                {/* =============================================
                                                    LOCATION MODE

                                                    Jangan tampilkan Team A / Team B.

                                                    Cukup beri label PIC.
                                                ============================================= */}

                                                {!showEngineerLocation && (

                                                    <div className="leaderboard-team">

                                                        PIC

                                                    </div>

                                                )}

                                            </div>

                                        </div>


                                        {/* =============================================
                                            SCORE
                                        ============================================= */}

                                        <div className="leaderboard-score">

                                            <strong>

                                                {engineer.score || 0}

                                            </strong>

                                            <span>

                                                Skor

                                            </span>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CONTRIBUTION
                                    ================================================= */}

                                    <div className="leaderboard-progress">

                                        <div
                                            className="leaderboard-progress-fill"
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        Number(
                                                            engineer.contribution
                                                        ) || 0,
                                                        100
                                                    )}%`
                                            }}
                                        />

                                    </div>


                                    {/* =================================================
                                        FOOTER
                                    ================================================= */}

                                    <div className="leaderboard-footer">


                                        {/* =============================================
                                            COMPLETED
                                        ============================================= */}

                                        <div className="leaderboard-metric">

                                            <span>
                                                Selesai
                                            </span>

                                            <strong>

                                                {engineer.completed || 0}

                                            </strong>

                                            <small>
                                                Tiket
                                            </small>

                                        </div>


                                        {/* =============================================
                                            CAPACITY
                                        ============================================= */}

                                        <div
                                            className={
                                                `leaderboard-capacity ${
                                                    getCapacityClass(
                                                        engineer.capacity?.level
                                                    )
                                                }`
                                            }
                                        >

                                            <span className="capacity-dot"></span>

                                            <span>

                                                {getCapacityLabel(
                                                    engineer.capacity?.level
                                                )}

                                            </span>

                                        </div>

                                    </div>


                                </div>

                            )
                        )

                    )}

                </div>

            </div>


            {/* =================================================
                DETAIL DIALOG
            ================================================= */}

            <EngineerDetailDialog

                engineer={
                    selectedEngineer
                }

                onClose={() =>
                    setSelectedEngineer(null)
                }

            />

        </div>

    );

}