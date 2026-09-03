import { useEffect, useState } from "react";

import {
    BarChart3,
    Users,
    UsersRound,
    MessagesSquare,
    RefreshCw,
    Settings2,
    ChevronDown,
    ChevronRight,
    LogOut,
    BookOpen
} from "lucide-react";


export default function Sidebar({
    view,
    onNavigate,
    collapsed
}) {


    // =====================================================
    // DEFAULT EXPANDED GROUP
    // =====================================================

    const getDefaultGroup = (currentView) => {

        if (
            currentView.startsWith("dashboard")
        ) {

            return "dashboard";

        }


        if (
            currentView.startsWith("akr-")
        ) {

            return "akr";

        }


        if (
            currentView.startsWith("ho-")
        ) {

            return "ho";

        }


        return null;

    };


    const [
        expandedGroup,
        setExpandedGroup
    ] = useState(
        getDefaultGroup(view)
    );


    // =====================================================
    // SYNC GROUP WITH CURRENT VIEW
    // =====================================================

    useEffect(() => {

        const group =
            getDefaultGroup(view);


        if (group) {

            setExpandedGroup(group);

        }

    }, [view]);


    // =====================================================
    // TOGGLE GROUP
    // =====================================================

    const toggleGroup = (group) => {

        setExpandedGroup((prev) =>
            prev === group
                ? null
                : group
        );

    };


    return (

        <aside
            className={`sidebar ${
                collapsed
                    ? "collapsed"
                    : ""
            }`}
        >


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="brand">

                <img
                    src="/logo-helpdesk.png"
                    alt="PGI Helpdesk"
                    className="brand-logo"
                />


                {!collapsed && (

                    <div className="brand-text">

                        <div className="brand-company">

                            PUSAT GADAI INDONESIA

                        </div>


                        <div className="brand-division">

                            IT SUPPORT HELPDESK

                        </div>

                    </div>

                )}

            </div>


            {/* =================================================
                MENU
            ================================================= */}

            <div className="sidebar-content">

                <nav className="sidebar-menu">


                    {!collapsed && (

                        <>

                            <div className="nav-label">

                                MENU

                            </div>


                            {/* =================================================
                                SELURUH PERFORMA
                            ================================================= */}

                            <div className="nav-group">

                                <button
                                    type="button"
                                    className="nav-group-title nav-group-toggle"
                                    onClick={() =>
                                        toggleGroup(
                                            "dashboard"
                                        )
                                    }
                                >

                                    <div className="nav-group-left">

                                        <BarChart3
                                            size={14}
                                            strokeWidth={2.5}
                                        />

                                        <span>

                                            SELURUH PERFORMA

                                        </span>

                                    </div>


                                    <ChevronRight
                                        size={16}
                                        className={
                                            expandedGroup ===
                                            "dashboard"
                                                ? "accordion-arrow n"
                                                : "accordion-arrow"
                                        }
                                    />

                                </button>


                                {expandedGroup ===
                                    "dashboard" && (

                                    <>

                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "dashboard-overview"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "dashboard-overview"
                                                )
                                            }
                                        >

                                            Ringkasan

                                        </button>


                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "dashboard-analytics"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "dashboard-analytics"
                                                )
                                            }
                                        >

                                            Analitik

                                        </button>


                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "dashboard-trend"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "dashboard-trend"
                                                )
                                            }
                                        >

                                            Tren

                                        </button>

                                    </>

                                )}

                            </div>


                            {/* =================================================
                                HO - AKR TOWER
                            ================================================= */}

                            <div className="nav-group">

                                <button
                                    type="button"
                                    className="nav-group-title nav-group-toggle"
                                    onClick={() =>
                                        toggleGroup(
                                            "akr"
                                        )
                                    }
                                >

                                    <div className="nav-group-left">

                                        <Users
                                            size={15}
                                            strokeWidth={2.5}
                                        />

                                        <span>

                                            HO - AKR Tower

                                        </span>

                                    </div>


                                    {expandedGroup === "akr"

                                        ? (

                                            <ChevronDown
                                                size={16}
                                            />

                                        )

                                        : (

                                            <ChevronRight
                                                size={16}
                                            />

                                        )

                                    }

                                </button>


                                {expandedGroup === "akr" && (

                                    <>

                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "akr-overview"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "akr-overview"
                                                )
                                            }
                                        >

                                            Ringkasan

                                        </button>


                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "akr-analytics"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "akr-analytics"
                                                )
                                            }
                                        >

                                            Analitik

                                        </button>


                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "akr-trend"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "akr-trend"
                                                )
                                            }
                                        >

                                            Tren

                                        </button>

                                    </>

                                )}

                            </div>


                            {/* =================================================
                                HEAD OFFICE
                            ================================================= */}

                            <div className="nav-group">

                                <button
                                    type="button"
                                    className="nav-group-title nav-group-toggle"
                                    onClick={() =>
                                        toggleGroup(
                                            "ho"
                                        )
                                    }
                                >

                                    <div className="nav-group-left">

                                        <UsersRound
                                            size={15}
                                            strokeWidth={2.5}
                                        />

                                        <span>

                                            Head Office

                                        </span>

                                    </div>


                                    {expandedGroup === "ho"

                                        ? (

                                            <ChevronDown
                                                size={16}
                                            />

                                        )

                                        : (

                                            <ChevronRight
                                                size={16}
                                            />

                                        )

                                    }

                                </button>


                                {expandedGroup === "ho" && (

                                    <>

                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "ho-overview"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "ho-overview"
                                                )
                                            }
                                        >

                                            Ringkasan

                                        </button>


                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "ho-analytics"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "ho-analytics"
                                                )
                                            }
                                        >

                                            Analitik

                                        </button>


                                        <button
                                            className={`nav-link ${
                                                view ===
                                                "ho-trend"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onNavigate(
                                                    "ho-trend"
                                                )
                                            }
                                        >

                                            Tren

                                        </button>

                                    </>

                                )}

                            </div>


                            {/* =================================================
                                DIVIDER
                            ================================================= */}

                            <div className="nav-divider" />

                        </>

                    )}


                    {/* =================================================
                        HELPDESK
                    ================================================= */}

                    <button
                        type="button"
                        className={`nav-item nav-main ${
                            view === "helpdesk"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            onNavigate(
                                "helpdesk"
                            )
                        }
                    >

                        <MessagesSquare
                            size={15}
                            strokeWidth={2.5}
                        />


                        {!collapsed && (

                            <span className="nav-text nav-main-title">

                                HELPDESK

                            </span>

                        )}

                    </button>


                    {/* =================================================
                        PENGATURAN OPERASIONAL
                    ================================================= */}

                    {!collapsed && (

                        <>

                            <div className="nav-divider" />


                            <div className="nav-group">

                                <button
                                    type="button"
                                    className="nav-group-title nav-group-toggle"
                                >

                                    <div className="nav-group-left">

                                        <Settings2
                                            size={14}
                                            strokeWidth={2.5}
                                        />

                                        <span>

                                            PENGATURAN OPERASIONAL

                                        </span>

                                    </div>

                                </button>


                                <button
                                    type="button"
                                    className={`nav-link ${
                                        view ===
                                        "team-rotation"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        onNavigate(
                                            "team-rotation"
                                        )
                                    }
                                >

                                    <RefreshCw
                                        size={14}
                                    />


                                    <span className="nav-text">

                                        Rotasi Tim

                                    </span>

                                </button>

                                <button
                                    type="button"
                                    className={`nav-link ${
                                        view ===
                                        "helpdesk-group-management"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        onNavigate(
                                            "helpdesk-group-management"
                                        )
                                    }
                                >

                                    <Users
                                        size={14}
                                    />

                                    <span className="nav-text">

                                        Manajemen Grup Helpdesk

                                    </span>

                                </button>

                                <button
                                  type="button"
                                  className={`nav-link ${
                                      view ===
                                      "knowledge-base"
                                          ? "active"
                                          : ""
                                  }`}
                                  onClick={() =>
                                      onNavigate(
                                          "knowledge-base"
                                      )
                                  }
                              >

                                  <BookOpen
                                      size={14}
                                  />

                                  <span className="nav-text">

                                      Knowledge Base

                                  </span>

                              </button>

                            </div>

                        </>

                    )}

                </nav>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            {/* =================================================
                LOGOUT
            ================================================= */}

            <div className="sidebar-logout">

                <button
                    type="button"
                    className="logout-button"
                    onClick={async () => {

                        try {

                            await fetch(
                                "/logout",
                                {
                                    method: "POST"
                                }
                            );

                            window.location.replace("/");

                        } catch (err) {

                            console.error(
                                "Logout gagal:",
                                err
                            );

                        }

                    }}
                >

                    <LogOut
                        size={16}
                        strokeWidth={2.2}
                    />

                    {!collapsed && (

                        <span className="logout-text">
                            Logout
                        </span>

                    )}

                </button>

            </div>

            <div className="sidebar-foot">

                <div className="version">

                    PGI Helpdesk

                </div>

                <small>

                    v{__APP_VERSION__}

                </small>

            </div>

        </aside>

    );

}