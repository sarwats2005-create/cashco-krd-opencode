'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F6F7' }}>
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '240px',
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        <Sidebar onMobileClose={() => setSidebarOpen(false)} />
      </div>

      <div style={{
        marginLeft: '0px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{
          flex: 1,
          padding: '16px',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
