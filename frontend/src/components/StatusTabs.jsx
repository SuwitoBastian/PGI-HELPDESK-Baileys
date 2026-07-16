const TABS = [
  { key: 'ALL', label: 'Semua', icon: '📋' },
  { key: 'OPEN', label: 'Open', icon: '⏳' },
  { key: 'PROCESS', label: 'Dalam Proses', icon: '🛠️' },
  { key: 'CLOSED', label: 'Selesai', icon: '✅' },
]

export default function StatusTabs({ active, onChange, counts }) {
  return (
    <div className="tabs">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`tab ${active === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          <span>{t.icon}</span>
          {t.label}
          <span className="count">{counts[t.key] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}
