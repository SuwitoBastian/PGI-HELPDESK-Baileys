import React from "react";
import { PAGE_SIZES } from "./helpers";

function TicketPagination({

    page,

    setPage,

    pageSize,

    setPageSize,

    totalRows

}) {

    const totalPages = Math.max(
        1,
        Math.ceil(totalRows / pageSize)
    );

    const start =
        totalRows === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const end = Math.min(
        page * pageSize,
        totalRows
    );

    return (

        <div className="ticket-pagination">

            <div className="pagination-info">

                Menampilkan

                <strong>

                    {start}-{end}

                </strong>

                dari

                <strong>

                    {totalRows}

                </strong>

                ticket

            </div>

            <div className="pagination-actions">

                <select

                    value={pageSize}

                    onChange={(e) => {

                        setPageSize(Number(e.target.value));
                        setPage(1);

                    }}

                >

                    {

                        PAGE_SIZES.map(size => (

                            <option
                                key={size}
                                value={size}
                            >

                                {size} / halaman

                            </option>

                        ))

                    }

                </select>

                <button

                    disabled={page <= 1}

                    onClick={() => setPage(page - 1)}

                >

                    ←

                </button>

                <span>

                    {page} / {totalPages}

                </span>

                <button

                    disabled={page >= totalPages}

                    onClick={() => setPage(page + 1)}

                >

                    →

                </button>

            </div>

        </div>

    );

}

export default TicketPagination;