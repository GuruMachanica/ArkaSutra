import React, { useState } from "react";
import { Bot, Sparkles, Send, X, Play, Activity } from "lucide-react";
import { AGENT_QUICK_GOALS } from "./agentPrompts";

export function AutonomousAgentHUD({ agent, isOpen, onClose }) {
  const [customGoal, setCustomGoal] = useState("");
  if (!isOpen) return null;

  const { isRunning, thoughts, agentStatus, executeGoal } = agent;
  const handleSend = (e) => {
    e.preventDefault();
    if (customGoal.trim() && !isRunning) {
      executeGoal(customGoal.trim());
      setCustomGoal("");
    }
  };

  const statusColors = { IDLE: "#94a3b8", PERCEIVING: "#38bdf8", REASONING: "#a855f7", OPTIMIZING: "#f59e0b", EXECUTING: "#10b981", COMPLETED: "#10b981" };
  const activeColor = statusColors[agentStatus] || "#f59e0b";

  return (
    <div style={{ position: "absolute", top: "86px", right: "370px", zIndex: 40, width: "380px", maxWidth: "calc(100vw - 400px)", background: "rgba(10, 15, 29, 0.95)", backdropFilter: "blur(24px)", border: `1px solid ${activeColor}55`, boxShadow: `0 24px 60px rgba(0,0,0,0.8), 0 0 24px ${activeColor}22`, borderRadius: "22px", padding: "16px", color: "#ffffff", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ background: "rgba(245, 158, 11, 0.15)", padding: "6px", borderRadius: "10px" }}><Bot size={16} color="#f59e0b" /></div>
          <div><h3 style={{ fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>Autonomous Solar AI</h3><span style={{ fontSize: "0.62rem", color: "#94a3b8" }}>Self-Executing Engineering Agent</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: activeColor, padding: "2px 8px", borderRadius: "8px", background: `${activeColor}18`, border: `1px solid ${activeColor}33`, display: "flex", alignItems: "center", gap: "4px" }}><Activity size={10} /> {agentStatus}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={16} /></button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "10px 0", scrollbarWidth: "none" }}>
        {AGENT_QUICK_GOALS.map((q) => (
          <button key={q.id} disabled={isRunning} onClick={() => executeGoal(q.prompt)} style={{ flexShrink: 0, padding: "5px 9px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#cbd5e1", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            <Sparkles size={11} color="#f59e0b" /> {q.badge}
          </button>
        ))}
      </div>

      <div style={{ maxHeight: "200px", overflowY: "auto", background: "rgba(0,0,0,0.35)", borderRadius: "14px", padding: "10px", display: "flex", flexDirection: "column", gap: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
        {thoughts.length === 0 ? (
          <span style={{ fontSize: "0.72rem", color: "#64748b", textAlign: "center", padding: "24px 0" }}>Choose a quick goal or enter an autonomous query below.</span>
        ) : (
          thoughts.map((t, idx) => (
            <div key={idx} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "8px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", textTransform: "uppercase", fontWeight: 700, color: statusColors[t.phase.toUpperCase()] || "#f59e0b" }}><span>{t.phase}</span><span>{t.title}</span></div>
              <div style={{ fontSize: "0.74rem", color: "#e2e8f0", marginTop: "4px", lineHeight: 1.35 }}>{t.detail}</div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
        <input type="text" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} placeholder="e.g. Find roofs with >$20k/yr savings..." disabled={isRunning} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "8px 12px", color: "#ffffff", fontSize: "0.75rem", outline: "none" }} />
        <button type="submit" disabled={isRunning || !customGoal.trim()} style={{ background: isRunning ? "rgba(245,158,11,0.2)" : "#f59e0b", border: "none", borderRadius: "10px", padding: "0 12px", color: "#0f172a", fontWeight: 700, cursor: isRunning ? "not-allowed" : "pointer" }}>{isRunning ? <Play size={12} /> : <Send size={12} />}</button>
      </form>
    </div>
  );
}
