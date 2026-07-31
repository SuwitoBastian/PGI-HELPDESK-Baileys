import { Trophy } from "lucide-react";
import { useState } from "react";

import EngineerDetailDialog from "./EngineerDetailDialog";

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

function getCapacityLabel(level) {

    switch (level) {

        case "LOW":
            return "Available";

        case "MEDIUM":
            return "Busy";

        case "HIGH":
            return "High Load";

        case "FULL":
            return "Full Capacity";

        default:
            return level;

    }

}

export default function EngineerLeaderboardCard({

    engineers = []

}) {

    const [selectedEngineer, setSelectedEngineer] = useState(null);

    return (

        <div className="card engineer-leaderboard-card">

            <div className="card-header">

                <div className="card-title">

                    <Trophy size={20} />

                    <span>Engineer Leaderboard</span>

                </div>

                <p className="card-description">

                    Performa engineer berdasarkan penyelesaian tiket dan skor.

                </p>

            </div>

            <div className="card-content">

                <div className="leaderboard-list">

                    {engineers.map((engineer, index) => (

                        <div
                            key={`${engineer.team}-${engineer.name}`}
                            className="leaderboard-item"
                            onClick={() => setSelectedEngineer(engineer)}
                        >

                            <div className="leaderboard-top">

                                <div className="leaderboard-left">

                                    <div
                                        className={`leaderboard-rank rank-${
                                            index === 0
                                                ? "gold"
                                                : index === 1
                                                ? "silver"
                                                : index === 2
                                                ? "bronze"
                                                : "default"
                                        }`}
                                    >

                                        {String(index + 1).padStart(2, "0")}

                                    </div>

                                    <div>

                                        <div className="leaderboard-name">

                                            {engineer.name}

                                        </div>

                                        <div className="leaderboard-team">

                                            Team {engineer.team}

                                        </div>

                                    </div>

                                </div>

                                <div className="leaderboard-score">

                                    <strong>

                                        {engineer.score}

                                    </strong>

                                    <span>

                                        Score

                                    </span>

                                </div>

                            </div>

                            <div className="leaderboard-progress">

                                <div
                                    className="leaderboard-progress-fill"
                                    style={{
                                        width: `${Math.min(engineer.contribution, 100)}%`
                                    }}
                                />

                            </div>

                            <div className="leaderboard-footer">

                                <div className="leaderboard-metric">

                                    <span>

                                        Completed

                                    </span>

                                    <strong>

                                        {engineer.completed}

                                    </strong>

                                    <small>

                                        Ticket

                                    </small>

                                </div>

                                <div
                                    className={`leaderboard-capacity ${getCapacityClass(
                                        engineer.capacity.level
                                    )}`}
                                >

                                    <span className="capacity-dot"></span>

                                    <span>

                                        {getCapacityLabel(engineer.capacity.level)}

                                    </span>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <EngineerDetailDialog
                engineer={selectedEngineer}
                onClose={() => setSelectedEngineer(null)}
            />

        </div>

    );

}