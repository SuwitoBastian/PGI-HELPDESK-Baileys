import CountUp from '../reactbits/CountUp'

import {
  CircleAlert,
  LoaderCircle,
  Ticket,
  CircleCheck,
  ChartColumn,
  Bot
} from 'lucide-react'


const CARDS = [
  {
    key: 'open',
    label: 'Terbuka',
    subtitle: 'Menunggu PIC',
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
  },
  {
    key: 'autoResolved',
    label: 'Selesai Otomatis',
    subtitle: 'Diselesaikan oleh sistem',
    icon: <Bot size={20} />,
    cls: 'kpi-auto'
  }
]


export default function StatCards({

  data,

  location = ""

}) {


  const visibleCards =
    CARDS.filter(card => {

      /*
      --------------------------------------------------
      AUTO RESOLVED HANYA UNTUK ALL PERFORMANCE
      --------------------------------------------------
      */

      if (
        card.key === 'autoResolved'
      ) {

        return !location

      }


      return true

    })


  return (

    <section className={`kpis ${!location ? 'kpis-all' : 'kpis-location'}`}>

      {visibleCards.map(c => {


        /*
        --------------------------------------------------
        AMBIL NILAI CARD
        --------------------------------------------------
        */

        const value =
          c.key === 'autoResolved'

            ? data?.analytics?.overview?.autoResolved || 0

            : data?.[c.key] || 0


        return (

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
                end={value}
              />

            </div>

          </div>

        )

      })}

    </section>

  )

}