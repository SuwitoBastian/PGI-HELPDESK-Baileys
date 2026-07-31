import { useState } from "react";
import {
    Building2,
    ChevronDown,
    ChevronUp
} from "lucide-react";

function RankList({
    title,
    rows,
    emptyLabel,
    expanded,
    totalRows,
    onToggle
}) {

    const max = Math.max(...rows.map(r => r.total), 1);

    return (
        <div className="card top-branch-card">

            <div className="card-header">

                <div className="card-title">
                    <Building2 size={20} />
                    <span>{title}</span>
                </div>

                <p className="card-description">
                    Cabang dengan ticket terbanyak pada periode terpilih.
                </p>

            </div>

            <div className="card-content">

                {rows.length === 0 ? (

                    <div className="state">
                        {emptyLabel}
                    </div>

                ) : (

                    <>

                        <div className="rank-list">

                            {rows.map((r, index) => (

                                <div
                                    key={r.name}
                                    className="rank-row"
                                >

                                    <div
                                        className={`rank-medal medal-${
                                            index < 3
                                                ? index + 1
                                                : "x"
                                        }`}
                                    >
                                        {index + 1}
                                    </div>

                                    <div className="rank-main">

                                        <div className="rank-name">

                                            <span>{r.name}</span>

                                            <span className="rank-count">
                                                {r.total} {r.total === 1 ? "Ticket" : "Tickets"}
                                            </span>

                                        </div>

                                        <div className="rank-bar">

                                            <span
                                                style={{
                                                    width: `${(r.total / max) * 100}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                        {totalRows > 5 && (

                            <button
                                type="button"
                                className="show-more-btn"
                                onClick={onToggle}
                                aria-expanded={expanded}
                            >

                                {expanded ? (
                                    <>
                                        <ChevronUp size={16} />
                                        <span>Show Less</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} />
                                        <span>Show More</span>
                                    </>
                                )}

                            </button>

                        )}

                    </>

                )}

            </div>

        </div>
    );

}

export default function TopBranchCard({
    topCabang = []
}) {

    const [expanded, setExpanded] = useState(false);

    const visibleRows = expanded
        ? topCabang
        : topCabang.slice(0, 5);

    return (

        <RankList
            title={expanded ? "Top 10 Cabang" : "Top 5 Cabang"}
            rows={visibleRows}
            emptyLabel="Belum ada data cabang."
            expanded={expanded}
            totalRows={topCabang.length}
            onToggle={() => setExpanded(prev => !prev)}
        />

    );

}