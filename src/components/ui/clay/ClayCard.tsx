'use client';

import { forwardRef, type HTMLAttributes } from 'react';

interface ClayCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'pressed';
}

export const ClayCard = forwardRef<HTMLDivElement, ClayCardProps>(
  ({ className, variant = 'default', children, style, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: '#F5F6F7',
      borderRadius: '24px',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      default: { boxShadow: '0 8px 30px rgba(0,0,0,0.06), 0 2px 4px rgba(255,255,255,0.8) inset' },
      elevated: { boxShadow: '0 12px 40px rgba(0,0,0,0.1)' },
      pressed: { boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)' },
    };

    return (
      <div
        ref={ref}
        style={{
          ...baseStyle,
          ...variantStyles[variant],
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ClayCard.displayName = 'ClayCard';
