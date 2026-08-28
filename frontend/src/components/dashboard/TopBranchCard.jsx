import { Building2 } from "lucide-react";


// =====================================================
// LOCATION LABEL
// =====================================================

function getLocationLabel(location) {

    switch (location) {

        case "AKR":
            return "HO - AKR Tower";

        case "HO":
            return "Head Office";

        case "HO-AKR":
            return "HO - AKR Tower";

        case "HO_AKR":
            return "HO - AKR Tower";

        case "HEAD_OFFICE":
            return "Head Office";

        default:
            return location || "-";

    }

}


// =====================================================
// RANK LIST
// =====================================================

function RankList({

    rows = []

}) {

    const max =
        Math.max(
            ...rows.map(
                row => Number(row.total) || 0
            ),
            1
        );


    return (

        <div className="card top-branch-card">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="card-header">

                <div className="card-title">

                    <Building2
                        size={20}
                        strokeWidth={2}
                    />

                    <span>
                        Lokasi Teratas
                    </span>

                </div>


                <p className="card-description">

                    Lokasi dengan jumlah ticket terbanyak
                    pada periode terpilih.

                </p>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="card-content">


                {rows.length === 0 ? (

                    <div className="state">

                        Belum ada data lokasi.

                    </div>

                ) : (

                    <div className="rank-list">

                        {rows.map(
                            (row, index) => {

                                const total =
                                    Number(
                                        row.total
                                    ) || 0;


                                const location =
                                    getLocationLabel(
                                        row.name
                                    );


                                return (

                                    <div
                                        key={
                                            `${row.name}-${index}`
                                        }
                                        className="rank-row"
                                    >


                                        {/* =============================================
                                            RANK
                                        ============================================= */}

                                        <div
                                            className={
                                                `rank-medal medal-${
                                                    index < 3
                                                        ? index + 1
                                                        : "x"
                                                }`
                                            }
                                        >

                                            {index + 1}

                                        </div>


                                        {/* =============================================
                                            MAIN
                                        ============================================= */}

                                        <div className="rank-main">


                                            <div className="rank-name">

                                                <span>

                                                    {location}

                                                </span>


                                                <span className="rank-count">

                                                    {total}{" "}

                                                    {total === 1
                                                        ? "Ticket"
                                                        : "Tiket"}

                                                </span>

                                            </div>


                                            {/* =============================================
                                                PROGRESS
                                            ============================================= */}

                                            <div className="rank-bar">

                                                <span
                                                    style={{
                                                        width:
                                                            `${(
                                                                total /
                                                                max
                                                            ) * 100}%`
                                                    }}
                                                />

                                            </div>

                                        </div>


                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


// =====================================================
// COMPONENT
// =====================================================

export default function TopBranchCard({

    topCabang = []

}) {

    /*
    =====================================================
    LOCATION DATA

    Backend saat ini masih menggunakan property
    `topCabang`.

    Tidak perlu mengubah API dulu.

    Component hanya mengubah cara data tersebut
    ditampilkan menjadi konsep Location.
    =====================================================
    */

    const rows =
        [...topCabang]
            .sort(
                (a, b) =>
                    (Number(b.total) || 0) -
                    (Number(a.total) || 0)
            )
            .slice(0, 5);


    return (

        <RankList
            rows={rows}
        />

    );

}