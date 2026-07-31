import { createPortal } from "react-dom";

export default function Modal({
    open,
    title,
    children,
    onClose
}) {

    if (!open) return null;

    return createPortal(

        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <h2>{title}</h2>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-content">

                    {children}

                </div>

            </div>

        </div>,

        document.body

    );

}