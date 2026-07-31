import {
    createContext,
    useContext,
    useMemo,
    useRef,
    useState
} from "react";

import Toast from "../components/toast/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {

    const [toast, setToast] = useState({

        open: false,

        type: "success",

        title: "",

        message: ""

    });

    const timeoutRef = useRef(null);

    function show(type, title, message) {

        // Kalau masih ada timer lama, batalkan dulu
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToast({
            open: true,
            type,
            title,
            message
        });

        // Error tampil lebih lama
        const duration = type === "error" ? 7000 : 3000;

        timeoutRef.current = setTimeout(() => {
            close();
        }, duration);

    }

    function close() {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setToast(prev => ({
            ...prev,
            open: false
        }));

    }

    const value = useMemo(() => ({

        success(title, message) {

            show("success", title, message);

        },

        info(title, message) {

            show("info", title, message);

        },

        warning(title, message) {

            show("warning", title, message);

        },

        error(title, message) {

            show("error", title, message);

        }

    }), []);

    return (

        <ToastContext.Provider value={value}>

            {children}

            <Toast
                open={toast.open}
                type={toast.type}
                title={toast.title}
                message={toast.message}
                onClose={close}
            />

        </ToastContext.Provider>

    );

}

export function useToastContext() {

    const context = useContext(ToastContext);

    if (!context) {

        throw new Error(
            "useToastContext harus digunakan di dalam ToastProvider."
        );

    }

    return context;

}