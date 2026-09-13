# SunMap Engineering Documentation & Architecture Reference

This directory contains research papers, solar transposition benchmarks, diurnal irradiance plots, presentation materials, and system architecture specifications for **SunMap**.

---

## Table of Contents

1. [Physical Principles & Mathematical Derivations](#1-physical-principles--mathematical-derivations)
2. [CityGML LOD2 Normal & Tilt Extraction](#2-citygml-lod2-normal--tilt-extraction)
3. [Tilt & Orientation Factor (TOF) Matrices](#3-tilt--orientation-factor-tof-matrices)
4. [FastAPI Architecture & REST Endpoints](#4-fastapi-architecture--rest-endpoints)
5. [WebGL 3D Ray-Tracing Engine](#5-webgl-3d-ray-tracing-engine)
6. [Single-Container Deployment Pipeline](#6-single-container-deployment-pipeline)
7. [Repository Assets & Visual Artifacts](#7-repository-assets--visual-artifacts)

---

## 1. Physical Principles & Mathematical Derivations

SunMap models solar irradiance via a multi-stage physical transposition pipeline grounded in NREL PVLib standards and Perez clear-sky transposition algorithms.

### A. Celestial Sun Position Calculations
The solar declination $\delta$ for any day of the year $n \in [1, 365]$ is calculated by:

$$\delta = 23.45^\circ \cdot \sin\left( \frac{360^\circ}{365} \cdot (n - 81) \right)$$

Given the observer latitude $\phi$ and local solar hour angle $h = 15^\circ \cdot (t - 12)$, the solar elevation angle $\alpha$ is:

$$\sin(\alpha) = \sin(\phi)\sin(\delta) + \cos(\phi)\cos(\delta)\cos(h)$$

The solar zenith angle is simply $\theta_z = 90^\circ - \alpha$.

### B. Optical Relative Airmass ($m$)
To accurately model atmospheric extinction across diurnal angles, SunMap employs the Kasten-Young airmass formulation:

$$m(\theta_z) = \frac{1}{\cos(\theta_z) + 0.50572 \cdot (96.07995 - \theta_z)^{-1.6364}}$$

### C. Direct Normal & Global Horizontal Irradiance (DNI & GHI)
The extraterrestrial irradiance $G_{\text{on}}$ is modulated by earth orbital eccentricity:

$$G_{\text{on}} = G_{\text{sc}} \cdot \left[ 1 + 0.033 \cdot \cos\left( \frac{360^\circ \cdot n}{365} \right) \right]$$

where $G_{\text{sc}} = 1361.0 \text{ W/m}^2$ is the solar constant. Direct Normal Irradiance at ground level:

$$\text{DNI} = G_{\text{on}} \cdot 0.7^{\left(m(\theta_z)^{0.678}\right)}$$

$$\text{GHI} = \text{DNI} \cdot \cos(\theta_z) + \text{DHI}$$

### D. Plane-of-Array (POA) Transposition
For a rooftop facet with tilt angle $\beta$ and azimuth $\gamma$, total transposed irradiance $I_{\text{poa}}$ is:

$$I_{\text{poa}} = I_{\text{beam}} + I_{\text{diffuse, sky}} + I_{\text{ground, reflected}}$$

---

## 2. CityGML LOD2 Normal & Tilt Extraction

The Python GIS parser ([Backend/SunMap.py](file:///c:/Desktop/Stand-Up/Projects/SunMap/Backend/SunMap.py) & [Backend/polygon3dmodule.py](file:///c:/Desktop/Stand-Up/Projects/SunMap/Backend/polygon3dmodule.py)) processes OGC CityGML 2.0/3.0 LOD2 models:

1. **Polygon Decomposition**: Traverses `<bldg:RoofSurface>` XML nodes and decomposes outer boundaries (`<gml:exterior>`) and inner cutouts (`<gml:interior>`).
2. **3D Surface Normal Extraction**: Uses Newell's polygon method to extract 3D unit normal vector $\mathbf{n} = [n_x, n_y, n_z]$.
3. **Tilt & Azimuth Derivation**:
   * **Tilt Angle**: $\beta = \arccos(n_z)$ (0° for flat roof, 90° for vertical wall).
   * **Azimuth Angle**: $\gamma = \text{atan2}(n_x, n_y)$ mapped to compass bearing $[0^\circ, 360^\circ]$ where $180^\circ$ is true South.
4. **Surface Area Calculation**: Computes 3D planar area using cross-product triangle integration.

---

## 3. Tilt & Orientation Factor (TOF) Matrices

The Tilt and Orientation Factor (TOF) is the ratio of annual insolation on a tilted/oriented roof facet relative to an optimally oriented surface:

$$\text{TOF}(\beta, \gamma) = \frac{\text{Annual Radiation}(\beta, \gamma)}{\text{Annual Radiation}(\beta_{\text{optimal}}, \gamma_{\text{optimal}})}$$

Precomputed TOF dictionaries are located in `Datasets/TOF.dict` and plotted in `Docs/TOF-plot.pdf`.

---

## 4. FastAPI Architecture & REST Endpoints

The backend runs a high-performance **FastAPI** server ([Backend/server.py](file:///c:/Desktop/Stand-Up/Projects/SunMap/Backend/server.py)) with automatic OpenAPI documentation.

### Key Routes

* `GET /api/health` — Telemetry and deployment mode status.
* `GET /api/topologies` — Retrieve enriched 3D urban topologies (Commercial Campus, Residential Eco-Village, High-Rise District, Utility Solar Farm).
* `POST /api/solar/calculate` — Pydantic-validated PV yield and financial modeling:
  ```json
  {
    "latitude": 50.1109,
    "longitude": 8.6821,
    "tilt": 25.0,
    "azimuth": 180.0,
    "rooftop_area": 120.0,
    "module_efficiency": 0.20,
    "electricity_rate_usd": 0.16,
    "system_loss_factor": 0.14
  }
  ```
* `POST /api/solar/position` — Diurnal solar coordinates calculation given hour and day of year.

---

## 5. WebGL 3D Ray-Tracing Engine

Implemented in [SolarCanvas3D.jsx](file:///c:/Desktop/Stand-Up/Projects/SunMap/Frontend/src/components/studio/SolarCanvas3D.jsx):
* **Directional Sunlight Vector**: Synchronized in real-time with diurnal celestial formulas.
* **Shadow Map**: High-resolution `PCFSoftShadowMap` (4096×4096) with soft edge filtering.
* **Color Pipeline**: ACES Filmic tone mapping with sRGB output color space.
* **Topological Variety**: Supports 4 architectural scale modes with animated single-axis PV trackers.

---

## 6. Single-Container Deployment Pipeline

SunMap supports a unified full-stack single deployment using the multi-stage [Dockerfile](file:///c:/Desktop/Stand-Up/Projects/SunMap/Dockerfile):

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
docker build -t sunmap-unified:latest .
docker run -p 8000:8000 sunmap-unified:latest
```

---

## 7. Repository Assets & Visual Artifacts

* `Docs/sunmap_pitch.pptx` — Official CodeStorm’25 pitch deck.
* `Docs/dailyplot.pdf` / `dailyplot.png` — Diurnal irradiation curves.
* `Docs/TOF-plot.pdf` — Contour map of annual solar irradiation across azimuths and tilts.
* `Docs/home.png` — High-resolution studio preview screenshot.
