import { useEffect, useState } from 'react'
import { PanelLeftClose, PanelLeftOpen, Clock3, Sun, Moon } from 'lucide-react'

function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const tanggal = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const jam = now.toLocaleTimeString('id-ID')

  return `${tanggal} • ${jam} WIB`
}

export default function Topbar({
  collapsed,
  onToggleSidebar,
  theme,
  setTheme
}) {

  const clock = useClock()

  return (

    <header className="topbar">

      <div className="page">

        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
        >
          {collapsed
            ? <PanelLeftOpen size={20} />
            : <PanelLeftClose size={20} />
          }
        </button>

        <div>

          <h2>Helpdesk Monitoring</h2>

          <small>
            Ringkasan aktivitas Helpdesk
          </small>

        </div>

      </div>

      <div className="topbar-right">
          <button
            className="theme-toggle"
            onClick={() =>
                setTheme(
                    theme === "light"
                        ? "dark"
                        : "light"
                )
            }
        >
            {
                theme === "light"
                    ? <Moon size={18}/>
                    : <Sun size={18}/>
            }
        </button>

        <span className="bot-status">

          <span className="dot" />

          WhatsApp Bot Online

        </span>

        <span className="topbar-clock">

          <Clock3 size={15} />

          {clock}

        </span>

      </div>

    </header>

  )

}