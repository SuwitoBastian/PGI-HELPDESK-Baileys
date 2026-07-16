// Relatif '/api' -> di dev diproxy Vite ke :3000, di produksi same-origin.
const BASE = '/api'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let msg = `Gagal (${res.status})`
    try {
      const j = await res.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }
  return res.json()
}

export async function getDashboard(start = "", end = "") {

  let url = `${BASE}/dashboard`;

  if (start && end) {

    const params = new URLSearchParams({
      start,
      end
    });

    url += `?${params.toString()}`;

  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Gagal memuat data (${res.status})`);
  }

  return res.json();

}

export const closeTicket = (id) => post(`/tickets/${encodeURIComponent(id)}/close`)
export const openTicket = (id) => post(`/tickets/${encodeURIComponent(id)}/open`)
export const assignPIC = (id, pic) =>
  post(`/tickets/${encodeURIComponent(id)}/assign`, { pic })
export const changeStatus = (id, status) =>
  post(`/tickets/${encodeURIComponent(id)}/status`, { status })
