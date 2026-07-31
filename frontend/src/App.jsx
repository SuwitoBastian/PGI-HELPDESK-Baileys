import { useEffect, useMemo, useState } from 'react'
import { LayoutDashboard, Headset } from 'lucide-react'

import { useDashboard } from './hooks/useDashboard'
import { MASTER_PIC } from "./constants/picList";
import { ToastProvider } from "./context/ToastContext";

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import StatCards from './components/StatCards'
import StatusTabs from './components/StatusTabs'
import TicketTable from './components/TicketTable'
import SummaryView from './components/SummaryView'
import FilterCard from './components/FilterCard'
import TeamRotation from "./components/settings/TeamRotation";

const PAGES = {

  // ===========================
  // ALL PERFORMANCE
  // ===========================

  "dashboard-overview": {
    title: "All Performance",
    subtitle: "Ringkasan performa seluruh Helpdesk.",
    icon: LayoutDashboard,
  },

  "dashboard-analytics": {
    title: "All Performance",
    subtitle: "Analisis performa seluruh Helpdesk.",
    icon: LayoutDashboard,
  },

  "dashboard-trend": {
  title: "All Performance",
  subtitle: "Trend performa seluruh Helpdesk.",
  icon: LayoutDashboard,
},

  // ===========================
  // TEAM A
  // ===========================

  "team-a-overview": {
    title: "Team A",
    subtitle: "Ringkasan performa Team A.",
    icon: LayoutDashboard,
  },

  "team-a-analytics": {
    title: "Team A",
    subtitle: "Analisis performa Team A.",
    icon: LayoutDashboard,
  },

  "team-a-trend": {
  title: "Team A",
  subtitle: "Trend performa Team A.",
  icon: LayoutDashboard,
},

  // ===========================
  // TEAM B
  // ===========================

  "team-b-overview": {
    title: "Team B",
    subtitle: "Ringkasan performa Team B.",
    icon: LayoutDashboard,
  },

  "team-b-analytics": {
    title: "Team B",
    subtitle: "Analisis performa Team B.",
    icon: LayoutDashboard,
  },

  "team-b-trend": {
  title: "Team B",
  subtitle: "Trend performa Team B.",
  icon: LayoutDashboard,
},

  // ===========================
  // HELPDESK
  // ===========================

  helpdesk: {
    title: "Helpdesk",
    subtitle: "Kelola tiket Helpdesk.",
    icon: Headset,
  },

  //Team Rotation

  "team-rotation": {
  title: "Operational Settings",
  subtitle: "Konfigurasi Team Rotation.",
  icon: LayoutDashboard,
  },

  // ===========================
  // LEGACY
  // ===========================

  legacy: {
    title: "Dashboard Lama",
    subtitle: "Dashboard versi sebelumnya.",
    icon: LayoutDashboard,
  },

};

export default function App() {

  // =====================================================
  // PAGE
  // =====================================================

const [view, setView] = useState(() => {
  return (
    localStorage.getItem("helpdesk-page") ||
    "dashboard-overview"
  );
});

const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
  return localStorage.getItem("helpdesk-sidebar") === "true";
});

const [theme, setTheme] = useState(() => {
    return localStorage.getItem("helpdesk-theme") || "light";
});

const [filter, setFilter] = useState('ALL')

  // =====================================================
  // FILTER FORM
  // =====================================================

  const [startInput, setStartInput] = useState('')
  const [endInput, setEndInput] = useState('')

  // =====================================================
  // FILTER ACTIVE
  // =====================================================

  const [startFilter, setStartFilter] = useState('')
  const [endFilter, setEndFilter] = useState('')

  const selectedTeam = useMemo(() => {

  if (view.startsWith("team-a")) {
    return "TEAM_A";
  }

  if (view.startsWith("team-b")) {
    return "TEAM_B";
  }

  return "";

}, [view]);

  // =====================================================
// SAVE LAST PAGE
// =====================================================

useEffect(() => {

  localStorage.setItem(
    'helpdesk-page',
    view
  )

}, [view])

useEffect(() => {

  localStorage.setItem(
    'helpdesk-sidebar',
    sidebarCollapsed
  )

}, [sidebarCollapsed])

// ============================
// THEME
// ============================

useEffect(() => {

  document.documentElement.setAttribute(
    "data-theme",
    theme
  );

  localStorage.setItem(
    "helpdesk-theme",
    theme
  );

}, [theme]);

  // =====================================================
  // DASHBOARD
  // =====================================================

  const {
    data,
    error,
    loading,
    refresh
  } = useDashboard(
    startFilter,
    endFilter,
    selectedTeam
  );
 
  // =====================================================
  // COUNTS
  // =====================================================

  const counts = useMemo(() => {

    if (!data) {

      return {
        ALL: 0,
        OPEN: 0,
        PROCESS: 0,
        CLOSED: 0,
      }

    }

    return {

      ALL: data.total || 0,

      OPEN: data.open || 0,

      PROCESS: data.process || 0,

      CLOSED: data.closed || 0,

    }

  }, [data])

  // =====================================================
  // PAGE INFO
  // =====================================================

  const page = PAGES[view]

  // =====================================================
  // FILTER
  // =====================================================

  function applyFilter() {

    if (startInput && endInput && startInput > endInput) {

      alert('Tanggal mulai tidak boleh lebih besar dari tanggal selesai.')

      return

    }

    setStartFilter(startInput)

    setEndFilter(endInput)

  }

  function resetFilter() {

    setStartInput('')
    setEndInput('')

    setStartFilter('')
    setEndFilter('')

  }

  // =====================================================
  // RENDER
  // =====================================================
return (

  <ToastProvider>

    <div className={`layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

      <Sidebar
        view={view}
        onNavigate={setView}
        collapsed={sidebarCollapsed}
      />

      <div className="main">

        <Topbar
          collapsed={sidebarCollapsed}
          onToggleSidebar={() =>
            setSidebarCollapsed(!sidebarCollapsed)
          }
          theme={theme}
          setTheme={setTheme}
        />

        <div className="content">

          <div className="page-head">

              <div className="page-head-icon">
                  <page.icon size={20} strokeWidth={2.1} />
              </div>

              <div className="page-head-content">
                  <h1>{page.title}</h1>
                  <p>{page.subtitle}</p>
              </div>

          </div>

          {view === 'helpdesk' && (

            <FilterCard
              startInput={startInput}
              endInput={endInput}
              setStartInput={setStartInput}
              setEndInput={setEndInput}
              onApply={applyFilter}
              onReset={resetFilter}
            />

          )}

          {loading && !data ? (

            <div className="state">
              Memuat data...
            </div>

          ) : error && !data ? (

            <div className="state error">
              ⚠️ {error}
            </div>

          ) : view === "team-rotation" ? (

              <TeamRotation />

          ) : view !== "helpdesk" && view !== "legacy" ? (

              <SummaryView
                  data={data}
                  team={selectedTeam || "ALL"}
                  page={
                      view.endsWith("trend")
                          ? "trend"
                          : view.endsWith("analytics")
                              ? "analytics"
                              : "overview"
                  }
              />

          ) : (

              <>

              <StatCards
                data={data}
              />

              <StatusTabs
                active={filter}
                onChange={setFilter}
                counts={counts}
              />

              <TicketTable
                tickets={data.tickets}
                statusFilter={filter}
                picList={MASTER_PIC}
                onChanged={refresh}
                onRefresh={refresh}
              />

            </>

          )}

        </div>

      </div>

    </div>

  </ToastProvider>

);

}