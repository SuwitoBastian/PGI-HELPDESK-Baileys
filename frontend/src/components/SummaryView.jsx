import { useMemo } from 'react'
import StatCards from './StatCards'

function rank(tickets, key, limit = 10) {
  const map = {}
  for (const t of tickets) {
    const v = t[key]
    if (v == null || String(v).trim() === '') continue
    map[v] = (map[v] || 0) + 1
  }
  return Object.entries(map)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, limit)
}

function RankList({ title, icon, rows, emptyLabel }) {
  const max = rows.reduce((m, r) => Math.max(m, r.total), 0) || 1
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>
          {icon} {title}
        </h2>
      </div>
      {rows.length === 0 ? (
        <div className="state">{emptyLabel}</div>
      ) : (
        <div className="rank-list">
          {rows.map((r, i) => (
            <div className="rank-row" key={r.name}>
              <div className={`rank-medal medal-${i + 1 <= 3 ? i + 1 : 'x'}`}>{i + 1}</div>
              <div className="rank-main">
                <div className="rank-name">
                  <span>{r.name}</span>
                  <span className="rank-count">{r.total}</span>
                </div>
                <div className="rank-bar">
                  <span style={{ width: `${(r.total / max) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SummaryView({ data }) {
  const tickets = data.tickets || []
  const topCabang = useMemo(() => rank(tickets, 'cabang', 10), [tickets])

  const unassigned = tickets.filter((t) => t.status !== 'CLOSED' && !t.pic).length
  const total = data.total || 0
  const dist = [
    { label: 'Open', value: data.open || 0, cls: 'dist-open' },
    { label: 'Dalam Proses', value: data.process || 0, cls: 'dist-process' },
    { label: 'Selesai', value: data.closed || 0, cls: 'dist-closed' },
  ]

  return (
    <>
      <StatCards data={data} />

      <div className="summary-grid">
        <div className="panel">
          <div className="panel-head">
            <h2>📈 Distribusi Status</h2>
            <p>Persentase tiket berdasarkan status saat ini.</p>
          </div>
          <div className="dist">
            {dist.map((d) => {
              const pct = total ? Math.round((d.value / total) * 100) : 0
              return (
                <div className="dist-row" key={d.label}>
                  <div className="dist-top">
                    <span>{d.label}</span>
                    <span className="dist-val">
                      {d.value} <span className="muted">({pct}%)</span>
                    </span>
                  </div>
                  <div className={`dist-bar ${d.cls}`}>
                    <span style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mini-stats">
            <div className="mini">
              <span className="mini-label">Belum di-assign</span>
              <span className="mini-value">{unassigned}</span>
            </div>
            <div className="mini">
              <span className="mini-label">Masuk hari ini</span>
              <span className="mini-value">{data.hariIni || 0}</span>
            </div>
            <div className="mini">
              <span className="mini-label">Total tiket</span>
              <span className="mini-value">{total}</span>
            </div>
          </div>
        </div>

        <RankList
          title="Top Cabang"
          icon="🏢"
          rows={topCabang}
          emptyLabel="Belum ada data cabang."
        />
      </div>
    </>
  )
}
