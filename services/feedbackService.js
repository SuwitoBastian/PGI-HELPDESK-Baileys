const ExcelJS = require("exceljs");

const feedbackRepository = require("../repositories/feedbackRepository");
const ticketRepository = require("../repositories/ticketRepository");

/* ==========================================================
   Submit Feedback
========================================================== */

function submitFeedback({

    ticketId = null,
    branch,
    issueCategory,
    engineer,
    responseRating,
    solutionRating,
    comment,
    feedbackAt,
    source = "GOOGLE_FORM"

}) {

    /* ==========================
       Normalize
    ========================== */

    responseRating = Number(responseRating);
    solutionRating = Number(solutionRating);

    /* ==========================
       Validation
    ========================== */

    if (!branch?.trim())
        throw new Error("Branch wajib diisi.");

    if (!issueCategory?.trim())
        throw new Error("Kategori kendala wajib diisi.");

    if (!engineer?.trim())
        throw new Error("Engineer wajib diisi.");

    if (
        !Number.isInteger(responseRating) ||
        responseRating < 1 ||
        responseRating > 5
    )
        throw new Error("Response Rating harus berupa angka 1-5.");

    if (
        !Number.isInteger(solutionRating) ||
        solutionRating < 1 ||
        solutionRating > 5
    )
        throw new Error("Solution Rating harus berupa angka 1-5.");

    if (!feedbackAt)
        throw new Error("Feedback Time wajib diisi.");

    /* ==========================
       Ticket Validation (Optional)
    ========================== */

    if (ticketId) {

        const ticket =
            ticketRepository.findById(ticketId);

        if (!ticket)
            throw new Error("Ticket tidak ditemukan.");

        const existing =
            feedbackRepository.findByTicket(ticketId);

        if (existing)
            throw new Error(
                "Feedback untuk ticket ini sudah pernah dikirim."
            );

    }

    /* ==========================
       Save
    ========================== */

    return feedbackRepository.create({

        ticketId: ticketId || null,

        branch: branch.trim(),

        issueCategory: issueCategory.trim(),

        engineer: engineer.trim(),

        responseRating,

        solutionRating,

        comment: comment?.trim() || "",

        feedbackAt,

        source

    });

}

/* ==========================================================
   Dashboard
========================================================== */

function getLatestFeedback(limit = 5) {

    return feedbackRepository.findLatest(limit);

}

/* ==========================================================
   List
========================================================== */

function getAllFeedback(filters = {}) {

    return feedbackRepository.findAll(filters);

}

/* ==========================================================
   Statistics
========================================================== */

function getStatistics(filters = {}) {

    return feedbackRepository.getStatistics(filters);

}

