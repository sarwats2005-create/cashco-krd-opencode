'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/currency';

interface ClayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ClayModal({ isOpen, onClose, title, children, className }: ClayModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              'relative bg-[#F5F6F7] rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.15)]',
              'max-h-[90vh] overflow-auto',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
                <h2 className="text-xl font-semibold text-[#2F2F33]">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#E0E0E0] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}