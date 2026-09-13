import React, { useState } from 'react';
import PhotorealisticHeroMedia from '../media/PhotorealisticHeroMedia';
import HeroContent from './hero/HeroContent';
import HeroActions from './hero/HeroActions';

export default function HeroSection({ onLaunchStudio }) {
  const [mode, setMode] = useState('morning');

  return (
    <section style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#070a12' }}>
      <PhotorealisticHeroMedia mode={mode} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(9, 13, 22, 0.45) 0%, rgba(9, 13, 22, 0.15) 45%, rgba(9, 13, 22, 0.75) 100%)',
        zIndex: 5, pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        paddingTop: '104px', paddingBottom: '36px', paddingLeft: '24px', paddingRight: '24px', boxSizing: 'border-box'
      }}>
        <HeroContent />
        <HeroActions onLaunchStudio={onLaunchStudio} mode={mode} setMode={setMode} />
      </div>
    </section>
  );
}
