'use client';

import { useToastStore } from '@/store/toastStore';
import { X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const getStyle = (type: string) => {
    const base: React.CSSProperties = {
      padding: '12px 16px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '300px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      animation: 'slideIn 0.3s ease',
    };
    switch (type) {
      case 'success': return { ...base, backgroundColor: '#27AE60', color: 'white' };
      case 'error': return { ...base, backgroundColor: '#E74C3C', color: 'white' };
      case 'warning': return { ...base, backgroundColor: '#F39C12', color: 'white' };
      default: return { ...base, backgroundColor: '#6C63FF', color: 'white' };
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      {toasts.map((toast) => (
        <div key={toast.id} style={getStyle(toast.type)}>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
