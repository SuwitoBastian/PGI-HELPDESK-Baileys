import CountUp from '../reactbits/CountUp'

const CARDS = [
  { key: 'open', label: 'Open', icon: '🌱', cls: 'kpi-open' },
  { key: 'process', label: 'Dalam Proses', icon: '🔧✨', cls: 'kpi-process' },
  { key: 'hariIni', label: 'Masuk Hari Ini', icon: '💌', cls: 'kpi-today' },
  { key: 'closed', label: 'Selesai', icon: '🎉', cls: 'kpi-closed' },
  { key: 'total', label: 'Total Tiket', icon: '🧾', cls: 'kpi-total' },
]

export default function StatCards({ data }) {
  return (
    <section className="kpis">
      {CARDS.map((c) => (
        <div key={c.key} className={`kpi ${c.cls}`}>
          <div className="kpi-top">
            <span className="kpi-label">{c.label}</span>
            <span className="kpi-icon">{c.icon}</span>
          </div>
          <div className="kpi-value">
            <CountUp end={data[c.key] || 0} />
          </div>
        </div>
      ))}
    </section>
  )
}
