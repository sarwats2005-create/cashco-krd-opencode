'use client';

import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/currency';

interface ClayBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'accent';
  size?: 'sm' | 'md';
}

export function ClayBadge({ className, variant = 'default', size = 'md', children, ...props }: ClayBadgeProps) {
  const variantStyles = {
    default: 'bg-[#F5F6F7] text-[#2F2F33]',
    success: 'bg-[#27AE60]/10 text-[#27AE60]',
    danger: 'bg-[#E74C3C]/10 text-[#E74C3C]',
    warning: 'bg-[#F39C12]/10 text-[#F39C12]',
    info: 'bg-[#3498DB]/10 text-[#3498DB]',
    accent: 'bg-[#6C63FF]/10 text-[#6C63FF]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[999px] font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
