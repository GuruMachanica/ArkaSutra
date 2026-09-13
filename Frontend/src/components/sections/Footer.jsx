import React from 'react';
import { Sun, ShieldCheck, Github, Award, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 0 28px', background: '#060911' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Accolades Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            paddingBottom: '28px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            <Award size={18} /> CodeStorm’25 Hackathon Winner Project
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <ShieldCheck size={18} /> CityGML LOD2 Geometry Extraction Engine
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={18} /> NREL PVLib Irradiance Physics Benchmarked
          </div>
        </div>

        {/* Streamlined 2-Column Layout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px', marginBottom: '32px' }}>
          {/* Brand & Description */}
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <Sun size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                sunmap<span style={{ color: '#f59e0b' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Intelligent 3D spatial solar irradiance modeling, LOD2 CityGML rooftop normal extraction, and ray-traced shadow occlusion engine developed for urban photovoltaic assessment.
            </p>
          </div>

          {/* Social & Engine Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/GuruMachanica/SunMap"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <Github size={16} />
              <span>Source Repository</span>
            </a>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontFamily: 'monospace'
              }}
            >
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span>WebGL 60 FPS Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} SunMap • Team Ironlogic. All rights reserved. Proprietary - Strict Private Use &amp; Inspection License.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>
            Inquiries: ironlogic@zohomail.in
          </div>
        </div>
      </div>
    </footer>
  );
}
