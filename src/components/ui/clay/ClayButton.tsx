'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
  ({ className, variant = 'default', size = 'md', children, style, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      fontWeight: 500,
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: 'pointer',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      default: { backgroundColor: '#F5F6F7', color: '#2F2F33' },
      primary: { backgroundColor: '#6C63FF', color: 'white' },
      success: { backgroundColor: '#27AE60', color: 'white' },
      danger: { backgroundColor: '#E74C3C', color: 'white' },
      ghost: { backgroundColor: 'transparent', color: '#2F2F33' },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '6px 12px', fontSize: '14px', borderRadius: '10px' },
      md: { padding: '10px 20px', fontSize: '16px', borderRadius: '14px' },
      lg: { padding: '14px 28px', fontSize: '18px', borderRadius: '16px' },
    };

    const shadowStyle: React.CSSProperties = {
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    };

    return (
      <button
        ref={ref}
        style={{
          ...baseStyle,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...shadowStyle,
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ClayButton.displayName = 'ClayButton';
