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

  const getDefaultGroup = (currentView) => {
    if (currentView.startsWith("dashboard")) return "dashboard";
    if (currentView.startsWith("team-a")) return "team-a";
    if (currentView.startsWith("team-b")) return "team-b";
    return null;
  };

  const [expandedGroup, setExpandedGroup] = useState(
    getDefaultGroup(view)
  );

  useEffect(() => {
    const group = getDefaultGroup(view);

    if (group) {
      setExpandedGroup(group);
    }
  }, [view]);

  const toggleGroup = (group) => {
    setExpandedGroup((prev) =>
      prev === group ? null : group
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* Brand */}
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

      {/* Menu */}
      <div className="sidebar-content">
        <nav className="sidebar-menu">

          {!collapsed && (
            <div className="nav-label">
              MENU
            </div>
          )}

          {!collapsed && (
            <>

              {/* ALL PERFORMANCE */}
              <div className="nav-group">

                <button
                  type="button"
                  className="nav-group-title nav-group-toggle"
                  onClick={() => toggleGroup("dashboard")}
                >
                  <div className="nav-group-left">
                    <BarChart3 size={14} strokeWidth={2.5} />
                    <span>ALL PERFORMANCE</span>
                  </div>

                  <ChevronRight
                    size={16}
                    className={
                      expandedGroup === "dashboard"
                        ? "accordion-arrow open"
                        : "accordion-arrow"
                    }
                  />

                </button>

                {expandedGroup === "dashboard" && (
                  <>

                    <button
                      className={`nav-link ${
                        view === "dashboard-overview" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("dashboard-overview")}
                    >
                      Overview
                    </button>

                    <button
                      className={`nav-link ${
                        view === "dashboard-analytics" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("dashboard-analytics")}
                    >
                      Analytics
                    </button>

                    <button
                      className={`nav-link ${
                        view === "dashboard-trend" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("dashboard-trend")}
                    >
                      Trend
                    </button>

                  </>
                )}

              </div>

              {/* TEAM A */}
              <div className="nav-group">

                <button
                  type="button"
                  className="nav-group-title nav-group-toggle"
                  onClick={() => toggleGroup("team-a")}
                >
                  <div className="nav-group-left">
                    <Users size={15} strokeWidth={2.5} />
                    <span>TEAM A</span>
                  </div>

                  {expandedGroup === "team-a"
                    ? <ChevronDown size={16} />
                    : <ChevronRight size={16} />
                  }
                </button>

                {expandedGroup === "team-a" && (
                  <>

                    <button
                      className={`nav-link ${
                        view === "team-a-overview" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("team-a-overview")}
                    >
                      Overview
                    </button>

                    <button
                      className={`nav-link ${
                        view === "team-a-analytics" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("team-a-analytics")}
                    >
                      Analytics
                    </button>

                    <button
                      className={`nav-link ${
                        view === "team-a-trend" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("team-a-trend")}
                    >
                      Trend
                    </button>

                  </>
                )}

              </div>

              {/* TEAM B */}
              <div className="nav-group">

                <button
                  type="button"
                  className="nav-group-title nav-group-toggle"
                  onClick={() => toggleGroup("team-b")}
                >
                  <div className="nav-group-left">
                    <UsersRound size={15} strokeWidth={2.5} />
                    <span>TEAM B</span>
                  </div>

                  {expandedGroup === "team-b"
                    ? <ChevronDown size={16} />
                    : <ChevronRight size={16} />
                  }
                </button>

                {expandedGroup === "team-b" && (
                  <>

                    <button
                      className={`nav-link ${
                        view === "team-b-overview" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("team-b-overview")}
                    >
                      Overview
                    </button>

                    <button
                      className={`nav-link ${
                        view === "team-b-analytics" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("team-b-analytics")}
                    >
                      Analytics
                    </button>

                    <button
                      className={`nav-link ${
                        view === "team-b-trend" ? "active" : ""
                      }`}
                      onClick={() => onNavigate("team-b-trend")}
                    >
                      Trend
                    </button>

                  </>
                )}

              </div>

              <div className="nav-divider" />

            </>
          )}

          {/* Helpdesk */}
          <button
            type="button"
            className={`nav-item nav-main ${view === "helpdesk" ? "active" : ""}`}
            onClick={() => onNavigate("helpdesk")}
          >
            <MessagesSquare size={15} strokeWidth={2.5} />

            {!collapsed && (
              <span className="nav-text nav-main-title">
                HELPDESK
              </span>
            )}
          </button>

          {!collapsed && (
            <>
              <div className="nav-divider" />

              <div className="nav-group">

                <button
                  type="button"
                  className="nav-group-title nav-group-toggle"
                >
                  <div className="nav-group-left">
                    <Settings2 size={14} strokeWidth={2.5} />
                    <span>OPERATIONAL SETTINGS</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`nav-link ${
                    view === "team-rotation" ? "active" : ""
                  }`}
                  onClick={() => onNavigate("team-rotation")}
                >
                  <RefreshCw size={14} />
                  <span className="nav-text">
                    Team Rotation
                  </span>
                </button>

              </div>

            </>
          )}

        </nav>

      </div>

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