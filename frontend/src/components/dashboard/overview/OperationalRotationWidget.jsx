import { ArrowRightLeft } from "lucide-react";

const MONTHS = [
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

export default function OperationalRotationWidget({ rotation }) {

    if (!rotation?.current) return null;

    const current = rotation.current;
    const next = rotation.next;

    return (

        <div className="rotation-widget">

            <div className="rotation-widget-header">

                <ArrowRightLeft
                    size={16}
                    strokeWidth={2}
                />

                <span>
                    Operational Rotation
                </span>

            </div>

            <div className="rotation-widget-teams">

                <div className="rotation-widget-team team-a">

                    <strong>
                        {current.primaryTeam.replace("_", " ")}
                    </strong>

                    <small>
                        Primary Team
                    </small>

                </div>

                <div className="rotation-widget-team team-b">

                    <strong>
                        {current.backupTeam.replace("_", " ")}
                    </strong>

                    <small>
                        Backup Team
                    </small>

                </div>

            </div>

            <div className="rotation-widget-footer">

                Next Rotation

                <strong>
                    {MONTHS[next.month - 1]} {next.year}
                </strong>

            </div>

        </div>

    );

}