import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  icon: Icon,
  className = '',
  style = {},
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-full)',
    fontFamily: 'var(--font-main)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    border: 'none',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    textDecoration: 'none'
  };

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '0.85rem' },
    md: { padding: '12px 24px', fontSize: '0.95rem' },
    lg: { padding: '16px 36px', fontSize: '1.05rem', fontWeight: 700 }
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#ffffff',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)'
    },
    outline: {
      background: 'transparent',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    glow: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
      color: '#0f172a',
      fontWeight: 700,
      boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
      className={`btn ${className}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        if (variant === 'primary' || variant === 'glow') {
          e.currentTarget.style.boxShadow = '0 10px 28px rgba(245, 158, 11, 0.55)';
        } else {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.35)';
        } else if (variant === 'glow') {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.5)';
        } else {
          e.currentTarget.style.background = variantStyles[variant].background;
        }
      }}
      {...props}
    >
      {children}
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
    </button>
  );
}
