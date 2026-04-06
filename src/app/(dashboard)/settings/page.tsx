'use client';

import { useState } from 'react';
import { Building, Globe, Palette, Printer, Users, Link2, Shield, ChevronRight, Check } from 'lucide-react';

const tabs = [
  { id: 'business', label: 'Business Profile', icon: Building },
  { id: 'language', label: 'Language & Locale', icon: Globe },
  { id: 'features', label: 'Features', icon: Palette },
  { id: 'printing', label: 'Printing & Receipts', icon: Printer },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [businessInfo, setBusinessInfo] = useState({
    name: 'CashCo-KRD',
    category: 'Retail Shop',
    phone: '+9647501234567',
    address: 'Erbil, Kurdistan Region, Iraq',
    caption: 'Your trusted business partner',
  });

  const [languageSettings, setLanguageSettings] = useState({
    primary: 'en',
    currency: 'IQD',
    timezone: 'Asia/Baghdad',
  });

  const [featureToggles, setFeatureToggles] = useState({
    inventory: true,
    vault: true,
    employees: true,
    expenses: true,
    wholesale: true,
    barcode: true,
  });

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#F5F6F7',
    borderRadius: '24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#F5F6F7',
    borderRadius: '16px',
    border: '1px solid transparent',
    outline: 'none',
    fontSize: '14px',
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: isActive ? '#6C63FF' : 'transparent',
    color: isActive ? 'white' : '#2F2F33',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  });

  const toggleStyle = (isOn: boolean): React.CSSProperties => ({
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: isOn ? '#27AE60' : '#E0E0E0',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s',
  });

  const buttonStyle = (primary = false): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: primary ? '#6C63FF' : '#F5F6F7',
    color: primary ? 'white' : '#2F2F33',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'business':
        return (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Business Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Business Name</label>
                <input style={inputStyle} value={businessInfo.name} onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Category</label>
                <select style={inputStyle} value={businessInfo.category} onChange={(e) => setBusinessInfo({ ...businessInfo, category: e.target.value })}>
                  <option value="Retail Shop">Retail Shop</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Restaurant">Restaurant & Café</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Phone</label>
                <input style={inputStyle} value={businessInfo.phone} onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Address</label>
                <input style={inputStyle} value={businessInfo.address} onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Caption</label>
                <input style={inputStyle} value={businessInfo.caption} onChange={(e) => setBusinessInfo({ ...businessInfo, caption: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button style={buttonStyle(true)}>Save Changes</button>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Language & Locale</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Primary Language</label>
                <select style={inputStyle} value={languageSettings.primary} onChange={(e) => setLanguageSettings({ ...languageSettings, primary: e.target.value })}>
                  <option value="en">English</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="ku">Kurdish (کوردی)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Base Currency</label>
                <select style={inputStyle} value={languageSettings.currency} onChange={(e) => setLanguageSettings({ ...languageSettings, currency: e.target.value })}>
                  <option value="IQD">IQD - Iraqi Dinar</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="TRY">TRY - Turkish Lira</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Timezone</label>
                <select style={inputStyle} value={languageSettings.timezone} onChange={(e) => setLanguageSettings({ ...languageSettings, timezone: e.target.value })}>
                  <option value="Asia/Baghdad">Asia/Baghdad (GMT+3)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                </select>
              </div>
              <button style={buttonStyle(true)}>Save Changes</button>
            </div>
          </div>
        );

      case 'features':
        return (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Features</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { key: 'inventory', label: 'Inventory Management', desc: 'Track stock levels and products' },
                { key: 'vault', label: 'Money Vault', desc: 'Manage cash and transactions' },
                { key: 'employees', label: 'Employee Management', desc: 'Staff, advances, and attendance' },
                { key: 'expenses', label: 'Expense Tracking', desc: 'Track business expenses' },
                { key: 'wholesale', label: 'Wholesale Pricing', desc: 'Bulk discount pricing' },
                { key: 'barcode', label: 'Barcode Scanning', desc: 'Scan products in POS' },
              ].map(feature => (
                <div key={feature.key} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{feature.label}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{feature.desc}</p>
                  </div>
                  <button
                    onClick={() => setFeatureToggles({ ...featureToggles, [feature.key]: !featureToggles[feature.key as keyof typeof featureToggles] })}
                    style={toggleStyle(featureToggles[feature.key as keyof typeof featureToggles])}
                  >
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', left: featureToggles[feature.key as keyof typeof featureToggles] ? '22px' : '2px', transition: 'all 0.2s' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'printing':
        return (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Printing & Receipts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Receipt Template</label>
                <select style={inputStyle}>
                  <option value="default">Default</option>
                  <option value="minimal">Minimal</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Footer Message</label>
                <input style={inputStyle} placeholder="Thank you for your business!" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F5F6F7', borderRadius: '14px' }}>
                <span style={{ fontSize: '14px' }}>Show Logo on Receipt</span>
                <button style={toggleStyle(true)}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', left: '22px' }} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F5F6F7', borderRadius: '14px' }}>
                <span style={{ fontSize: '14px' }}>Show Tax Details</span>
                <button style={toggleStyle(true)}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', left: '22px' }} />
                </button>
              </div>
              <button style={buttonStyle(true)}>Save Changes</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Settings</h1>
        <p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your business preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabButtonStyle(activeTab === tab.id)}>
                  <Icon size={20} />
                  {tab.label}
                  <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
