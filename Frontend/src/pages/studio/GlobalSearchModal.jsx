import React, { useState } from "react";
import { X, Radio, Loader2 } from "lucide-react";
import { QUICK_CITIES } from "./studioConstants";
import { searchGlobalLocations } from "../../services/satelliteApi";

export default function GlobalSearchModal({ isOpen, onClose, onSelectCity }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    const res = await searchGlobalLocations(query);
    setResults(res);
    setIsSearching(false);
  };

  return (
    <div style={{ position: "absolute", top: "70px", right: "16px", zIndex: 40, width: "360px", background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(24px)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "20px", padding: "16px", fontFamily: "monospace", color: "#ffffff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700 }}><Radio size={14} className="animate-pulse" /><span>GLOBAL SATELLITE SEARCH</span></div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter city (e.g. Paris, Cairo)..." style={{ flex: 1, background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "10px", padding: "8px 12px", color: "#ffffff", fontSize: "0.78rem", outline: "none" }} />
        <button type="submit" disabled={isSearching} style={{ background: "#38bdf8", border: "none", borderRadius: "10px", padding: "8px 14px", color: "#0f172a", fontWeight: 800, cursor: "pointer" }}>
          {isSearching ? <Loader2 size={13} className="animate-spin" /> : "SEARCH"}
        </button>
      </form>

      <div style={{ marginBottom: "10px" }}>
        <span style={{ fontSize: "0.68rem", color: "#64748b", display: "block", marginBottom: "6px" }}>QUICK PRESETS:</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {QUICK_CITIES.map((c) => (
            <button key={c.name} onClick={() => onSelectCity({ latitude: c.lat, longitude: c.lon, name: c.name, country: c.country })} style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "4px 8px", color: "#94a3b8", fontSize: "0.7rem", cursor: "pointer" }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {results.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "8px", maxHeight: "150px", overflowY: "auto" }}>
          {results.map((r) => (
            <div key={`${r.name}-${r.latitude}-${r.longitude}`} onClick={() => onSelectCity(r)} style={{ padding: "6px 8px", borderRadius: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.02)", marginBottom: "4px" }}>
              <strong style={{ color: "#ffffff", fontSize: "0.78rem" }}>{r.name}, {r.country}</strong>
              <span style={{ color: "#38bdf8", fontSize: "0.68rem" }}>{r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
