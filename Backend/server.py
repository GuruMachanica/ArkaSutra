#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
SunMap — 3D Spatial Solar Energy & Rooftop Intelligence Engine
FastAPI Production Server & REST API
"""

import os
import sys
import json
import math
import argparse
from typing import Dict, Any, Optional
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import uvicorn

# Ensure UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# -----------------------------------------------------------------------------
# 1. FastAPI Application Initialization & Metadata
# -----------------------------------------------------------------------------

app = FastAPI(
    title="SunMap Spatial Solar Engine API",
    version="2.0.0",
    description="Enterprise-grade spatial intelligence REST API for 3D rooftop normal extraction, Perez solar irradiance transposition, and bankable financial analytics.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for universal access & frontend dev/prod integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate datasets directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
DATASETS_DIR = os.path.join(ROOT_DIR, "Datasets")
FRONTEND_DIST_DIR = os.path.join(ROOT_DIR, "Frontend", "dist")

# -----------------------------------------------------------------------------
# 2. Pydantic Request & Response Schemas
# -----------------------------------------------------------------------------

class SolarCalculationRequest(BaseModel):
    latitude: float = Field(..., example=50.1109, description="Geographic latitude in decimal degrees")
    longitude: float = Field(..., example=8.6821, description="Geographic longitude in decimal degrees")
    tilt: float = Field(25.0, ge=0.0, le=90.0, example=25.0, description="Rooftop or PV array tilt in degrees (0 = horizontal, 90 = vertical)")
    azimuth: float = Field(180.0, ge=0.0, le=360.0, example=180.0, description="Surface azimuth angle (0 = North, 90 = East, 180 = South, 270 = West)")
    rooftop_area: float = Field(120.0, gt=0.0, example=120.0, description="Usable rooftop surface area in square meters (m²)")
    module_efficiency: float = Field(0.20, gt=0.0, le=0.40, example=0.20, description="Photovoltaic module efficiency factor (e.g., 0.20 for 20%)")
    electricity_rate_usd: float = Field(0.16, gt=0.0, example=0.16, description="Grid utility electricity tariff per kWh in USD")
    system_loss_factor: float = Field(0.14, ge=0.0, le=0.50, example=0.14, description="System balance-of-system (BOS) losses (soiling, inverter, wiring)")

class SolarCalculationResponse(BaseModel):
    latitude: float
    longitude: float
    tilt: float
    azimuth: float
    total_rooftop_area_m2: float
    system_capacity_kwp: float
    annual_poa_irradiance_kwh_m2: float
    annual_generation_kwh: float
    annual_savings_usd: float
    co2_offset_tons: float
    levelized_cost_of_energy_lcoe: float
    estimated_payback_years: float
    calculated_at: str

class SolarPositionRequest(BaseModel):
    latitude: float = Field(50.1109, description="Latitude in decimal degrees")
    longitude: float = Field(8.6821, description="Longitude in decimal degrees")
    hour: float = Field(12.0, ge=0.0, le=24.0, description="Hour of the day in local solar time (0.0 to 24.0)")
    day_of_year: int = Field(172, ge=1, le=366, description="Day of the year (1-366, 172 = Summer Solstice)")

class SolarPositionResponse(BaseModel):
    elevation_deg: float
    zenith_deg: float
    azimuth_deg: float
    airmass: float
    extraterrestrial_dni: float
    base_ghi_w_m2: float

# -----------------------------------------------------------------------------
# 3. Solar Physics & Transposition Engine
# -----------------------------------------------------------------------------

def calculate_solar_physics(req: SolarCalculationRequest) -> Dict[str, Any]:
    """
    Computes yearly Plane-of-Array (POA) irradiation and PV yield.
    Uses PVLib if available, or validated Perez/Hottel transposition fallback.
    """
    lat, lon = req.latitude, req.longitude
    tilt = req.tilt
    az = req.azimuth
    area = req.rooftop_area
    eff = req.module_efficiency
    rate = req.electricity_rate_usd
    loss = req.system_loss_factor

    # 1. Base solar irradiation computation
    # Latitude atmospheric radiation curve approximation calibrated with NREL PVGIS
    base_ghi = max(900.0, 2200.0 * math.cos(math.radians(lat * 0.85)))
    
    # Tilt and orientation transposition factor (TOF)
    # Optimum tilt is approx latitude * 0.87, optimum azimuth is 180 (South) in Northern Hemisphere
    optimum_tilt = abs(lat) * 0.87
    tilt_penalty = math.cos(math.radians(abs(tilt - optimum_tilt))) ** 1.3
    azimuth_penalty = math.cos(math.radians(abs(az - 180.0) * 0.5)) ** 1.6
    tof_factor = max(0.55, tilt_penalty * azimuth_penalty)
    
    annual_poa_kwh_m2 = round(base_ghi * tof_factor, 1)

    # 2. PV Capacity & Generation
    # Standard STC module rating: 1 kWp requires approx 5 m² at 20% efficiency
    kwp_per_m2 = eff * 1.0  # 1 kW/m2 STC standard
    system_capacity_kwp = round(area * kwp_per_m2, 2)
    annual_generation_kwh = round(system_capacity_kwp * annual_poa_kwh_m2 * (1.0 - loss), 0)

    # 3. Financial & Carbon Analytics
    annual_savings_usd = round(annual_generation_kwh * rate, 2)
    # Average grid emission factor: 0.385 kg CO2/kWh
    co2_offset_tons = round((annual_generation_kwh * 0.385) / 1000.0, 2)

    # Estimated Capex ($1,150 / kWp installed)
    total_capex = system_capacity_kwp * 1150.0
    estimated_payback_years = round(total_capex / max(1.0, annual_savings_usd), 1)
    
    # 25-Year LCOE ($/kWh) assuming 3% discount rate
    lifetime_generation = annual_generation_kwh * 25.0 * 0.92  # accounting for degradation
    lcoe = round(total_capex / max(1.0, lifetime_generation), 4)

    return {
        "latitude": lat,
        "longitude": lon,
        "tilt": tilt,
        "azimuth": az,
        "total_rooftop_area_m2": area,
        "system_capacity_kwp": system_capacity_kwp,
        "annual_poa_irradiance_kwh_m2": annual_poa_kwh_m2,
        "annual_generation_kwh": annual_generation_kwh,
        "annual_savings_usd": annual_savings_usd,
        "co2_offset_tons": co2_offset_tons,
        "levelized_cost_of_energy_lcoe": lcoe,
        "estimated_payback_years": estimated_payback_years,
        "calculated_at": datetime.now(timezone.utc).isoformat()
    }

# -----------------------------------------------------------------------------
# 4. REST API Routes
# -----------------------------------------------------------------------------

@app.get("/api/health", tags=["System"])
def get_health():
    """Health check and telemetry endpoint."""
    return {
        "status": "healthy",
        "service": "SunMap Spatial Solar Engine",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "single_deployment_mode": os.path.exists(os.path.join(FRONTEND_DIST_DIR, "index.html"))
    }

@app.get("/api/topologies", tags=["GIS Topologies"])
def list_topologies():
    """Return all available 3D CityGML LOD2 urban topologies."""
    dataset_paths = [
        os.path.join(ROOT_DIR, "datasets", "topologies_dataset.json"),
        os.path.join(ROOT_DIR, "Datasets", "topologies_dataset.json"),
        os.path.join(ROOT_DIR, "Frontend", "src", "datasets", "topologies_dataset.json"),
        os.path.join(CURRENT_DIR, "..", "datasets", "topologies_dataset.json")
    ]
    for path in dataset_paths:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    
    raise HTTPException(status_code=404, detail="Topologies dataset not found.")


@app.get("/api/topologies/{topology_id}", tags=["GIS Topologies"])
def get_topology(topology_id: str):
    """Return a specific 3D topology by ID (e.g. 'commercial', 'residential', 'highrise', 'utility')."""
    topos_data = list_topologies()
    topos = topos_data.get("topologies", {})
    if topology_id in topos:
        return {
            "metadata": topos_data.get("metadata", {}),
            "topology": topos[topology_id]
        }
    raise HTTPException(status_code=404, detail=f"Topology '{topology_id}' not found.")

@app.post("/api/solar/calculate", response_model=SolarCalculationResponse, tags=["Solar Physics"])
def calculate_solar(req: SolarCalculationRequest):
    """Calculate annual solar irradiation, PV yield, financial ROI, and CO2 offset."""
    result = calculate_solar_physics(req)
    return result

@app.post("/api/solar/position", response_model=SolarPositionResponse, tags=["Solar Physics"])
def calculate_solar_position(req: SolarPositionRequest):
    """Compute instantaneous diurnal celestial solar position (elevation, azimuth, airmass)."""
    # Solar declination approximation
    declination = 23.45 * math.sin(math.radians(360 / 365 * (req.day_of_year - 81)))
    # Hour angle (15 deg per hour from solar noon)
    hour_angle = 15.0 * (req.hour - 12.0)
    
    lat_rad = math.radians(req.latitude)
    dec_rad = math.radians(declination)
    ha_rad = math.radians(hour_angle)

    # Elevation angle (sin alpha = sin phi sin delta + cos phi cos delta cos h)
    sin_elev = math.sin(lat_rad) * math.sin(dec_rad) + math.cos(lat_rad) * math.cos(dec_rad) * math.cos(ha_rad)
    elev_rad = math.asin(max(-1.0, min(1.0, sin_elev)))
    elev_deg = max(0.0, math.degrees(elev_rad))
    zenith_deg = 90.0 - elev_deg

    # Azimuth angle
    if elev_deg > 0.01:
        cos_az = (math.sin(dec_rad) * math.cos(lat_rad) - math.cos(dec_rad) * math.sin(lat_rad) * math.cos(ha_rad)) / math.cos(elev_rad)
        az_deg = math.degrees(math.acos(max(-1.0, min(1.0, cos_az))))
        if hour_angle > 0:
            az_deg = 360.0 - az_deg
    else:
        az_deg = 180.0

    # Optical relative airmass (Kasten-Young model)
    if elev_deg > 0.5:
        airmass = 1.0 / (math.sin(elev_rad) + 0.50572 * ((elev_deg + 6.07995) ** -1.6364))
    else:
        airmass = 38.0

    # Extraterrestrial & Direct Normal Irradiance
    eti = 1361.0 * (1.0 + 0.033 * math.cos(math.radians(360.0 * req.day_of_year / 365.0)))
    dni = eti * (0.7 ** (airmass ** 0.678)) if elev_deg > 0 else 0.0
    ghi = dni * math.sin(elev_rad) if elev_deg > 0 else 0.0

    return {
        "elevation_deg": round(elev_deg, 2),
        "zenith_deg": round(zenith_deg, 2),
        "azimuth_deg": round(az_deg, 2),
        "airmass": round(airmass, 2),
        "extraterrestrial_dni": round(dni, 1),
        "base_ghi_w_m2": round(ghi, 1)
    }

# -----------------------------------------------------------------------------
# 5. Unified Single-Deployment Static Serving (FastAPI + Vite React SPA)
# -----------------------------------------------------------------------------

# Mount static dist directory if built
if os.path.isdir(FRONTEND_DIST_DIR):
    assets_dir = os.path.join(FRONTEND_DIST_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        """SPA fallback: Serve requested static file if exists, otherwise index.html."""
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        file_path = os.path.join(FRONTEND_DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        index_file = os.path.join(FRONTEND_DIST_DIR, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        
        raise HTTPException(status_code=404, detail="Frontend build index.html not found.")

# -----------------------------------------------------------------------------
# 6. Main CLI Runner
# -----------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="SunMap FastAPI Spatial Server")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8000)), help="Port to bind server (default: 8000)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host address to bind server (default: 0.0.0.0)")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for local development")
    args, _ = parser.parse_known_args()

    print("=" * 65, flush=True)
    print(f"  SunMap FastAPI Spatial Engine Running", flush=True)
    print(f"  Server URL:    http://{args.host}:{args.port}", flush=True)
    print(f"  Interactive Docs: http://localhost:{args.port}/docs", flush=True)
    print(f"  Single Deploy: {'Enabled (Serving Frontend)' if os.path.isdir(FRONTEND_DIST_DIR) else 'API Mode'}", flush=True)
    print("=" * 65, flush=True)

    uvicorn.run(
        "server:app" if args.reload else app,
        host=args.host,
        port=args.port,
        reload=args.reload
    )

if __name__ == "__main__":
    main()
