import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Headset } from "lucide-react";

import { useDashboard } from "./hooks/useDashboard";
import { MASTER_PIC } from "./constants/picList";
import { ToastProvider } from "./context/ToastContext";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCards from "./components/StatCards";
import StatusTabs from "./components/StatusTabs";
import TicketTable from "./components/TicketTable";
import SummaryView from "./components/SummaryView";
import FilterCard from "./components/FilterCard";
import TeamRotation from "./components/settings/TeamRotation";


// =====================================================
// PAGE CONFIGURATION
// =====================================================

const PAGES = {

  // =====================================================
  // ALL PERFORMANCE
  // =====================================================

  "dashboard-overview": {
    title: "Seluruh Performa",
    subtitle: "Ringkasan performa seluruh Helpdesk.",
    icon: LayoutDashboard,
  },

  "dashboard-analytics": {
    title: "Seluruh Performa",
    subtitle: "Analisis performa seluruh Helpdesk.",
    icon: LayoutDashboard,
  },

  "dashboard-trend": {
    title: "Seluruh Performa",
    subtitle: "Trend performa seluruh Helpdesk.",
    icon: LayoutDashboard,
  },


  // =====================================================
  // HO - AKR TOWER
  // =====================================================

  "akr-overview": {
    title: "HO - AKR Tower",
    subtitle: "Ringkasan performa HO - AKR Tower.",
    icon: LayoutDashboard,
  },

  "akr-analytics": {
    title: "HO - AKR Tower",
    subtitle: "Analisis performa HO - AKR Tower.",
    icon: LayoutDashboard,
  },

  "akr-trend": {
    title: "HO - AKR Tower",
    subtitle: "Trend performa HO - AKR Tower.",
    icon: LayoutDashboard,
  },


  // =====================================================
  // HEAD OFFICE
  // =====================================================

  "ho-overview": {
    title: "Head Office",
    subtitle: "Ringkasan performa Head Office.",
    icon: LayoutDashboard,
  },

  "ho-analytics": {
    title: "Head Office",
    subtitle: "Analisis performa Head Office.",
    icon: LayoutDashboard,
  },

  "ho-trend": {
    title: "Head Office",
    subtitle: "Trend performa Head Office.",
    icon: LayoutDashboard,
  },


  // =====================================================
  // HELPDESK
  // =====================================================

  helpdesk: {
    title: "Helpdesk",
    subtitle: "Kelola tiket Helpdesk.",
    icon: Headset,
  },


  // =====================================================
  // TEAM ROTATION
  // =====================================================

  "team-rotation": {
    title: "Pengaturan Operasional",
    subtitle: "Konfigurasi Team Rotation.",
    icon: LayoutDashboard,
  },


  // =====================================================
  // LEGACY
  // =====================================================

  legacy: {
    title: "Dashboard Lama",
    subtitle: "Dashboard versi sebelumnya.",
    icon: LayoutDashboard,
  },

};


// =====================================================
// APP
// =====================================================

