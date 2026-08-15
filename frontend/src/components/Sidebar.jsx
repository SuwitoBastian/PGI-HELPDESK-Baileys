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

            <div className="nav-label">
              MENU
            </div>

          )}


          {!collapsed && (

            <>


              {/* =================================================
                  ALL PERFORMANCE
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
                      ALL PERFORMANCE
                    </span>

                  </div>


                  <ChevronRight
                    size={16}
                    className={
                      expandedGroup ===
                      "dashboard"

                        ? "accordion-arrow open"

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
                      Overview
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
                      Analytics
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
                      Trend
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
                    toggleGroup("akr")
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
                      Overview
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
                      Analytics
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
                      Trend
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
                    toggleGroup("ho")
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
                      Overview
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
                      Analytics
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
                      Trend
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
              onNavigate("helpdesk")
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
              OPERATIONAL SETTINGS
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
                      OPERATIONAL SETTINGS
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
                    Team Rotation
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

      <div className="sidebar-foot">

        <div className="version">
          PGI Helpdesk
        </div>

        <small>
          v3.0.0
        </small>

      </div>

    </aside>

  );

}