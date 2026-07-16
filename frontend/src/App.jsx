import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from './hooks/useDashboard'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import StatCards from './components/StatCards'
import StatusTabs from './components/StatusTabs'
import TicketTable from './components/TicketTable'
import SummaryView from './components/SummaryView'
import FilterCard from './components/FilterCard'

const PAGES = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Ringkasan lengkap seluruh aktivitas helpdesk.',
  },

  helpdesk: {
    title: 'Helpdesk',
    subtitle:
      'Kelola tiket, filter status, dan proses penyelesaian dalam satu halaman.',
  },
}

export default function App() {

  // =====================================================
  // PAGE
  // =====================================================

 const [view, setView] = useState(() => {

  return localStorage.getItem('helpdesk-page') || 'dashboard'

})
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
  // =====================================================
// SAVE LAST PAGE
// =====================================================

useEffect(() => {

  localStorage.setItem(
    'helpdesk-page',
    view
  )

}, [view])

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
    endFilter
  )

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

    <div className="layout">

      <Sidebar
        view={view}
        onNavigate={setView}
      />

      <div className="main">

        <Topbar />

        <div className="content">

        <div className="page-head">

  <h1>{page.title}</h1>

  <p>{page.subtitle}</p>

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

          ) : view === 'dashboard' ? (

            <SummaryView
              data={data}
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

                picList={data.picList || []}

                onChanged={refresh}

                onRefresh={refresh}

              />

            </>

          )}

        </div>

      </div>

    </div>

  )

}