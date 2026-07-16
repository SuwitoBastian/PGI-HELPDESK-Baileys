import { useEffect, useState } from 'react'

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

export default function Topbar() {

  const clock = useClock()

  return (

    <header className="topbar">

      <div className="page">

        <h2>Helpdesk Monitoring</h2>

      </div>

      <div className="topbar-right">

        <span className="bot-status">

          <span className="dot" />

          WhatsApp Bot Online

        </span>

        <span className="topbar-clock">

          🕒 {clock}

        </span>

      </div>

    </header>

  )

}