export default function App() {


  // =====================================================
  // PAGE
  // =====================================================

  const [view, setView] = useState(() => {

    const stored =
      localStorage.getItem("helpdesk-page");


    /*
    =====================================================
    LEGACY VIEW MIGRATION
    =====================================================

    Browser lama mungkin masih menyimpan:

        team-a-overview
        team-a-analytics
        team-a-trend

        team-b-overview
        team-b-analytics
        team-b-trend

    Migrasikan otomatis ke identifier baru.
    =====================================================
    */

    const legacyMap = {

      "team-a-overview":
        "akr-overview",

      "team-a-analytics":
        "akr-analytics",

      "team-a-trend":
        "akr-trend",

      "team-b-overview":
        "ho-overview",

      "team-b-analytics":
        "ho-analytics",

      "team-b-trend":
        "ho-trend",

    };


    return (

      legacyMap[stored] ||
      stored ||
      "dashboard-overview"

    );

  });


  // =====================================================
  // SIDEBAR
  // =====================================================

  const [
    sidebarCollapsed,
    setSidebarCollapsed
  ] = useState(() => {

    return (
      localStorage.getItem(
        "helpdesk-sidebar"
      ) === "true"
    );

  });


  // =====================================================
  // THEME
  // =====================================================

  const [
    theme,
    setTheme
  ] = useState(() => {

    return (
      localStorage.getItem(
        "helpdesk-theme"
      ) ||
      "light"
    );

  });


  // =====================================================
  // STATUS FILTER
  // =====================================================

  const [
    filter,
    setFilter
  ] = useState("ALL");


  // =====================================================
  // DATE FILTER FORM
  // =====================================================

  const [
    startInput,
    setStartInput
  ] = useState("");

  const [
    endInput,
    setEndInput
  ] = useState("");


  // =====================================================
  // ACTIVE DATE FILTER
  // =====================================================

  const [
    startFilter,
    setStartFilter
  ] = useState("");

  const [
    endFilter,
    setEndFilter
  ] = useState("");


  // =====================================================
  // SELECTED LOCATION
  // =====================================================
  //
  // Location sekarang menjadi sumber
  // filter utama dashboard.
  //
  // akr-* -> AKR
  // ho-*  -> HO
  //
  // All Performance -> ""
  //
  // Tidak lagi menggunakan:
  //
  // TEAM_A
  // TEAM_B
  //
  // sebagai filter frontend.
  // =====================================================

  const selectedLocation =
    useMemo(() => {

      if (
        view.startsWith("akr-")
      ) {

        return "AKR";

      }


      if (
        view.startsWith("ho-")
      ) {

        return "HO";

      }


      return "";

    }, [view]);

    // =====================================================
    // AUTO DATE FILTER - BULAN BERJALAN
    // =====================================================

    useEffect(() => {

      // ALL PERFORMANCE
      // Tidak menggunakan filter tanggal
      if (!selectedLocation) {

        setStartInput("");
        setEndInput("");

        setStartFilter("");
        setEndFilter("");

        return;

      }


      // LOCATION PERFORMANCE
      // Otomatis dari tanggal 1 sampai hari ini

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


      setStartInput(startDate);
      setEndInput(endDate);

      setStartFilter(startDate);
      setEndFilter(endDate);

    }, [
      selectedLocation
    ]);

    console.log(
    "PAGE DEBUG:",
    {
        view,
        selectedLocation
    }
);


  // =====================================================
  // SAVE LAST PAGE
  // =====================================================

  useEffect(() => {

    localStorage.setItem(
      "helpdesk-page",
      view
    );

  }, [view]);


  // =====================================================
  // SAVE SIDEBAR
  // =====================================================

  useEffect(() => {

    localStorage.setItem(
      "helpdesk-sidebar",
      sidebarCollapsed
    );

  }, [sidebarCollapsed]);


  // =====================================================
  // THEME
  // =====================================================

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
  // DASHBOARD DATA
  // =====================================================

  const {
    data,
    error,
    loading,
    refresh
  } = useDashboard(
    startFilter,
    endFilter,
    selectedLocation
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

      };

    }


    return {

      ALL:
        data.total || 0,

      OPEN:
        data.open || 0,

      PROCESS:
        data.process || 0,

      CLOSED:
        data.closed || 0,

    };

  }, [data]);


  // =====================================================
  // PAGE INFO
  // =====================================================

  const page =
    PAGES[view];


  const locationPage =
    useMemo(() => {


      // =================================================
      // AKR
      // =================================================

      if (
        selectedLocation === "AKR"
      ) {

        if (
          view.endsWith("analytics")
        ) {

          return {

            title:
              "HO - AKR Tower",

            subtitle:
              "Analisis performa HO - AKR Tower."

          };

        }


        if (
          view.endsWith("trend")
        ) {

          return {

            title:
              "HO - AKR Tower",

            subtitle:
              "Trend performa HO - AKR Tower."

          };

        }


        return {

          title:
            "HO - AKR Tower",

          subtitle:
            "Ringkasan performa HO - AKR Tower."

        };

      }


      // =================================================
      // HEAD OFFICE
      // =================================================

      if (
        selectedLocation === "HO"
      ) {

        if (
          view.endsWith("analytics")
        ) {

          return {

            title:
              "Head Office",

            subtitle:
              "Analisis performa Head Office."

          };

        }


        if (
          view.endsWith("trend")
        ) {

          return {

            title:
              "Head Office",

            subtitle:
              "Trend performa Head Office."

          };

        }


        return {

          title:
            "Head Office",

          subtitle:
            "Ringkasan performa Head Office."

        };

      }


      // =================================================
      // ALL PERFORMANCE / OTHER
      // =================================================

      return {

        title:
          page?.title ||
          "All Performance",

        subtitle:
          page?.subtitle ||
          "Ringkasan performa seluruh Helpdesk."

      };

    }, [
      selectedLocation,
      view,
      page
    ]);


  // =====================================================
  // FILTER
  // =====================================================

  function applyFilter() {

    if (
      startInput &&
      endInput &&
      startInput > endInput
    ) {

      alert(
        "Tanggal mulai tidak boleh lebih besar dari tanggal selesai."
      );

      return;

    }


    setStartFilter(
      startInput
    );

    setEndFilter(
      endInput
    );

  }


  // =====================================================
  // RESET FILTER
  // =====================================================

  function resetFilter() {

    // ALL PERFORMANCE
    if (!selectedLocation) {

      setStartInput("");
      setEndInput("");

      setStartFilter("");
      setEndFilter("");

      return;

    }


    // LOCATION PERFORMANCE
    // Kembali ke bulan berjalan

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


    setStartInput(startDate);
    setEndInput(endDate);

    setStartFilter(startDate);
    setEndFilter(endDate);

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <ToastProvider>


      <div
        className={`layout ${
          sidebarCollapsed
            ? "sidebar-collapsed"
            : ""
        }`}
      >


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar
          view={view}
          onNavigate={setView}
          collapsed={
            sidebarCollapsed
          }
        />


        {/* =================================================
            MAIN
        ================================================= */}

        <div className="main">


          {/* =================================================
              TOPBAR
          ================================================= */}

          <Topbar

            collapsed={
              sidebarCollapsed
            }

            onToggleSidebar={() =>
              setSidebarCollapsed(
                !sidebarCollapsed
              )
            }

            theme={theme}

            setTheme={setTheme}

          />


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="content">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-head">


              <div className="page-head-icon">

                {page?.icon && (

                  <page.icon
                    size={20}
                    strokeWidth={2.1}
                  />

                )}

              </div>


              <div className="page-head-content">

                <h1>
                  {locationPage.title}
                </h1>

                <p>
                  {locationPage.subtitle}
                </p>

              </div>

            </div>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            {view === "helpdesk" && (

              <FilterCard

                startInput={
                  startInput
                }

                endInput={
                  endInput
                }

                setStartInput={
                  setStartInput
                }

                setEndInput={
                  setEndInput
                }

                onApply={
                  applyFilter
                }

                onReset={
                  resetFilter
                }

              />

            )}


            {/* =================================================
                LOADING
            ================================================= */}

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


            ) : (
              view !== "helpdesk" &&
              view !== "legacy"
            ) ? (

              // =================================================
              // PERFORMANCE PAGES
              // =================================================

              <SummaryView

                data={data}

                /*
                -------------------------------------------------
                Compatibility prop.
                Filtering sekarang menggunakan location.
                -------------------------------------------------
                */

                team="ALL"

                location={
                  selectedLocation
                }

                page={

                  view.endsWith(
                    "trend"
                  )

                    ? "trend"

                    : view.endsWith(
                        "analytics"
                      )

                      ? "analytics"

                      : "overview"

                }

              />


            ) : (

              // =================================================
              // HELPDESK PAGE
              // =================================================

              <>

                <StatCards
                  data={data}
                  location="HELPDESK"
                />


                <StatusTabs
                  active={filter}
                  onChange={setFilter}
                  counts={counts}
                />


                <TicketTable
                  tickets={
                    data?.tickets || []
                  }
                  statusFilter={
                    filter
                  }
                  picList={
                    MASTER_PIC
                  }
                  onChanged={
                    refresh
                  }
                  onRefresh={
                    refresh
                  }
                />

              </>

            )}

          </div>

        </div>

      </div>

    </ToastProvider>

  );

}