import React from 'react';

export default function ModeToggle({ mode = 'morning', onToggle, onModeChange }) {
  const modes = [
    { id: 'morning', label: 'Morning', sub: '08:00 AM • 450 W/m²', index: 0 },
    { id: 'afternoon', label: 'Afternoon', sub: '01:00 PM • 980 W/m²', index: 1 },
    { id: 'evening', label: 'Evening', sub: '06:00 PM • 320 W/m²', index: 2 },
    { id: 'night', label: 'Night', sub: '10:00 PM • 0 W/m²', index: 3 }
  ];

  const activeIndex = Math.max(0, modes.findIndex((m) => m.id === mode));

  const handleSelect = (id) => {
    if (onToggle) onToggle(id);
    if (onModeChange) onModeChange(id);
  };

  return (
    <div className="toggle-container" style={{ pointerEvents: 'auto' }}>
      {/* Sliding white pill indicator */}
      <div
        className="toggle-slider"
        style={{
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))`
        }}
      />

      {/* 4 Mode Buttons */}
      {modes.map((item) => {
        const isActive = mode === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`toggle-btn ${isActive ? 'active' : ''}`}
            data-mode={item.id}
            data-index={item.index}
            onClick={() => handleSelect(item.id)}
            style={{ cursor: 'pointer', zIndex: 5 }}
          >
            <span className="btn-title">{item.label}</span>
            <span className="btn-sub">{item.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
