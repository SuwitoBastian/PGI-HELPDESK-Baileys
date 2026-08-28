import {
    Search,
    Download,
    X,
    Star,
    MessageSquareText,
    Clock3,
    Bell
} from "lucide-react";

import { useEffect, useState } from "react";

import {
    getFeedback,
    exportFeedbackExcel,
    startFeedbackReminder
} from "../../api";

import useToast from "../../hooks/useToast";


export default function CustomerFeedbackDialog({

    open,
    onClose,
    statistics = {}

}) {


    const toast = useToast();


    const [keyword, setKeyword] =
        useState("");


    const [startDate, setStartDate] =
        useState("");


    const [endDate, setEndDate] =
        useState("");


    /*
    ==========================================================
    LOCATION
    ==========================================================
    */

    const [location, setLocation] =
        useState("ALL");


    const [rows, setRows] =
        useState([]);


    const [summary, setSummary] =
        useState(statistics);


    const [loading, setLoading] =
        useState(false);


    const [
        reminderLoading,
        setReminderLoading
    ] = useState(false);


    /* ==========================================================
       FEEDBACK REMINDER
    ========================================================== */

    async function handleFeedbackReminder() {

        if (reminderLoading) {
            return;
        }


        try {

            setReminderLoading(true);


            const response =
                await startFeedbackReminder();


            toast.success(
                "Feedback Reminder",
                response?.message ||
                "Feedback Reminder berhasil dimulai. Sistem sedang memproses reminder secara background."
            );


        } catch (err) {

            console.error(
                "Feedback Reminder Error:",
                err
            );


            toast.error(
                "Feedback Reminder Gagal",
                err.message ||
                "Gagal menjalankan feedback reminder."
            );


        } finally {

            setReminderLoading(false);

        }

    }


    /*
    ==========================================================
    AUTO DATE FILTER - CUSTOMER FEEDBACK
    ==========================================================

    ALL LOCATION
    → Semua histori

    AKR / HO
    → Bulan berjalan sampai hari ini
    ==========================================================
    */

    useEffect(() => {

        // ALL LOCATION
        // Tidak menggunakan filter tanggal
        if (location === "ALL") {

            setStartDate("");
            setEndDate("");

            return;
        }


        // LOCATION
        // Otomatis bulan berjalan
        const now = new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                now.getDate()
            ).padStart(2, "0");


        const startDate =
            `${year}-${month}-01`;


        const endDate =
            `${year}-${month}-${day}`;


        setStartDate(startDate);
        setEndDate(endDate);

    }, [location]);


    const PAGE_SIZE = 10;


    const [currentPage, setCurrentPage] =
        useState(1);


    const totalPages =
        Math.ceil(
            rows.length / PAGE_SIZE
        );


    const startIndex =
        (currentPage - 1) * PAGE_SIZE;


    const endIndex =
        startIndex + PAGE_SIZE;


    const paginatedRows =
        rows.slice(
            startIndex,
            endIndex
        );


    /*
    ==========================================================
    EXPORT
    ==========================================================
    */

    function handleExport() {

        exportFeedbackExcel({

            startDate,

            endDate,

            location,

            keyword

        });

    }


    /*
    ==========================================================
    LOAD FEEDBACK
    ==========================================================
    */

    async function loadFeedback() {

        try {

            setLoading(true);


            const response =
                await getFeedback({

                    startDate,

                    endDate,

                    location,

                    keyword

                });


            setRows(
                response.data || []
            );


            setSummary(
                response.statistics || {}
            );


        }

        catch (err) {

            console.error(
                "Load Feedback Error :",
                err
            );


            setRows([]);


            setSummary({

                total_feedback: 0,

                total_link_sent: 0,

                waiting_feedback: 0,

                average_response_rating: 0,

                average_solution_rating: 0

            });

        }

        finally {

            setLoading(false);

        }

    }


    /*
    ==========================================================
    LOAD WHEN FILTER CHANGES
    ==========================================================
    */

    useEffect(() => {

        setSummary(statistics);


        if (!open) return;


        loadFeedback();

    }, [

        open,

        startDate,

        endDate,

        location,

        keyword

    ]);


    /*
    ==========================================================
    RESET PAGE
    ==========================================================
    */

    useEffect(() => {

        setCurrentPage(1);

    }, [

        keyword,

        startDate,

        endDate,

        location

    ]);


    /*
    ==========================================================
    CLOSE
    ==========================================================
    */

    if (!open) return null;


    /*
    ==========================================================
    STAR RATING
    ==========================================================
    */

    function renderStars(value = 0) {

        const rating =
            Math.round(
                Number(value)
            );


        return (

            <div className="rating-stars">

                {

                    Array.from({
                        length: 5
                    }).map((_, index) => (

                        <Star

                            key={index}

                            size={14}

                            fill={
                                index < rating
                                    ? "currentColor"
                                    : "none"
                            }

                        />

                    ))

                }

            </div>

        );

    }


    /*
    ==========================================================
    STATUS
    ==========================================================
    */

    function renderStatus(item) {

        if (
            item.feedback_status ===
            "received"
        ) {

            return (

                <span className="badge-feedback">

                    Diterima

                </span>

            );

        }


        return (

            <span className="badge-waiting">

                Menunggu

            </span>

        );

    }


    /*
    ==========================================================
    EMPTY CELL
    ==========================================================
    */

    function renderCell(value) {

        if (

            value === null ||

            value === undefined ||

            String(value).trim() === ""

        ) {

            return (

                <span className="empty-value">

                    -

                </span>

            );

        }


        return value;

    }


    /*
    ==========================================================
    RENDER
    ==========================================================
    */

    return (

        <div className="modal-backdrop">

            <div className="modal customer-feedback-dialog">

                <div className="modal-header">

                    <div className="feedback-title">

                        <h2>

                            Feedback Customer

                        </h2>


                        <p>

                            Pantau kepuasan customer dan
                            performa PIC setelah tiket selesai.

                        </p>


                        <span className="feedback-last-update">

                            Terakhir diperbarui :{" "}

                            {
                                new Date()
                                    .toLocaleString(
                                        "id-ID"
                                    )
                            }

                        </span>

                    </div>


                    <div className="feedback-header-action">

                        <button
                            className="feedback-reminder-btn"
                            onClick={handleFeedbackReminder}
                            disabled={reminderLoading}
                        >

                            <Bell
                                size={12}
                            />

                            {reminderLoading
                                ? "Mengirim..."
                                : "Kirim Reminder"
                            }

                        </button>


                        <button
                            className="feedback-export-btn"
                            onClick={handleExport}
                        >

                            <Download
                                size={12}
                            />

                            Export Excel

                        </button>


                        <button
                            className="feedback-close-btn"
                            onClick={onClose}
                        >

                            <X
                                size={12}
                            />

                        </button>

                    </div>

                </div>


                <div className="modal-body">

                    {/* Summary */}

                    <div className="feedback-summary">

                        <div className="summary-card">

                            <div className="summary-icon response">

                                <Star
                                    size={24}
                                />

                            </div>


                            <div className="summary-content">

                                <small>

                                    Rata-rata Respons

                                </small>


                                <h3>

                                    {
                                        Number(
                                            summary.average_response_rating || 0
                                        ).toFixed(1)
                                    }

                                </h3>


                                <span>

                                    Rata-rata penilaian respons customer

                                </span>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon solution">

                                <Star
                                    size={24}
                                />

                            </div>


                            <div className="summary-content">

                                <small>

                                    Rata-rata Penyelesaian

                                </small>


                                <h3>

                                    {
                                        Number(
                                            summary.average_solution_rating || 0
                                        ).toFixed(1)
                                    }

                                </h3>


                                <span>

                                    Rata-rata kepuasan terhadap penyelesaian

                                </span>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon link">

                                <MessageSquareText
                                    size={24}
                                />

                            </div>


                            <div className="summary-content">

                                <small>

                                    Link Feedback Terkirim

                                </small>


                                <h3>

                                    {
                                        summary.total_link_sent || 0
                                    }

                                </h3>


                                <span>

                                    Google Form Berhasil Dikirim

                                </span>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon waiting">

                                <Clock3
                                    size={24}
                                />

                            </div>


                            <div className="summary-content">

                                <small>

                                    Belum Mengisi Feedback

                                </small>


                                <h3>

                                    {
                                        summary.waiting_feedback || 0
                                    }

                                </h3>


                                <span>

                                    Menunggu customer mengisi Google Form

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Filter */}

                    <div className="feedback-filter">

                        <div className="filter-item">

                            <label>

                                Tanggal Mulai

                            </label>


                            <input

                                type="date"

                                value={
                                    startDate
                                }

                                onChange={e =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }

                            />

                        </div>


                        <div className="filter-item">

                            <label>

                                Tanggal Akhir

                            </label>


                            <input

                                type="date"

                                value={
                                    endDate
                                }

                                onChange={e =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }

                            />

                        </div>


                        <div className="filter-item">

                            <label>

                                Lokasi

                            </label>


                            <select

                                className="assign-select"

                                value={
                                    location
                                }

                                onChange={e =>
                                    setLocation(
                                        e.target.value
                                    )
                                }

                            >

                                <option value="ALL">

                                    Semua Lokasi

                                </option>


                                <option value="AKR">

                                    HO - AKR Tower

                                </option>


                                <option value="HO">

                                    Head Office

                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Toolbar */}

                    <div className="feedback-toolbar">

                        <div className="search-box">

                            <Search
                                size={18}
                            />


                            <input

                                className="search"

                                value={
                                    keyword
                                }

                                onChange={e =>
                                    setKeyword(
                                        e.target.value
                                    )
                                }

                                placeholder="Cari cabang, PIC, kendala, komentar..."

                            />

                        </div>

                    </div>


                    {/* Loading */}

                    {
                        loading && (

                            <div className="feedback-loading">

                                <MessageSquareText

                                    size={20}

                                    strokeWidth={1.8}

                                />


                                <span>

                                    Memuat data feedback customer...

                                </span>

                            </div>

                        )
                    }


                    {/* Table */}

                    <div className="table-wrap">

                        <table className="tbl">

                            <thead>

                                <tr>

                                    <th>
                                        Tiket
                                    </th>

                                    <th>
                                        Aktivitas Feedback
                                    </th>

                                    <th>
                                        Cabang
                                    </th>

                                    <th>
                                        Kendala
                                    </th>

                                    <th>
                                        PIC
                                    </th>

                                    <th>
                                        Respons
                                    </th>

                                    <th>
                                        Penyelesaian
                                    </th>

                                    <th>
                                        Komentar
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {

                                    rows.length === 0

                                        ? (

                                            <tr>

                                                <td

                                                    colSpan={9}

                                                    className="empty"

                                                >

                                                    <div className="feedback-empty">

                                                        <MessageSquareText

                                                            size={46}

                                                            strokeWidth={1.4}

                                                        />


                                                        <h3>

                                                            Belum ada aktivitas feedback customer.

                                                            Aktivitas akan muncul setelah sistem
                                                            mengirim link Google Form kepada customer.

                                                        </h3>


                                                        <p>

                                                            Feedback Google Form akan muncul secara
                                                            otomatis setelah customer mengisi form
                                                            yang dikirim oleh sistem.

                                                        </p>

                                                    </div>

                                                </td>

                                            </tr>

                                        )

                                        : (

                                            paginatedRows.map(
                                                item => (

                                                    <tr

                                                        key={
                                                            item.ticket_id ||
                                                            item.id
                                                        }

                                                        className={

                                                            item.feedback_status ===
                                                            "waiting"

                                                                ? "feedback-row-waiting"

                                                                : ""

                                                        }

                                                    >

                                                        <td>

                                                            <span className="ticket-code">

                                                                {
                                                                    item.ticket_id ||
                                                                    "-"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            {

                                                                item.feedback_status ===
                                                                "received"

                                                                    ? new Date(
                                                                        item.feedback_at
                                                                    ).toLocaleString(
                                                                        "id-ID"
                                                                    )

                                                                    : new Date(
                                                                        item.feedback_sent_at ||
                                                                        item.selesai
                                                                    ).toLocaleString(
                                                                        "id-ID"
                                                                    )

                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                renderCell(
                                                                    item.branch
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                renderCell(
                                                                    item.issue_category
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                renderCell(
                                                                    item.engineer
                                                                )
                                                            }

                                                        </td>


                                                        <td>

                                                            {

                                                                item.response_rating

                                                                    ? renderStars(
                                                                        item.response_rating
                                                                    )

                                                                    : renderCell(
                                                                        null
                                                                    )

                                                            }

                                                        </td>


                                                        <td>

                                                            {

                                                                item.solution_rating

                                                                    ? renderStars(
                                                                        item.solution_rating
                                                                    )

                                                                    : renderCell(
                                                                        null
                                                                    )

                                                            }

                                                        </td>


                                                        <td>

                                                            <div

                                                                className="feedback-comment"

                                                                title={
                                                                    item.comment
                                                                }

                                                            >

                                                                {

                                                                    item.comment ||
                                                                    "-"

                                                                }

                                                            </div>

                                                        </td>


                                                        <td>

                                                            {

                                                                renderStatus(
                                                                    item
                                                                )

                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        )

                                }

                            </tbody>

                        </table>

                    </div>


                    {/* Pagination */}

                    <div className="pagination">

                        <div className="page-info">

                            Menampilkan{" "}

                            {
                                rows.length === 0
                                    ? 0
                                    : startIndex + 1
                            }

                            {"–"}

                            {
                                rows.length === 0
                                    ? 0
                                    : Math.min(
                                        startIndex + PAGE_SIZE,
                                        rows.length
                                    )
                            }

                            {" dari "}

                            {
                                rows.length
                            }

                            {" feedback"}

                        </div>


                        <div className="page-buttons">

                            <button

                                disabled={
                                    currentPage === 1
                                }

                                onClick={() =>
                                    setCurrentPage(
                                        currentPage - 1
                                    )
                                }

                            >

                                ◀

                            </button>


                            <span className="page-num">

                                {
                                    currentPage
                                }

                            </span>


                            <button

                                disabled={
                                    currentPage === totalPages
                                }

                                onClick={() =>
                                    setCurrentPage(
                                        currentPage + 1
                                    )
                                }

                            >

                                ▶

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}