import { useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2
} from "lucide-react";

import "../../styles/ConfirmDialog.css";

const icons = {
    danger: AlertTriangle,
    success: CheckCircle2,
    info: Info
};

export default function ConfirmDialog({
    open,
    type = "info",
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Batal",
    loading = false,
    onConfirm,
    onCancel,
    children
}) {

    useEffect(() => {

    if (!open) return;

    function handleKeyDown(e) {

        if (e.key === "Escape" && !loading) {
            onCancel?.();
        }

    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };

    }, [open, loading, onCancel]);

    if (!open) return null;

    const Icon = icons[type] || Info;

    return (
            <div
                className="confirm-backdrop"
                onClick={() => {

                    if (loading) return;

                    onCancel?.();

                }}
            >
            <div
                className="confirm-dialog"
                onClick={(e) => e.stopPropagation()}
            >

                <div className={`dialog-icon ${type}`}>
                    <Icon size={30}/>
                </div>

                <h2>{title}</h2>

                <p>{message}</p>

                {children}

                <div className="dialog-actions">

                    <button
                        className="btn-secondary"
                        disabled={loading}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className={`btn-primary ${type}`}
                        disabled={loading}
                        onClick={onConfirm}
                    >
                        {
                            loading
                                ? <>
                                    <Loader2
                                        size={16}
                                        className="spin"
                                    />
                                    Menyimpan...
                                  </>
                                : confirmText
                        }
                    </button>

                </div>

            </div>
        </div>
    );

}