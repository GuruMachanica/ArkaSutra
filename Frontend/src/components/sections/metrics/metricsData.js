import { Sun, CheckCircle, Shield, Award } from 'lucide-react';

export const METRICS = [
  { icon: Sun, color: '#f59e0b', value: '98.4%', label: 'POA Irradiance Accuracy', desc: 'NREL PVLib Benchmarked' },
  { icon: CheckCircle, color: '#10b981', value: 'CityGML LOD2', label: 'Vector Facet Normal Extraction', desc: 'Sub-Degree Azimuth & Pitch' },
  { icon: Shield, color: '#38bdf8', value: '60 FPS WebGL', label: 'Ray-Traced Shadow Occlusion', desc: 'Real-Time Hardware Raycasting' },
  { icon: Award, color: '#8b5cf6', value: '8,760 Vectors', label: 'Hourly Diurnal Solar Tracking', desc: 'Annual Simulation Engine' }
];
