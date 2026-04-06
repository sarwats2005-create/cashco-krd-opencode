'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/currency';

interface ClayCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'pressed';
}

export const ClayCard = forwardRef<HTMLDivElement, ClayCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'shadow-[0_8px_30px_rgba(0,0,0,0.06),0_2px_4px_rgba(255,255,255,0.8)_inset]',
      elevated: 'shadow-[0_12px_40px_rgba(0,0,0,0.1)]',
      pressed: 'shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-[#F5F6F7] rounded-[24px]',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ClayCard.displayName = 'ClayCard';
