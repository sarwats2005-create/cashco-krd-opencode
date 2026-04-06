'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface ClayInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ClayInput = forwardRef<HTMLInputElement, ClayInputProps>(
  ({ className, error, style, ...props }, ref) => {
    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#F5F6F7',
      borderRadius: '16px',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)',
      border: error ? '1px solid #E74C3C' : '1px solid #E0E0E0',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontSize: '16px',
      fontFamily: 'inherit',
      ...style,
    };

    const focusStyle: React.CSSProperties = {
      borderColor: error ? '#E74C3C' : '#6C63FF',
      boxShadow: error 
        ? '0 0 0 3px rgba(231,76,60,0.2)' 
        : '0 0 0 3px rgba(108,99,255,0.2)',
    };

    return (
      <div style={{ width: '100%' }}>
        <input
          ref={ref}
          style={inputStyle}
          onFocus={(e) => {
            Object.assign(e.target.style, focusStyle);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#E74C3C' : '#E0E0E0';
            e.target.style.boxShadow = 'inset 0 2px 6px rgba(0,0,0,0.15)';
            props.onBlur?.(e);
          }}
          className={className}
          {...props}
        />
        {error && (
          <p style={{ marginTop: '4px', fontSize: '14px', color: '#E74C3C' }}>{error}</p>
        )}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
