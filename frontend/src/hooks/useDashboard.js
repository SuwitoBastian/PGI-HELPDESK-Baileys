import { useCallback, useEffect, useRef, useState } from 'react'
import { getDashboard } from '../api'

// Ambil data dashboard + polling tiap 30 detik (menggantikan location.reload()).
export function useDashboard(
    start = "",
    end = "",
    intervalMs = 30000
) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const timer = useRef(null)

const refresh = useCallback(async () => {

    try {

        const d =
            await getDashboard(
                start,
                end
            );

        setData(d);

        setError(null);

    } catch (e) {

        setError(e.message);

    } finally {

        setLoading(false);

    }

}, [start, end]);

  useEffect(() => {
    refresh();
    timer.current = 
    setInterval(
      refresh,
      intervalMs
    );
    return () =>
      clearInterval(timer.current);

  }, [
      refresh,
      intervalMs
  ]);

  return { data, error, loading, refresh }
}
