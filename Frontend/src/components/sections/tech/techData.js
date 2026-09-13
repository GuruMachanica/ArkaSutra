import { Layers, Sun, Cpu, Globe, Sliders, ShieldCheck } from 'lucide-react';

export const TECH_CARDS = [
  {
    icon: Layers, color: '#f59e0b', badge: 'OGC Standard',
    title: 'LOD2 CityGML Normal Extractor',
    desc: 'Parses complex 3D urban polygon boundaries, roof facet orientations, and coordinates directly from OGC CityGML 3.0 vector schemas.'
  },
  {
    icon: Sun, color: '#38bdf8', badge: 'NREL PVLib',
    title: 'Perez Solar Transposition Physics',
    desc: 'Calculates circumsolar, isotropic sky diffuse, and ground-reflected albedo components on arbitrary tilt angles using NREL algorithms.'
  },
  {
    icon: Cpu, color: '#10b981', badge: 'Three.js Engine',
    title: 'WebGL 60 FPS Ray-Tracing',
    desc: 'Hardware-accelerated shadow raycasting rendering accurate diurnal shadow occlusions from adjacent skyscrapers and terrain.'
  },
  {
    icon: Globe, color: '#8b5cf6', badge: 'Sub-Degree Precision',
    title: 'Astronomical Celestial Tracking',
    desc: 'Real-time solar position equations computing hourly solar elevation, azimuth, and airmass coefficients for any global coordinate.'
  },
  {
    icon: Sliders, color: '#ec4899', badge: 'Tracker Simulation',
    title: 'Single-Axis PV Tracker Modeler',
    desc: 'Simulates dynamic 0°–45° single-axis horizontal and tilted photovoltaic tracker arrays with active backtracking algorithms.'
  },
  {
    icon: ShieldCheck, color: '#14b8a6', badge: 'Bankable ROI',
    title: 'Bankable Financial Modeling',
    desc: 'Generates bank-grade engineering audits, Levelized Cost of Energy (LCOE), Net Present Value (NPV), and carbon abatement reports.'
  }
];
