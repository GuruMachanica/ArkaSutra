import React, { useState } from 'react';
import PhotorealisticHeroMedia from '../media/PhotorealisticHeroMedia';
import ModeToggle from '../ui/ModeToggle';
import { Box, ArrowRight, Zap } from 'lucide-react';

export default function HeroSection({ onLaunchStudio }) {
  const [mode, setMode] = useState('morning');

  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#070a12'
      }}
    >
      {/* 1. Photorealistic 4-State Architectural Media */}
      <PhotorealisticHeroMedia mode={mode} />

      {/* 2. Soft ambient vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(9, 13, 22, 0.45) 0%, rgba(9, 13, 22, 0.15) 45%, rgba(9, 13, 22, 0.75) 100%)',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />

      {/* 3. Open Hero Content Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '104px',
          paddingBottom: '36px',
          paddingLeft: '24px',
          paddingRight: '24px',
          boxSizing: 'border-box'
        }}
      >
        {/* Center Text Block */}
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          {/* Micro-Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(9, 13, 22, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              backdropFilter: 'blur(16px)',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
            }}
          >
            <Zap size={14} color="#f59e0b" />
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#fbbf24',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              AI-Powered 3D Spatial Solar Engine v2.4
            </span>
          </div>

          {/* Main Hero Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '16px',
              textShadow: '0 4px 25px rgba(0, 0, 0, 0.95), 0 2px 5px rgba(0,0,0,0.8)'
            }}
          >
            Precision 3D Solar Potential &amp; <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fef08a 40%, #fb923c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 25px rgba(245, 158, 11, 0.5))'
              }}
            >
              Rooftop Intelligence
            </span>
          </h1>

          {/* Clean Subtitle Line with subtle text-shadow */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.25vw, 1.15rem)',
              color: '#f8fafc',
              lineHeight: 1.65,
              maxWidth: '780px',
              margin: '0 auto 28px',
              fontWeight: 500,
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9)'
            }}
          >
            Eliminate 25–40% shading errors with sub-degree LOD2 CityGML facet extraction, real-time WebGL shadow occlusion, and bankable PVLib solar yield forecasting.
          </p>

          {/* Dual Action Buttons: Launch 3D Studio on the Left, Explore Pipeline on the Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              pointerEvents: 'auto',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => onLaunchStudio('commercial')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 30px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 25px rgba(245, 158, 11, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Box size={18} />
              <span>Launch 3D Studio</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                borderRadius: '9999px',
                background: 'rgba(9, 13, 22, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(16px)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                transition: 'all 0.2s'
              }}
            >
              <span>Explore Pipeline</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Control Bar: Day/Night Mode Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto'
          }}
        >
          <ModeToggle mode={mode} onToggle={setMode} onModeChange={setMode} />
        </div>
      </div>
    </section>
  );
}
