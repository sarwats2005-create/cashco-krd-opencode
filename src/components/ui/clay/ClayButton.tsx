'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/currency';

interface ClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[#F5F6F7] text-[#2F2F33]',
      primary: 'bg-[#6C63FF] text-white',
      success: 'bg-[#27AE60] text-white',
      danger: 'bg-[#E74C3C] text-white',
      ghost: 'bg-transparent text-[#2F2F33]',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-[10px]',
      md: 'px-5 py-2.5 text-base rounded-[14px]',
      lg: 'px-7 py-3.5 text-lg rounded-[16px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'font-medium transition-all duration-200',
          'shadow-[0_8px_30px_rgba(0,0,0,0.06),0_2px_4px_rgba(255,255,255,0.8)_inset]',
          'hover:scale-[1.02] hover:brightness-[1.03] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]',
          'active:scale-[0.98] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]',
          'disabled:opacity-45 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ClayButton.displayName = 'ClayButton';
