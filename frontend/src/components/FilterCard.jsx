export default function FilterCard({

    startInput,
    endInput,

    setStartInput,
    setEndInput,

    onApply,
    onReset

}) {

    return (

        <div className="filter-card">

            <div className="filter-title">

                📅 Filter Dashboard

            </div>

            <div className="filter-content">

                <div className="filter-item">

                    <label>Dari</label>

                    <input

                        type="date"

                        value={startInput}

                        onChange={(e)=>

                            setStartInput(e.target.value)

                        }

                    />

                </div>

                <div className="filter-item">

                    <label>Sampai</label>

                    <input

                        type="date"

                        value={endInput}

                        onChange={(e)=>

                            setEndInput(e.target.value)

                        }

                    />

                </div>
                
                <div className="filter-buttons">

                    <button
                        className="btn btn-primary"
                        onClick={onApply}
                    >
                        🔍 Terapkan
                    </button>

                    <button
                        className="btn btn-outline"
                        onClick={onReset}
                    >
                        ♻ Reset
                    </button>

                    <a
                        href={
                            startInput && endInput
                                ? `/api/export?start=${startInput}&end=${endInput}`
                                : "/api/export"
                        }
                        className="btn btn-success"
                    >
                        📥 Export Excel
                    </a>

                </div>

            </div>

        </div>

    )

}