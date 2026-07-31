import {
  Filter,
  Search,
  RotateCcw,
  Download,
} from "lucide-react";

export default function FilterCard({
  startInput,
  endInput,
  setStartInput,
  setEndInput,
  onApply,
  onReset,
}) {
  return (
    <div className="filter-card">

      <div className="filter-header">

        <div className="filter-title">
          <Filter size={20} strokeWidth={2.2} />
          <span>Filter Data</span>
        </div>

        <div className="filter-description">
          Pilih rentang tanggal untuk menampilkan data dan mengekspor laporan.
        </div>

      </div>

      <div className="filter-content">

        <div className="filter-item">

          <label>Dari</label>

          <input
            type="date"
            value={startInput}
            onChange={(e) => setStartInput(e.target.value)}
          />

        </div>

        <div className="filter-item">

          <label>Sampai</label>

          <input
            type="date"
            value={endInput}
            onChange={(e) => setEndInput(e.target.value)}
          />

        </div>

        <div className="filter-buttons">

          <button
            className="btn btn-primary"
            onClick={onApply}
          >
            <Search size={18} />
            <span>Terapkan</span>
          </button>

          <button
            className="btn btn-outline"
            onClick={onReset}
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>

          <a
            href={
              startInput && endInput
                ? `/api/export?start=${startInput}&end=${endInput}`
                : "/api/export"
            }
            className="btn btn-success"
          >
            <Download size={18} />
            <span>Export Excel</span>
          </a>

        </div>

      </div>

    </div>
  );
}