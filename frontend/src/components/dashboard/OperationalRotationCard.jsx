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


export default function OperationalRotationCard({
    rotation
}) {

    if (!rotation?.current) {
        return null;
    }


    const {
        current,
        next
    } = rotation;


    return (

        <div className="rotation-overview-card">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rotation-overview-header">

                <div>

                    <h3>

                        <i className="bi bi-arrow-repeat"></i>

                        <span>
                            Operational Rotation
                        </span>

                    </h3>


                    <p>
                        Periode penugasan operasional saat ini
                    </p>

                </div>

            </div>


            {/* ==================================================
                BODY
            ================================================== */}

            <div className="rotation-overview-body">


                {/* ==================================================
                    CURRENT PERIOD
                ================================================== */}

                <div className="rotation-period">

                    <span className="rotation-label">
                        Current Period
                    </span>


                    <h4>

                        {MONTHS[current.month]}{" "}
                        {current.year}

                    </h4>

                </div>


                {/* ==================================================
                    CURRENT LOCATION
                ================================================== */}

                <div className="rotation-team-grid">

                    <div className="rotation-team team-a">

                        <span className="rotation-team-badge">
                            HO - AKR Tower
                        </span>


                        <small>
                            OPERATIONAL LOCATION
                        </small>

                    </div>


                    <div className="rotation-team team-b">

                        <span className="rotation-team-badge">
                            Head Office
                        </span>


                        <small>
                            OPERATIONAL LOCATION
                        </small>

                    </div>

                </div>


                {/* ==================================================
                    NEXT ROTATION
                ================================================== */}

                {next && (

                    <div className="rotation-next">

                        <span className="rotation-label">
                            Next Rotation
                        </span>


                        <strong>

                            {MONTHS[next.month]}{" "}
                            {next.year}

                        </strong>

                    </div>

                )}

            </div>

        </div>

    );

}