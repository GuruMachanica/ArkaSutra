# ArkaSutra Engineering Documentation and Architecture Reference

This directory contains research specifications, solar transposition physics, autonomous agentic architecture, diurnal irradiance benchmarks, presentation materials, and system references for ArkaSutra.

---

## Table of Contents

1. [Physical Principles and Mathematical Derivations](#1-physical-principles-and-mathematical-derivations)
2. [Autonomous Solar Engineering Agent Architecture](#2-autonomous-solar-engineering-agent-architecture)
3. [CityGML LOD2 Normal and Tilt Extraction](#3-citygml-lod2-normal-and-tilt-extraction)
4. [OpenStreetMap 3D Dynamic Ingestion](#4-openstreetmap-3d-dynamic-ingestion)
5. [Copernicus and ERA5 Satellite Assimilation](#5-copernicus-and-era5-satellite-assimilation)
6. [Tilt and Orientation Factor (TOF) Matrices](#6-tilt-and-orientation-factor-tof-matrices)
7. [FastAPI Architecture and REST Endpoints](#7-fastapi-architecture-and-rest-endpoints)
8. [WebGL 3D Ray-Tracing and Shader Pipeline](#8-webgl-3d-ray-tracing-and-shader-pipeline)
9. [Single-Container Deployment Pipeline](#9-single-container-deployment-pipeline)
10. [Repository Assets and Visual Artifacts](#10-repository-assets-and-visual-artifacts)

---

## 1. Physical Principles and Mathematical Derivations

ArkaSutra models solar irradiance via a multi-stage physical transposition pipeline grounded in NREL PVLib standards and Perez clear-sky transposition algorithms.

### A. Celestial Sun Position Calculations
The solar declination delta for day of year n in [1, 365]:

$$\delta = 23.45^\circ \cdot \sin\left( \frac{360^\circ}{365} \cdot (n - 81) \right)$$

Given observer latitude phi and local solar hour angle H = (t - 12) * 15 deg, the solar elevation angle alpha is:

$$\sin(\alpha) = \sin(\phi)\sin(\delta) + \cos(\phi)\cos(\delta)\cos(H)$$

The solar zenith angle is theta_z = 90 deg - alpha.

Solar azimuth angle A (where 180 deg is South):

$$\tan(A) = \frac{-\cos(\delta)\sin(H)}{\sin(\delta)\cos(\phi) - \sin(\delta)\sin(\phi)\cos(H)}$$

### B. Optical Relative Airmass (m)
Atmospheric attenuation is computed using the Kasten-Young airmass formulation:

$$m(\theta_z) = \frac{1}{\cos(\theta_z) + 0.50572 \cdot (96.07995 - \theta_z)^{-1.6364}}$$

### C. Direct Normal and Global Horizontal Irradiance (DNI and GHI)
The extraterrestrial irradiance G_on accounts for earth orbital eccentricity:

$$G_{\text{on}} = G_{\text{sc}} \cdot \left[ 1 + 0.033 \cdot \cos\left( \frac{360^\circ \cdot n}{365} \right) \right]$$

where G_sc = 1361.0 W/m2 is the solar constant. Clear-sky Direct Normal Irradiance at ground level:

$$\text{DNI} = G_{\text{on}} \cdot 0.7^{\left(m(\theta_z)^{0.678}\right)}$$

$$\text{GHI} = \text{DNI} \cdot \cos(\theta_z) + \text{DHI}$$

### D. Plane-of-Array (POA) Transposition
For an architectural roof facet with tilt angle beta and azimuth gamma, total transposed irradiance is:

$$I_{\text{poa}} = I_{\text{beam}} + I_{\text{diffuse, sky}} + I_{\text{ground, reflected}}$$

---

## 2. Autonomous Solar Engineering Agent Architecture

ArkaSutra integrates an autonomous goal-driven agent engine:

* Perception:
  * Ingests spatial footprints, LiDAR heights, roof orientations, and live satellite telemetry.
* Reasoning:
  * Decomposes user goals (e.g. "Full District Audit", "Maximize Portfolio ROI", "Winter Shade Mitigation").
  * Evaluates inter-building shadow matrices and transposition gains.
* Optimization:
  * Solves optimal seasonal tilt pitch beta* = |latitude| +/- delta.
  * Filters and ranks structures by annual generation (kWh) and utility tariff bill offset ($/yr).
* Execution:
  * Emits real-time scene control directives: updates panel pitch, activates false-color irradiance heatmaps, and highlights optimal rooftop assets in the 3D viewport.

---

## 3. CityGML LOD2 Normal and Tilt Extraction

The Python GIS parser processes OGC CityGML 2.0/3.0 LOD2 models:

1. Polygon Decomposition: Traverses `<bldg:RoofSurface>` XML nodes, separating exterior boundaries and interior cutouts.
2. 3D Surface Normal Extraction: Uses Newell's polygon method to derive unit normal vector n = [nx, ny, nz].
3. Tilt and Azimuth Derivation:
   * Tilt: beta = arccos(nz) (0 deg for flat roofs, 90 deg for vertical facades).
   * Azimuth: gamma = atan2(nx, ny) mapped to compass bearing [0 deg, 360 deg].
4. Surface Area Calculation: Computes planar area using 3D cross-product triangle integration.

---

## 4. OpenStreetMap 3D Dynamic Ingestion

To eliminate mandatory manual file uploads, ArkaSutra streams real-world building polygons directly from OpenStreetMap Overpass API:
* Overpass QL Query: Fetches building ways and relations within a specified radius (e.g. 200m) around any global coordinate.
* Geometry Parser: Reprojects WGS84 coordinates into metric Cartesian meters [x, z] relative to the scene center.
* Resilient Fallback: If external Overpass gateways experience rate limiting or timeouts, a coordinate-calibrated spatial synthesizer generates deterministic building density matching local urban zoning.

---

## 5. Copernicus and ERA5 Satellite Assimilation

Live atmospheric assimilation pipeline:
* Data Ingestion: Connects to Copernicus ERA5 reanalysis and ECMWF satellite forecasts.
* Extracted Telemetry: Live Global Horizontal Irradiance (GHI), ambient temperature (deg C), wind speed (km/h), and cloud derate factor (0.0 to 1.0).
* Cloud Derate Modeling: Dynamically scales clear-sky POA irradiance to reflect real-time cloud attenuation.

---

## 6. Tilt and Orientation Factor (TOF) Matrices

The Tilt and Orientation Factor (TOF) is the ratio of annual insolation on a tilted/oriented roof facet relative to an optimally oriented surface:

$$\text{TOF}(\beta, \gamma) = \frac{\text{Annual Radiation}(\beta, \gamma)}{\text{Annual Radiation}(\beta_{\text{optimal}}, \gamma_{\text{optimal}})}$$

Precomputed TOF dictionaries are located in `Datasets/TOF.dict` and plotted in `Docs/TOF-plot.pdf`.

---

## 7. FastAPI Architecture and REST Endpoints

The backend runs a high-performance FastAPI server with automatic OpenAPI documentation.

### Core Endpoints

* `GET /api/health` - System health, version telemetry, and deployment mode status.
* `POST /api/agent/dispatch` - Dispatches autonomous agent goal with multi-phase thoughts and scene actions.
* `GET /api/agent/goals` - Lists pre-engineered autonomous solar optimization goals.
* `GET /api/city/buildings` - Stream real-world 3D building polygons from OpenStreetMap.
* `GET /api/satellite/live-solar` - Assimilate live Copernicus and ERA5 solar irradiance.
* `GET /api/topologies` - Retrieve enriched 3D urban topologies.
* `POST /api/solar/calculate` - Pydantic-validated PV yield and financial modeling.
* `POST /api/solar/position` - Diurnal celestial solar position coordinates.

---

## 8. WebGL 3D Ray-Tracing and Shader Pipeline

Implemented in Three.js:
* Directional Sunlight Vector: Synchronized in real-time with astronomical celestial formulas at radius 185.
* Celestial Sun Arc Ribbon: Visual 3D trajectory line illustrating the seasonal orbital path across the sky dome.
* Shadow Map: High-resolution `PCFSoftShadowMap` (4096x4096) with soft edge filtering.
* Color Pipeline: ACES Filmic tone mapping with sRGB output color space.
* Shading Modes: Realistic, Solar Heatmap, Shadow Occlusion, and CAD Wireframe.

---

## 9. Single-Container Deployment Pipeline

ArkaSutra supports a unified full-stack single deployment using the multi-stage Dockerfile:

```
+-------------------------------------------------------------+
| Stage 1: node:20-alpine (Build Frontend into Frontend/dist) |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Stage 2: python:3.11-slim (FastAPI Server + Static SPA)     |
| - Serves /api/* and /docs                                   |
| - Serves Frontend/dist with SPA fallback on Port 8000       |
+-------------------------------------------------------------+
```

### Run Locally:
```bash
docker build -t arkasutra-unified:latest .
docker run -p 8000:8000 arkasutra-unified:latest
```

---

## 10. Repository Assets and Visual Artifacts

* `Docs/sunmap_pitch.pptx` - Official CodeStorm'25 pitch deck.
* `Docs/dailyplot.pdf` / `dailyplot.png` - Diurnal irradiation curves.
* `Docs/TOF-plot.pdf` - Contour map of annual solar irradiation across azimuths and tilts.
* `Docs/home.png` - High-resolution studio preview screenshot.
