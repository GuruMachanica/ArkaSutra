import { useState, useCallback } from "react";

export function useAutonomousAgent({ buildings = [], latitude = 35.68, season = "summer", setPanelTilt, setShadingMode, onSelectRoof }) {
  const [isRunning, setIsRunning] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [agentStatus, setAgentStatus] = useState("IDLE");

  const executeGoal = useCallback(async (goalPrompt) => {
    if (!goalPrompt || isRunning) return;
    setIsRunning(true);
    setAgentStatus("PERCEIVING");
    setThoughts([{ phase: "perception", title: "Goal Received", detail: goalPrompt }]);

    try {
      const res = await fetch("/api/agent/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalPrompt, latitude, season, buildings: buildings || [] })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Progressively reveal thoughts with micro-delays for agentic stream
      if (data.thoughts && data.thoughts.length > 0) {
        for (let i = 0; i < data.thoughts.length; i++) {
          const t = data.thoughts[i];
          setAgentStatus(t.phase.toUpperCase());
          setThoughts((prev) => [...prev, t]);
          await new Promise((r) => setTimeout(r, 450));
        }
      }

      // Execute autonomous scene actions
      setAgentStatus("EXECUTING");
      (data.actions || []).forEach((act) => {
        if (act.type === "set_tilt" && setPanelTilt) setPanelTilt(act.value);
        if (act.type === "set_shader" && setShadingMode) setShadingMode(act.value);
        if (act.type === "select_roof" && onSelectRoof) onSelectRoof(act.value);
      });

      await new Promise((r) => setTimeout(r, 300));
      setAgentStatus("COMPLETED");
    } catch (err) {
      console.warn("Agent execution notice:", err);
      setAgentStatus("READY");
    } finally {
      setIsRunning(false);
    }
  }, [buildings, latitude, season, isRunning, setPanelTilt, setShadingMode, onSelectRoof]);

  return { isRunning, thoughts, agentStatus, executeGoal, clearThoughts: () => setThoughts([]) };
}
