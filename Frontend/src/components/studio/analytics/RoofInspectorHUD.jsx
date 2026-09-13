import React from "react";
import { X, Sun, Compass, Zap, DollarSign, Leaf } from "lucide-react";

export function RoofInspectorHUD({ roofData, onClose }) {
  if (!roofData) return null;

  return (
    <div className="absolute top-24 left-8 z-30 w-80 rounded-2xl border border-sky-500/40 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Rooftop Inspector</span>
          <h3 className="text-sm font-semibold text-white truncate max-w-[190px]">{roofData.buildingName || roofData.name}</h3>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
          <div className="text-slate-400 flex items-center gap-1"><Sun className="h-3 w-3 text-amber-400" /> Area</div>
          <div className="text-sm font-semibold text-white mt-1">{roofData.area_m2 || 0} m²</div>
          <div className="text-[10px] text-slate-400">{roofData.usable_area_m2 || 0} m² usable</div>
        </div>

        <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
          <div className="text-slate-400 flex items-center gap-1"><Compass className="h-3 w-3 text-sky-400" /> Tilt / Az</div>
          <div className="text-sm font-semibold text-white mt-1">{roofData.tilt_deg || 0}° / {roofData.azimuth_deg || 0}°</div>
          <div className="text-[10px] text-slate-400">{roofData.pv_capacity_kwp || 0} kWp PV</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-sky-950/40 border border-sky-500/20 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-400" /> Annual Output</span>
          <span className="font-bold text-sky-300">{(roofData.annual_generation_kwh || 0).toLocaleString()} kWh</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-slate-300 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Value (est.)</span>
          <span className="font-bold text-emerald-400">${(roofData.annual_savings_usd || 0).toLocaleString()} / yr</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-slate-300 flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-emerald-500" /> CO₂ Offset</span>
          <span className="font-bold text-slate-200">{roofData.co2_offset_tons || 0} tons/yr</span>
        </div>
      </div>
    </div>
  );
}
