import { useEffect, useMemo, useState } from 'react'
import { assignPIC, closeTicket, openTicket } from '../api'

const PAGE_SIZES = [10, 25, 50, 100]

function fmt(dt) {
  return dt ? new Date(dt).toLocaleString('id-ID') : '-'
}

function slaClass(durasi) {
  if (!durasi) return ''
  const n = parseInt(durasi, 10)
  if (n >= 2) return 'sla-danger'
  if (n >= 1) return 'sla-warning'
  return 'sla-good'
}

function statusBadge(status) {
  if (status === 'OPEN') return { cls: 'badge-open', label: 'Open' }
  if (status === 'PROCESS') return { cls: 'badge-process', label: 'Dalam Proses' }
  return { cls: 'badge-closed', label: 'Selesai' }
}

export default function TicketTable({ tickets = [], statusFilter = 'ALL', picList = [], onChanged, onRefresh }) {
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(() => Number(localStorage.getItem('page')) || 0)
  const [busyId, setBusyId] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tickets.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false
      if (!q) return true
      return [t.id, t.cabang, t.nama, t.nomor, t.kendala, t.pic, t.status]
        .map((v) => (v == null ? '' : String(v)).toLowerCase())
        .some((v) => v.includes(q))
    })
  }, [tickets, search, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pageCount - 1)

  useEffect(() => {
    localStorage.setItem('page', String(current))
  }, [current])

  // Reset ke halaman awal saat filter/tab/search berubah
  useEffect(() => {
    setPage(0)
  }, [statusFilter])

  const rows = filtered.slice(current * pageSize, current * pageSize + pageSize)

  async function run(id, fn) {
    try {
      setBusyId(id)
      await fn()
      await onChanged?.()
    } catch (e) {
      window.alert(e.message)
    } finally {
      setBusyId(null)
    }
  }

  function handleAssign(ticket, pic) {
    if (!pic) return
    run(ticket.id, () => assignPIC(ticket.id, pic))
  }

  function handleClose(ticket) {
    if (!window.confirm('Tandai tiket ini SELESAI?')) return
    run(ticket.id, () => closeTicket(ticket.id))
  }

  function handleReopen(ticket) {
    if (!window.confirm('Buka kembali tiket ini?')) return
    run(ticket.id, () => openTicket(ticket.id))
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>🎫 Daftar Tiket</h2>
        <p>Kelola tiket, assign PIC, dan ubah status penyelesaian.</p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="🔍 Cari cabang, pelapor, kendala, PIC…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
        />
        <button className="btn-refresh" title="Muat ulang" onClick={() => onRefresh?.()}>
          ⟳
        </button>
      </div>

      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>No</th>
              <th>Ticket</th>
              <th>Cabang</th>
              <th>Pelapor</th>
              <th>Kendala</th>
              <th>Masuk</th>
              <th>Durasi</th>
              <th>Status</th>
              <th>PIC</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty">
                  Tidak ada tiket.
                </td>
              </tr>
            ) : (
              rows.map((t, i) => {
                const s = statusBadge(t.status)
                const busy = busyId === t.id
                return (
                  <tr key={t.id}>
                    <td>{current * pageSize + i + 1}</td>
                    <td>
                      <span className="ticket-id">{t.id}</span>
                    </td>
                    <td>
                      <div className="cell-strong">{t.cabang}</div>
                      <div className="muted">{t.nomor || '-'}</div>
                    </td>
                    <td>{t.nama || '-'}</td>
                    <td>{t.kendala}</td>
                    <td className="muted">{fmt(t.waktu)}</td>
                    <td>
                      <span className={slaClass(t.durasi)}>{t.durasi || '-'}</span>
                    </td>
                    <td>
                      <span className={`badge ${s.cls}`}>{s.label}</span>
                    </td>
                    <td>
                      {t.pic ? (
                        <span className="pic-tag">{t.pic}</span>
                      ) : (
                        <span className="pic-empty">Belum di-assign</span>
                      )}
                    </td>
                    <td>
                      <div className="action-cell">
                        {t.status !== 'CLOSED' && (
                          <select
                            className="assign-select"
                            value=""
                            disabled={busy || picList.length === 0}
                            onChange={(e) => handleAssign(t, e.target.value)}
                          >
                            <option value="">
                              {t.pic ? 'Ganti PIC…' : 'Assign PIC…'}
                            </option>
                            {picList.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        )}

                        {t.status !== 'CLOSED' ? (
                          <button
                            className="btn btn-green"
                            disabled={busy}
                            onClick={() => handleClose(t)}
                          >
                            {busy ? '…' : 'Selesai'}
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline"
                            disabled={busy}
                            onClick={() => handleReopen(t)}
                          >
                            {busy ? '…' : 'Buka Lagi'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="page-info">
          Menampilkan {filtered.length === 0 ? 0 : current * pageSize + 1}–
          {Math.min((current + 1) * pageSize, filtered.length)} dari {filtered.length} tiket
        </span>
        <div className="page-buttons">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(0)
            }}
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} / halaman
              </option>
            ))}
          </select>
          <button disabled={current === 0} onClick={() => setPage(current - 1)}>
            ←
          </button>
          <span className="page-num">
            {current + 1} / {pageCount}
          </span>
          <button disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
            →
          </button>
        </div>
      </div>
    </section>
  )
}
