import CountUp from '../reactbits/CountUp'

import {
  CircleAlert,
  LoaderCircle,
  Ticket,
  CircleCheck,
  ChartColumn
} from 'lucide-react'

const CARDS = [
  {
    key: 'open',
    label: 'Open',
    subtitle: 'Menunggu assignment',
    icon: <CircleAlert size={20} />,
    cls: 'kpi-open'
  },
  {
    key: 'process',
    label: 'Dalam Proses',
    subtitle: 'Sedang ditangani PIC',
    icon: <LoaderCircle size={20} />,
    cls: 'kpi-process'
  },
  {
    key: 'hariIni',
    label: 'Masuk Hari Ini',
    subtitle: 'Tiket baru hari ini',
    icon: <Ticket size={20} />,
    cls: 'kpi-today'
  },
  {
    key: 'closed',
    label: 'Selesai',
    subtitle: 'Tiket telah diselesaikan',
    icon: <CircleCheck size={20} />,
    cls: 'kpi-closed'
  },
  {
    key: 'total',
    label: 'Total Tiket',
    subtitle: 'Seluruh tiket tercatat',
    icon: <ChartColumn size={20} />,
    cls: 'kpi-total'
  }
]

export default function StatCards({ data }) {

  return (

    <section className="kpis">

      {CARDS.map((c) => (

        <div
          key={c.key}
          className={`kpi ${c.cls}`}
        >

          <div className="kpi-top">

            <div className="kpi-heading">

              <span className="kpi-label">
                {c.label}
              </span>

              <span className="kpi-subtitle">
                {c.subtitle}
              </span>

            </div>

            <span className="kpi-icon">
              {c.icon}
            </span>

          </div>

          <div className="kpi-value">

            <CountUp
              end={data[c.key] || 0}
            />

          </div>

        </div>

      ))}

    </section>

  )

}