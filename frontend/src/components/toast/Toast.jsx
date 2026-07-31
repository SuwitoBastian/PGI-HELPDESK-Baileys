import {
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
    X
} from "lucide-react";

import "../../styles/Toast.css";

const icons = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    error: XCircle
};

export default function Toast({

    open,

    type = "success",

    title,

    message,

    onClose

}) {

    if (!open) return null;

    const Icon = icons[type] || CheckCircle2;

    return (

        <div className={`toast ${type}`}>

            <div className="toast-icon">
                <Icon size={22}/>
            </div>

            <div className="toast-content">

                <div className="toast-title">
                    {title}
                </div>

                <div className="toast-message">
                    {message}
                </div>

            </div>

            <button
                className="toast-close"
                onClick={onClose}
            >
                <X size={16}/>
            </button>

        </div>

    );

}