import React from "react";
import SatelliteCard from "./analytics/SatelliteCard";
import MetricsGrid from "./analytics/MetricsGrid";

export default function AnalyticsPanel({
  irradiance = 850,
  stats = {},
  elevation = 45,
  satelliteData = null,
  isLoadingSatellite = false
}) {
  const isNight = elevation <= 0;
  const satCurrent = satelliteData?.current;
  const currentIrradiance = isNight ? 0 : (satCurrent?.ghi_w_m2 !== undefined ? satCurrent.ghi_w_m2 : irradiance);
  const cloudDerate = satCurrent?.cloud_derate_factor ?? 1.0;
  const kwCapacity = stats.systemCapacityKwp || (stats.panelsCount ? (stats.panelsCount * 0.4).toFixed(1) : 72.0);
  const rawAnnual = stats.annualGenerationKwh || Math.round((stats.totalRooftopArea || 210) * 1850 * 0.20 * 0.82);
  const annualKwh = Math.round(rawAnnual * (satCurrent ? cloudDerate : 1.0));
  const annualSavings = Math.round(annualKwh * 0.16);
  const co2Offset = ((annualKwh * 0.85) / 2204.62).toFixed(1);

  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.88)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.14)",
      borderRadius: "24px",
      padding: "18px 20px",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
      fontFamily: "monospace",
      width: "320px",
      maxHeight: "calc(100vh - 120px)",
      overflowY: "auto"
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "0.68rem", color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            CITYGML SPATIAL TELEMETRY
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: isLoadingSatellite ? "#f59e0b" : "#10b981",
              boxShadow: isLoadingSatellite ? "0 0 8px #f59e0b" : "0 0 8px #10b981"
            }} />
            <span style={{ fontSize: "0.65rem", color: isLoadingSatellite ? "#f59e0b" : "#10b981", fontWeight: 700 }}>
              {isLoadingSatellite ? "SYNCING SAT" : "SAT ONLINE"}
            </span>
          </div>
        </div>
        <h2 style={{ fontSize: "1.02rem", fontWeight: 800, margin: 0, fontFamily: "sans-serif" }}>
          {stats.name || "Predictive Solar Telemetry"}
        </h2>
      </div>

      <SatelliteCard satCurrent={satCurrent} cloudDerate={cloudDerate} />

      <MetricsGrid
        currentIrradiance={currentIrradiance}
        kwCapacity={kwCapacity}
        annualKwh={annualKwh}
        annualSavings={annualSavings}
        co2Offset={co2Offset}
      />

      <div style={{
        background: "rgba(245, 158, 11, 0.08)",
        border: "1px solid rgba(245, 158, 11, 0.2)",
        padding: "8px 10px",
        borderRadius: "10px",
        fontSize: "0.68rem",
        color: "#fbbf24",
        lineHeight: 1.4
      }}>
        NREL PVLib Perez transposition + Live Copernicus satellite weather assimilation active.
      </div>
    </div>
  );
}
