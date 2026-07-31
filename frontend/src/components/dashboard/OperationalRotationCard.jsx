const MONTHS = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export default function OperationalRotationCard({ rotation }) {

    if (!rotation?.current) {
        return null;
    }

    const { current, next } = rotation;

    const primary = current.primaryTeam;
    const backup = current.backupTeam;

    return (
        <div className="rotation-overview-card">

            <div className="rotation-overview-header">

                <div>

                    <h3>
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Operational Rotation</span>
                    </h3>

                    <p>
                        Current operational team assignment
                    </p>

                </div>

            </div>

            <div className="rotation-overview-body">

                <div className="rotation-period">

                    <span className="rotation-label">
                        Current Period
                    </span>

                    <h4>
                        {MONTHS[current.month]} {current.year}
                    </h4>

                </div>

                <div className="rotation-team-grid">

                    <div
                        className={`rotation-team ${
                            primary === "TEAM_A"
                                ? "team-a"
                                : "team-b"
                        }`}
                    >

                        <span className="rotation-team-badge">
                            {primary.replace("_", " ")}
                        </span>

                        <small>
                            PRIMARY TEAM
                        </small>

                    </div>

                    <div
                        className={`rotation-team ${
                            backup === "TEAM_A"
                                ? "team-a"
                                : "team-b"
                        }`}
                    >

                        <span className="rotation-team-badge">
                            {backup.replace("_", " ")}
                        </span>

                        <small>
                            BACKUP TEAM
                        </small>

                    </div>

                </div>

                <div className="rotation-next">

                    <span className="rotation-label">
                        Next Rotation
                    </span>

                    <strong>
                        {MONTHS[next.month]} {next.year}
                    </strong>

                </div>

            </div>

        </div>
    );

}