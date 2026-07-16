const NAV = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'helpdesk', icon: '🎫', label: 'Helpdesk' },
]

export default function Sidebar({ view, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">🏢</div>
        <div className="brand-text">
          <small>PGI IT Support</small>
          <strong>HELPDESK</strong>
        </div>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Utama</div>
        {NAV.map((n) => (
          <button
            key={n.key}
            className={`nav-item ${view === n.key ? 'active' : ''}`}
            onClick={() => onNavigate(n.key)}
          >
            <span className="ico">{n.icon}</span> {n.label}
          </button>
        ))}
        <a className="nav-item" href="/legacy" title="Dashboard versi lama (EJS)">
          <span className="ico">🗂️</span> Dashboard Lama
        </a>
      </nav>

      <div className="sidebar-foot">WhatsApp Helpdesk Monitoring</div>
    </aside>
  )
}
