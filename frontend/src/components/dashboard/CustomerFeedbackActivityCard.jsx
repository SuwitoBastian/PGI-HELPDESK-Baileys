import {
    MessageSquareText,
    CheckCircle2,
    Clock3,
    Star,
    ArrowRight
} from "lucide-react";

import { useMemo, useState } from "react";

import CustomerFeedbackDialog from "./CustomerFeedbackDialog";


function formatTime(dateString) {

    if (!dateString) return "-";

    return new Date(dateString).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    });

}


function getLocationLabel(branch) {

    switch (branch) {

        case "AKR":
            return "HO - AKR Tower";

        case "HO":
            return "Head Office";

        default:
            return branch || "-";

    }

}


function renderStars(response = 0, solution = 0) {

    const rating = Math.round(
        ((Number(response) || 0) +
        (Number(solution) || 0)) / 2
    );


    return (

        <div className="feedback-stars">

            {Array.from({ length: 5 }).map((_, index) => (

                <Star
                    key={index}
                    size={14}
                    fill={
                        index < rating
                            ? "currentColor"
                            : "none"
                    }
                />

            ))}

        </div>

    );

}


export default function CustomerFeedbackActivityCard({

    feedback = [],

    statistics = {}

}) {


    const [openDialog, setOpenDialog] =
        useState(false);


    const recentFeedback =
        useMemo(() => {

            return [...feedback]
                .sort(
                    (a, b) =>
                        new Date(
                            b.feedback_at ||
                            b.feedback_sent_at ||
                            b.selesai ||
                            b.assigned_at ||
                            b.waktu
                        ) -
                        new Date(
                            a.feedback_at ||
                            a.feedback_sent_at ||
                            a.selesai ||
                            a.assigned_at ||
                            a.waktu
                        )
                )
                .slice(0, 5);

        }, [feedback]);


    function getStatus(item) {

        if (item.feedback_status === "received") {

            return {

                icon:
                    <CheckCircle2 size={18} />,

                color:
                    "success",

                label:
                    "Diterima"

            };

        }


        return {

            icon:
                <Clock3 size={18} />,

            color:
                "waiting",

            label:
                "Menunggu Feedback"

        };

    }


    return (

        <>

            <div className="card customer-feedback-card">

                <div className="card-header">

                    <div className="feedback-header-left">

                        <div className="card-title">

                            <MessageSquareText size={18} />

                            <span>
                                Aktivitas Feedback Customer
                            </span>

                        </div>


                        <p className="card-description">

                            Monitoring feedback customer yang telah
                            dikirim maupun yang masih menunggu respon.

                        </p>

                    </div>


                    <button
                        className="btn-link-inline"
                        onClick={() => setOpenDialog(true)}
                    >

                        Lihat Semua

                        <ArrowRight size={16} />

                    </button>

                </div>


                <div className="card-content">

                    {recentFeedback.length === 0 ? (

                        <div className="feedback-empty">

                            <MessageSquareText
                                size={38}
                                strokeWidth={1.5}
                            />

                            <h4>

                                Belum ada aktivitas feedback

                            </h4>

                            <p>

                                Aktivitas akan muncul setelah link
                                Google Form dikirim ke customer.

                            </p>

                        </div>

                    ) : (

                        <div className="feedback-list">

                            {recentFeedback.map(item => {

                                const status =
                                    getStatus(item);


                                return (

                                    <div
                                        key={
                                            item.ticket_id ||
                                            item.id
                                        }
                                        className="feedback-item"
                                    >

                                        <div
                                            className={
                                                `feedback-status ${status.color}`
                                            }
                                        >

                                            {status.icon}

                                        </div>


                                        <div className="feedback-body">

                                            <div className="feedback-top">

                                                <div>

                                                    <div className="feedback-branch">

                                                        {
                                                            getLocationLabel(
                                                                item.branch
                                                            )
                                                        }

                                                    </div>


                                                    <div className="feedback-ticket">

                                                        Tiket : {
                                                            item.ticket_id ||
                                                            "-"
                                                        }

                                                    </div>


                                                    <div className="feedback-issue">

                                                        {
                                                            item.issue_category ||
                                                            "-"
                                                        }

                                                    </div>

                                                </div>


                                                <div className="feedback-time">

                                                    {
                                                        formatTime(
                                                            item.feedback_status === "received"
                                                                ? item.feedback_at
                                                                : item.feedback_sent_at
                                                        )
                                                    }

                                                </div>

                                            </div>


                                            {item.feedback_status === "received" &&
                                                renderStars(
                                                    item.response_rating,
                                                    item.solution_rating
                                                )
                                            }


                                            <div
                                                className="feedback-comment-box"
                                                title={
                                                    item.feedback_status === "received"
                                                        ? item.comment
                                                        : "Menunggu respon customer..."
                                                }
                                            >

                                                "

                                                {
                                                    item.feedback_status === "received"
                                                        ? (
                                                            item.comment ||
                                                            "Tidak ada komentar."
                                                        )
                                                        : "Menunggu respon customer..."
                                                }

                                                "

                                            </div>


                                            <div className="feedback-timeline">

                                                <div>

                                                    <strong>
                                                        Selesai
                                                    </strong>

                                                    <span>

                                                        {
                                                            formatTime(
                                                                item.selesai
                                                            )
                                                        }

                                                    </span>

                                                </div>


                                                <div>

                                                    <strong>

                                                        {
                                                            item.feedback_status === "received"
                                                                ? "Feedback"
                                                                : "Link Terkirim"
                                                        }

                                                    </strong>

                                                    <span>

                                                        {
                                                            item.feedback_status === "received"
                                                                ? formatTime(
                                                                    item.feedback_at
                                                                )
                                                                : formatTime(
                                                                    item.feedback_sent_at
                                                                )
                                                        }

                                                    </span>

                                                </div>

                                            </div>


                                            <div
                                                className={
                                                    `feedback-badge ${status.color}`
                                                }
                                            >

                                                {status.label}

                                            </div>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </div>

            </div>


            <CustomerFeedbackDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                statistics={statistics}
            />

        </>

    );

}