import { TrendingUp, MapPinned, PieChart } from "lucide-react";

export default function QuickInsightCard({
    topCabang,
    unassigned
}) {
    return (
        <div className="card" style={{ marginBottom: "24px" }}>

            <div className="card-header">

                <div className="card-title">
                    <TrendingUp size={20} />
                    <span>Ringkasan Cepat</span>
                </div>

                <p className="card-description">
                    Informasi singkat kondisi Helpdesk saat ini.
                </p>

            </div>

            <div className="card-content">

                <div className="mini-stats">

                    <div className="mini-item">

                        <MapPinned size={18} />

                        <div>

                            <small>Total Cabang</small>

                            <strong>{topCabang.length}</strong>

                        </div>

                    </div>

                    <div className="mini-item">

                        <PieChart size={18} />

                        <div>

                            <small>Belum Assign PIC</small>

                            <strong>{unassigned}</strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}