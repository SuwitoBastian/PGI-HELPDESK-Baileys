import {
    CircleDot,
    Database,
    ShieldCheck
} from "lucide-react";

export default function SystemCard() {

    return (

        <div className="nav-section">

            <div className="nav-label">
                SYSTEM
            </div>

            <div className="system-card">

                <div className="system-item">

                    <CircleDot
                        size={14}
                        className="online"
                    />

                    <span>WhatsApp</span>

                    <strong>ONLINE</strong>

                </div>

                <div className="system-item">

                    <Database
                        size={14}
                        className="online"
                    />

                    <span>Database</span>

                    <strong>CONNECTED</strong>

                </div>

                <div className="system-item">

                    <ShieldCheck
                        size={14}
                        className="online"
                    />

                    <span>Dashboard</span>

                    <strong>ACTIVE</strong>

                </div>

            </div>

        </div>

    );

}