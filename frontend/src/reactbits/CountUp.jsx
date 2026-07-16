import { useEffect, useRef, useState } from 'react'

// Animasi angka naik (ala React Bits CountUp), tanpa dependency.
// Menganimasikan dari nilai sebelumnya ke nilai baru saat `end` berubah.
export default function CountUp({ end = 0, duration = 1000 }) {
  const target = Number(end) || 0
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = fromRef.current
    const to = target
    if (from === to) return

    let startTs = null
    const step = (ts) => {
      if (startTs === null) startTs = ts
      const p = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(Math.round(from + (to - from) * eased))
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return <span>{value}</span>
}
