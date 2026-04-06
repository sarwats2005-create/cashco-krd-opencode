'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/currency';

interface ClayInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ClayInput = forwardRef<HTMLInputElement, ClayInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-[#F5F6F7] rounded-[16px]',
            'shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]',
            'border border-[#E0E0E0] outline-none',
            'transition-all duration-200',
            'focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)]',
            error && 'border-[#E74C3C] focus:border-[#E74C3C] focus:shadow-[0_0_0_3px_rgba(231,76,60,0.2)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#E74C3C]">{error}</p>
        )}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
