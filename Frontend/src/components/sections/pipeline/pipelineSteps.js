import { Layers, Box, Sun, FileCheck } from 'lucide-react';

export const PIPELINE_STEPS = [
  {
    num: '01', icon: Layers, title: 'LOD2 Geometry Extraction',
    description: 'Parses 3D CityGML polygon boundaries, surface normals [nx, ny, nz], rooftop area, and pitch angles with sub-degree vector accuracy.'
  },
  {
    num: '02', icon: Box, title: 'Ray-Traced Shadow Occlusion',
    description: 'Calculates real-time solar ray obstruction from adjacent skyscrapers, trees, and rooftop HVAC units across all 8,760 hourly celestial vectors.'
  },
  {
    num: '03', icon: Sun, title: 'Perez Irradiance Transposition',
    description: 'Splits direct normal (DNI), diffuse (DHI), and ground albedo flux on each tilted PV facet using NREL-benchmarked transposition physics.'
  },
  {
    num: '04', icon: FileCheck, title: 'Bankable Yield & ROI Audit',
    description: 'Computes annual clean kWh generation, 25-year financial cash flow, utility tariff offsets, and carbon abatement metrics.'
  }
];
