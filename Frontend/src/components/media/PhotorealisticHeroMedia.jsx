import React from 'react';

export default function PhotorealisticHeroMedia({ mode = 'morning' }) {
  const frames = {
    morning: '/assets/morning-frame.jpg',
    afternoon: '/assets/afternoon-frame.jpg',
    evening: '/assets/evening-frame.jpg',
    night: '/assets/night-frame.jpg'
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
        background: '#0c1117'
      }}
    >
      {/* Fixed Container with Pure Smooth Cross-Fade (Zero Shaking / Zero Jumping) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      >
        {Object.entries(frames).map(([key, src]) => {
          const isCurrent = mode === key;

          return (
            <img
              key={key}
              src={src}
              alt={`Photorealistic Modern Solar Architecture - ${key}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: isCurrent ? 2 : 1,
                opacity: isCurrent ? 1 : 0,
                transform: 'scale(1.0)',
                transition: 'opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
                willChange: 'opacity'
              }}
            />
          );
        })}
      </div>

      {/* Cinematic Environmental Ambient Tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            mode === 'night'
              ? 'radial-gradient(ellipse at 50% 50%, rgba(4, 7, 15, 0.2) 0%, rgba(4, 7, 15, 0.65) 70%, rgba(4, 7, 15, 0.9) 100%)'
              : mode === 'evening'
              ? 'radial-gradient(ellipse at 50% 50%, rgba(20, 10, 5, 0.15) 0%, rgba(20, 10, 5, 0.5) 70%, rgba(12, 17, 23, 0.85) 100%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(12, 17, 23, 0.15) 0%, rgba(12, 17, 23, 0.5) 70%, rgba(12, 17, 23, 0.85) 100%)',
          zIndex: 3,
          transition: 'background 0.65s ease',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
