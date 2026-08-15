import { ArrowLeftRight } from "lucide-react";

import StatCards from "../../StatCards";
import InsightCard from "../InsightCard";
import RecentActivityCard from "../RecentActivityCard";


export default function OverviewPage({
    data,
    location = ""
}) {

    // =====================================================
    // LOCATION
    // =====================================================

    const normalizedLocation =
        String(location || "")
            .trim()
            .toUpperCase();


    const isAKR =
        normalizedLocation === "AKR";

    const isHO =
        normalizedLocation === "HO";


    const performanceTitle =
        isAKR
            ? "HO - AKR Tower"
            : isHO
                ? "Head Office"
                : "All Performance";


    const performanceSubtitle =
        isAKR
            ? "Ringkasan performa HO - AKR Tower."
            : isHO
                ? "Ringkasan performa Head Office."
                : "Ringkasan performa seluruh Helpdesk.";


    // =====================================================
    // OPERATIONAL ROTATION
    // =====================================================

    const rotation =
        data?.rotation?.current;


    const monthNames = [

        "",

        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"

    ];


    const rotationPeriod =
        rotation

            ? `${monthNames[rotation.month]} ${rotation.year}`

            : "-";


    const nextRotation =
        data?.rotation?.next;


    const nextRotationPeriod =
        nextRotation

            ? `${monthNames[nextRotation.month]} ${nextRotation.year}`

            : "-";


    // =====================================================
    // ROTATION LOCATION LABEL
    // =====================================================
    //
    // ALL:
    //   Location -> HO - AKR Tower
    //   Support  -> Head Office
    //
    // AKR:
    //   Selected Location -> HO - AKR Tower
    //
    // HO:
    //   Selected Location -> Head Office
    //
    // Jangan mengubah sumber data rotation.
    // Ini hanya mengubah presentasi berdasarkan
    // halaman yang sedang dibuka.
    // =====================================================

    const selectedLocationLabel =
        isAKR
            ? "HO - AKR Tower"
            : isHO
                ? "Head Office"
                : null;


    return (

        <>


            {/* ==================================================
                PERFORMANCE CARD
            ================================================== */}

            <div className="performance-card">

                <div className="performance-header">


                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <div>

                        <h2 className="performance-title">

                            {performanceTitle}

                        </h2>


                        <p className="performance-subtitle">

                            {performanceSubtitle}

                        </p>

                    </div>


                    {/* ==================================================
                        OPERATIONAL ROTATION
                    ================================================== */}

                    <div className="rotation-badge">


                        <div className="rotation-label">

                            <ArrowLeftRight
                                size={13}
                                strokeWidth={2}
                            />

                            <span>
                                Operational Rotation
                            </span>

                        </div>


                        {/* ==================================================
                            CURRENT PERIOD
                        ================================================== */}

                        <div className="performance-rotation-row">

                            <span className="performance-rotation-key">

                                Current Period

                            </span>


                            <span className="performance-rotation-team primary">

                                {rotationPeriod}

                            </span>

                        </div>


                        {/* ==================================================
                            LOCATION
                        ================================================== */}

                        {selectedLocationLabel ? (

                            <div className="performance-rotation-row">

                                <span className="performance-rotation-key">

                                    Location

                                </span>


                                <span className="performance-rotation-team primary">

                                    {selectedLocationLabel}

                                </span>

                            </div>

                        ) : (

                            <>

                                <div className="performance-rotation-row">

                                    <span className="performance-rotation-key">

                                        Location

                                    </span>


                                    <span className="performance-rotation-team primary">

                                        HO - AKR Tower

                                    </span>

                                </div>


                                <div className="performance-rotation-row">

                                    <span className="performance-rotation-key">

                                        Support

                                    </span>


                                    <span className="performance-rotation-team backup">

                                        Head Office

                                    </span>

                                </div>

                            </>

                        )}


                        <div className="performance-rotation-divider"></div>


                        {/* ==================================================
                            NEXT ROTATION
                        ================================================== */}

                        <div className="performance-rotation-next-title">

                            Next Rotation

                        </div>


                        <div className="performance-rotation-next-value">

                            {nextRotationPeriod}

                        </div>


                        <div className="rotation-period">

                            HO - AKR Tower ↔ Head Office

                        </div>


                    </div>

                </div>


                {/* ==================================================
                    STAT CARDS
                ================================================== */}

                <StatCards
                    data={data}
                />

            </div>

            <div className="overview-card-stack">
            {/* ==================================================
                INSIGHT
            ================================================== */}

            <InsightCard

                overview={
                    data.analytics?.overview
                }

                engineers={
                    data.analytics?.engineers || []
                }

                teams={
                    data.analytics?.teams || []
                }

            />


            {/* ==================================================
                RECENT ACTIVITY
            ================================================== */}

            <RecentActivityCard

                tickets={
                    data.tickets || []
                }

            />

            </div>

        </>

    );

}