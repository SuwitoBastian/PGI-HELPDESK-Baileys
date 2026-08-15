import { ArrowRightLeft } from "lucide-react";


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


export default function OperationalRotationWidget({
    rotation
}) {

    if (!rotation?.current) {
        return null;
    }


    const current = rotation.current;
    const next = rotation.next;


    return (

        <div className="rotation-widget">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="rotation-widget-header">

                <ArrowRightLeft
                    size={16}
                    strokeWidth={2}
                />

                <span>
                    Operational Rotation
                </span>

            </div>


            {/* ==================================================
                CURRENT LOCATIONS
            ================================================== */}

            <div className="rotation-widget-teams">

                <div className="rotation-widget-team team-a">

                    <strong>
                        HO - AKR Tower
                    </strong>

                    <small>
                        Operational Location
                    </small>

                </div>


                <div className="rotation-widget-team team-b">

                    <strong>
                        Head Office
                    </strong>

                    <small>
                        Operational Location
                    </small>

                </div>

            </div>


            {/* ==================================================
                PERIOD
            ================================================== */}

            <div className="rotation-widget-footer">

                <span>
                    Current Period
                </span>

                <strong>

                    {MONTHS[current.month]}{" "}
                    {current.year}

                </strong>


                {next && (

                    <>

                        <span style={{
                            marginTop: "8px"
                        }}>
                            Next Rotation
                        </span>

                        <strong>

                            {MONTHS[next.month]}{" "}
                            {next.year}

                        </strong>

                    </>

                )}

            </div>

        </div>

    );

}