import { useState, useEffect } from "react";

export function useCityMapLoader(activeCoords) {
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeCoords || !activeCoords.lat || !activeCoords.lon) return;
    let isCancelled = false;
    setLoading(true);

    const fetchCity = async () => {
      try {
        const url = `/api/city/buildings?latitude=${activeCoords.lat}&longitude=${activeCoords.lon}&radius=200`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!isCancelled) {
          setCityData(json);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("City building stream notice:", err.message);
          setError(err.message);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchCity();
    return () => { isCancelled = true; };
  }, [activeCoords?.lat, activeCoords?.lon]);

  return { cityData, loading, error };
}
