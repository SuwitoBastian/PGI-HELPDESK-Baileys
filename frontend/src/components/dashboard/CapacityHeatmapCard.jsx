import { Flame } from "lucide-react";

export default function CapacityHeatmapCard({
    engineers = []
}) {

    const getStatus = (capacity) => {

        if (capacity >= 80) {
            return {
                label: "Overload",
                progress: "progress-danger",
                status: "status-danger"
            };
        }

        if (capacity >= 50) {
            return {
                label: "Busy",
                progress: "progress-warning",
                status: "status-warning"
            };
        }

        return {
            label: "Available",
            progress: "progress-success",
            status: "status-success"
        };

    };

    return (

        <div className="card">

            <div className="card-header">

                <div className="card-title">

                    <Flame size={20} />

                    <span>Capacity Heatmap</span>

                </div>

                <p className="card-description">

                    Distribusi beban engineer saat ini.

                </p>

            </div>

            <div className="heatmap-list">

                {engineers.map(engineer => {

                    const info = getStatus(engineer.capacity);

                    return (

                        <div
                            key={engineer.id}
                            className="heatmap-item"
                        >

                            <div className="heatmap-header">

                                <strong>

                                    {engineer.name}

                                </strong>

                                <span>

                                    {engineer.capacity}%

                                </span>

                            </div>

                            <div className="progress">

                                <div
                                    className={`progress-fill ${info.progress}`}
                                    style={{
                                        width: `${engineer.capacity}%`
                                    }}
                                />

                            </div>

                            <div className={`status ${info.status}`}>

                                <span className="status-dot"></span>

                                {info.label}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}