import { PieChart as PieIcon } from "lucide-react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";


// =====================================================
// STATUS COLORS
// =====================================================

const COLORS = {

    OPEN: "#f59e0b",

    PROCESS: "#2563eb",

    CLOSED: "#22c55e"

};


// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG = [

    {
        key: "OPEN",
        label: "Open",
        color: COLORS.OPEN
    },

    {
        key: "PROCESS",
        label: "Dalam Proses",
        color: COLORS.PROCESS
    },

    {
        key: "CLOSED",
        label: "Selesai",
        color: COLORS.CLOSED
    }

];


// =====================================================
// TOOLTIP
// =====================================================

function StatusTooltip({
    active,
    payload
}) {

    if (
        !active ||
        !payload ||
        !payload.length
    ) {

        return null;

    }


    const item =
        payload[0];


    return (

        <div className="status-tooltip">

            <div className="status-tooltip-label">

                {item.payload.label}

            </div>


            <div className="status-tooltip-value">

                {item.value} tiket

            </div>

        </div>

    );

}


// =====================================================
// COMPONENT
// =====================================================

export default function StatusDistributionCard({

    data

}) {

    const total =
        Number(
            data?.total
        ) || 0;


    // =================================================
    // STATUS DATA
    // =================================================

    const statusData =
        STATUS_CONFIG.map(
            status => ({

                key:
                    status.key,

                label:
                    status.label,

                value:
                    Number(
                        data?.[
                            status.key.toLowerCase()
                        ]
                    ) || 0,

                color:
                    status.color

            })
        );


    const hasData =
        total > 0;


    return (

        <div className="card status-card">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="card-header">


                <div className="card-title">

                    <PieIcon
                        size={20}
                        strokeWidth={2}
                    />

                    <span>
                        Distribusi Status
                    </span>

                </div>


                <p className="card-description">

                    Persentase tiket berdasarkan status
                    pada periode terpilih.

                </p>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="card-content">


                <div className="status-body">


                    {/* =================================================
                        CHART
                    ================================================= */}

                    <div className="status-chart">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="label"
                                    innerRadius={74}
                                    outerRadius={108}
                                    paddingAngle={
                                        hasData
                                            ? 3
                                            : 0
                                    }
                                    cornerRadius={
                                        hasData
                                            ? 8
                                            : 0
                                    }
                                    stroke="#fff"
                                    strokeWidth={4}
                                    isAnimationActive
                                    animationDuration={800}
                                    animationEasing="ease-out"
                                >

                                    {statusData.map(
                                        item => (

                                            <Cell
                                                key={
                                                    item.key
                                                }
                                                fill={
                                                    item.color
                                                }
                                            />

                                        )
                                    )}

                                </Pie>


                                {hasData && (

                                    <Tooltip
                                        content={
                                            <StatusTooltip />
                                        }
                                    />

                                )}

                            </PieChart>

                        </ResponsiveContainer>


                        {/* =================================================
                            CENTER
                        ================================================= */}

                        <div className="status-center">


                            {hasData ? (

                                <>

                                    <strong>
                                        {total}
                                    </strong>

                                    <span>
                                        Total Ticket
                                    </span>

                                </>

                            ) : (

                                <>

                                    <strong>
                                        —
                                    </strong>

                                    <span>
                                        No Data
                                    </span>

                                </>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        LEGEND
                    ================================================= */}

                    <div className="status-list">

                        {statusData.map(
                            item => {

                                const percent =
                                    total === 0

                                        ? null

                                        : Math.round(
                                            (
                                                item.value /
                                                total
                                            ) * 100
                                        );


                                return (

                                    <div
                                        key={
                                            item.key
                                        }
                                        className="status-row"
                                    >


                                        {/* =================================
                                            INFO
                                        ================================= */}

                                        <div className="status-info">


                                            <span
                                                className="status-dot"
                                                style={{
                                                    background:
                                                        item.color
                                                }}
                                            />


                                            <div>

                                                <div className="status-label">

                                                    {
                                                        item.label
                                                    }

                                                </div>


                                                <div className="status-ticket">

                                                    {
                                                        item.value
                                                    }

                                                    {" "}

                                                    tiket

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            PERCENT
                                        ================================= */}

                                        <div className="status-value">

                                            {
                                                percent === null
                                                    ? "—"
                                                    : `${percent}%`
                                            }

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!hasData && (

                    <div className="status-empty-state">

                        Belum ada tiket pada periode
                        yang dipilih.

                    </div>

                )}

            </div>

        </div>

    );

}