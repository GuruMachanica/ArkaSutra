from typing import Dict, Any, List
from .agent_tools import scan_and_rank_district, optimize_solar_tilt, shade_audit_analysis

def process_agent_goal(goal: str, buildings: List[Dict[str, Any]], latitude: float = 35.68, season: str = "summer") -> Dict[str, Any]:
    g = (goal or "").lower()
    thoughts = []
    actions = []
    
    # Step 1: Perception
    thoughts.append({
        "phase": "perception",
        "title": "Ingesting Spatial District",
        "detail": f"Loaded {len(buildings)} structures for {latitude:.2f}° latitude under {season.upper()} sky conditions."
    })
    
    # Step 2: Reasoning & Tool Dispatch
    if "shade" in g or "occlusion" in g or "winter" in g:
        shade_res = shade_audit_analysis(buildings)
        tilt_res = optimize_solar_tilt(latitude, "winter" if "winter" in g else season)
        scan_res = scan_and_rank_district(buildings, min_area=80.0)
        
        thoughts.append({
            "phase": "reasoning",
            "title": "Obstacle Shadow Evaluation",
            "detail": f"Identified {shade_res['unshaded_count']} unshaded vs {shade_res['partially_shaded_count']} shaded roofs."
        })
        thoughts.append({
            "phase": "optimization",
            "title": "Steepening Seasonal Tilt",
            "detail": f"Elevating module pitch to {tilt_res['optimal_tilt_deg']}° to maximize low-angle winter sunlight."
        })
        actions.append({"type": "set_tilt", "value": tilt_res["optimal_tilt_deg"]})
        actions.append({"type": "set_shader", "value": "heatmap"})
        if scan_res["top_asset"]:
            actions.append({"type": "select_roof", "value": scan_res["top_asset"]})
            
    elif "roi" in g or "npv" in g or "financial" in g or "savings" in g:
        scan_res = scan_and_rank_district(buildings, min_area=120.0)
        top = scan_res["top_asset"]
        thoughts.append({
            "phase": "reasoning",
            "title": "Economic Portfolio Ranking",
            "detail": f"Screened {scan_res['viable_count']} high-volume assets generating ${scan_res['total_annual_savings_usd']:,}/yr total."
        })
        thoughts.append({
            "phase": "optimization",
            "title": "Targeting Flagship Asset",
            "detail": f"Selected '{top.get('name')}' with ${top.get('solar', {}).get('annual_savings_usd', 0):,}/yr yield." if top else "Optimizing."
        })
        actions.append({"type": "set_tilt", "value": 25.0})
        actions.append({"type": "set_shader", "value": "realistic"})
        if top:
            actions.append({"type": "select_roof", "value": top})
            
    else: # Default: Autonomous District Audit
        scan_res = scan_and_rank_district(buildings)
        tilt_res = optimize_solar_tilt(latitude, season)
        top = scan_res["top_asset"]
        
        thoughts.append({
            "phase": "reasoning",
            "title": "Transposition Irradiance Optimization",
            "detail": f"Computed optimal solar tilt of {tilt_res['optimal_tilt_deg']}° (giving +{tilt_res['transposition_gain_pct']}% transposition gain)."
        })
        thoughts.append({
            "phase": "optimization",
            "title": "Full District Audit Complete",
            "detail": f"Portfolio Potential: {scan_res['total_annual_kwh']:,} kWh/yr across {scan_res['total_area_m2']} m² usable roof."
        })
        actions.append({"type": "set_tilt", "value": tilt_res["optimal_tilt_deg"]})
        actions.append({"type": "set_shader", "value": "heatmap"})
        if top:
            actions.append({"type": "select_roof", "value": top})
            
    return {
        "status": "completed",
        "goal": goal,
        "thoughts": thoughts,
        "actions": actions,
        "summary": {
            "total_buildings": len(buildings),
            "optimal_tilt": actions[0]["value"] if actions else 25.0,
            "top_building": top.get("name") if 'top' in locals() and top else None
        }
    }
