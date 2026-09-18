import React from 'react';
import { Sun, Github } from 'lucide-react';
import AccoladesStrip from './footer/AccoladesStrip';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 0 28px', background: '#060911' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <AccoladesStrip />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px', marginBottom: '32px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Sun size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>arkasutra<span style={{ color: '#f59e0b' }}>.</span></span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Intelligent 3D spatial solar irradiance modeling, LOD2 CityGML rooftop normal extraction, and ray-traced shadow occlusion engine developed for urban photovoltaic assessment.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/GuruMachanica/ArkaSutra" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}
            >
              <Github size={16} /><span>Source Repository</span>
            </a>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', fontFamily: 'monospace' }}>
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span>WebGL 60 FPS Active</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} ArkaSutra • Mohammad Huzaifa (@GuruMachanica). Upgraded from Team IronLogic (CodeStorm'25). All rights reserved.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>Architect: Mohammad Huzaifa • Inquiries: mdhuzaifa00786@gmail.com</div>
        </div>
      </div>
    </footer>
  );
}