/* ==========================================================
   Export Excel
========================================================== */
async function exportExcel(filters = {}, res) {

    const rows = getAllFeedback(filters);
    const statistics = getStatistics(filters);
    console.log(statistics);

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "PGI Helpdesk V3";
    workbook.company = "Pusat Gadai Indonesia";
    workbook.created = new Date();

    const worksheet =
        workbook.addWorksheet("Customer Feedback");

    // ======================================================
    // TITLE
    // ======================================================

    worksheet.mergeCells("A1:J1");

    const title = worksheet.getCell("A1");

    title.value = "CUSTOMER FEEDBACK REPORT";

    title.font = {
        name: "Times New Roman",
        bold: true,
        size: 20,
        color: {
            argb: "1F2937"
        }
    };

    worksheet.getRow(1).height = 24;

    title.alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    worksheet.getRow(1).height = 30;
    // ======================================================
    // SUBTITLE
    // ======================================================

    worksheet.mergeCells("A2:J2");

    const subtitle = worksheet.getCell("A2");

    const generatedDate = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date());

    subtitle.value = generatedDate;

    subtitle.font = {
        name: "Times New Roman",
        size: 11,
        italic: true,
        color: {
            argb: "808080"
        }
    };

    subtitle.alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    // ======================================================
    // SUMMARY
    // ======================================================

    worksheet.addRow([]);
    worksheet.addRow([]);

    const summaryTitle = worksheet.addRow(["SUMMARY"]);

    worksheet.mergeCells(`A${summaryTitle.number}:B${summaryTitle.number}`);

    summaryTitle.height = 26;

    const summaryCell = summaryTitle.getCell(1);

    summaryCell.font = {
        bold: true,
        size: 14,
        color: {
            argb: "FFFFFFFF"
        }
    };

    summaryCell.alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    summaryCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "0D6EFD"
        }
    };

    summaryCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    // ========================================
    // HEADER
    // ========================================

    const summaryHeader = worksheet.addRow([
        "Summary",
        "Value"
    ]);

    summaryHeader.height = 22;

    summaryHeader.eachCell(cell => {

        cell.font = {
            name: "Times New Roman",
            size: 10,
            bold: false,
            color: {
                argb: "FFFFFFFF"
            }
        };

        cell.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "0D6EFD"
            }
        };

        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };

    });

    // ========================================
    // DATA
    // ========================================

    const summaryRows = [

        [
            "Avg Response Rating",
            `${Number(statistics.average_response_rating || 0).toFixed(2)} / 5`
        ],

        [
            "Avg Solution Rating",
            `${Number(statistics.average_solution_rating || 0).toFixed(2)} / 5`
        ],

        [
            "Feedback Dikirim",
            statistics.total_link_sent
        ],

        [
            "Feedback Diterima",
            statistics.total_feedback
        ],

        [
            "Waiting Feedback",
            statistics.waiting_feedback
        ]

    ];

    summaryRows.forEach(data => {

        const row = worksheet.addRow(data);

        row.font = {
            name: "Times New Roman",
            size: 10,
        };

        row.height = 22;

        row.getCell(1).alignment = {
            horizontal: "left",
            vertical: "middle"
        };

        row.getCell(2).alignment = {
            horizontal: "right",
            vertical: "middle"
        };

        row.eachCell(cell => {

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };

        });

    });

    // Highlight Waiting Feedback
    const waitingRow = worksheet.lastRow;

    waitingRow.eachCell(cell => {

        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FF0000"
            }
        };

        cell.font = {
            name: "Times New Roman",
            size: 10,
            bold: false,
            color: {
                argb: "000000"
            }
        };

    });

    // Lebar Summary
    worksheet.getColumn(1).width = 32;
    worksheet.getColumn(2).width = 18;

    // ======================================================
    // DETAIL FEEDBACK
    // ======================================================

    worksheet.addRow([]);
    worksheet.addRow([]);

    const detailTitle = worksheet.addRow(["DETAIL FEEDBACK"]);

    detailTitle.getCell(1).font = {
        bold: true,
        color: { argb: "FFFFFFFF" }
    };

    detailTitle.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "0D6EFD"
        }
    };

    detailTitle.height = 22;

    detailTitle.getCell(1).font = {
        bold: true,
        color: {
            argb: "FFFFFFFF"
        }
    };

    detailTitle.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    detailTitle.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "0D6EFD"
        }
    };

    worksheet.addRow([]);
    worksheet.addRow([]);

    const header = worksheet.addRow([
        "Ticket",
        "Cabang",
        "Kategori Kendala",
        "Engineer",
        "Team",
        "Response Rating",
        "Solution Rating",
        "Status",
        "Feedback Time",
        "Komentar"
    ]);

    header.height = 24;

    header.font = {
        name: "Times New Roman",
        size: 10,
        bold: false,
        color: {
            argb: "FFFFFFFF"
        }
    };

    header.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true
    };

    header.eachCell((cell) => {

        cell.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {
                argb: "0D6EFD"
            }

        };

        cell.border = {

            top: {
                style: "thin"
            },

            left: {
                style: "thin"
            },

            bottom: {
                style: "thin"
            },

            right: {
                style: "thin"
            }

        };

    });

    rows.forEach(item => {

        const feedbackTime =
            item.feedback_status === "received"
                ? item.feedback_at
                : item.feedback_sent_at;

        const row = worksheet.addRow([

            item.ticket_id,

            item.branch,

            item.issue_category || "-",

            item.engineer,

            item.team || "-",

            item.response_rating ?? "-",

            item.solution_rating ?? "-",

            item.feedback_status === "received"
                ? "Received"
                : "Waiting",

            feedbackTime
                ? new Date(feedbackTime)
                : null,

            item.comment || "-"

        ]);

        // Warna baris Waiting
        if (item.feedback_status !== "received") {

            row.eachCell(cell => {

                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "FF0000"
                    }
                };

                cell.font = {
                    color: {
                        argb: "000000"
                    }
                };

            });

        }

        // Border semua cell
        row.eachCell(cell => {

            cell.font = {
                name: "Times New Roman",
                size: 10,
            };

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };

            cell.alignment = {
                vertical: "middle",
                horizontal: "center"
            };

        });

        // Highlight status
        const statusCell = row.getCell(8);

        statusCell.font = {
            name: "Times New Roman",
            size: 10,
            bold: false,
            color: {
                argb: "000000"
            }
        };

        if (item.feedback_status === "received") {

            statusCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "FFFFFF"
                }
            };

        } else {

            statusCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "FF0000"
                }
            };

        }

    // Highlight Kategori Kendala kosong
    // ======================================

    const categoryCell = row.getCell(3);

    if (categoryCell.value === "-") {

        categoryCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "FF0000"
            }
        };

        categoryCell.font = {
            color: {
                argb: "000000"
            }
        };

    }

    });
    
    worksheet.columns.forEach(column => {

        let max = 15;

        column.eachCell({

            includeEmpty: true

        }, cell => {

            const value =
                cell.value
                    ? cell.value.toString()
                    : "";

            max = Math.max(
                max,
                value.length + 3
            );

            cell.border = {

                top: {
                    style: "thin"
                },

                left: {
                    style: "thin"
                },

                bottom: {
                    style: "thin"
                },

                right: {
                    style: "thin"
                }

            };

        });

        column.width = Math.min(max, 50);

    });

    // Lebar khusus Summary
    worksheet.getColumn(1).width = 32; // Kolom Summary
    worksheet.getColumn(2).width = 18; // Kolom Value

    worksheet.autoFilter = {
        from: {
            row: header.number,
            column: 1
        },
        to: {
            row: header.number,
            column: 10
        }
    };

    worksheet.getColumn(9).numFmt =
    "dd/mm/yyyy hh:mm:ss";

    const filename =
        `Customer_Feedback_${new Date().toISOString().slice(0,10)}.xlsx`;

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        `attachment; filename="${filename}"`

    );

    await workbook.xlsx.write(res);

    res.end();

}
module.exports = {

    submitFeedback,

    getLatestFeedback,

    getAllFeedback,

    getStatistics,

    exportExcel

};