'use client';

import { useState } from 'react';
import { Building, Globe, Palette, Printer, ChevronRight } from 'lucide-react';
import { showToast } from '@/store/toastStore';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [business, setBusiness] = useState({ name: 'CashCo-KRD', category: 'Retail Shop', phone: '+9647501234567', address: 'Erbil, Kurdistan Region', caption: 'Your trusted business partner' });
  const [language, setLanguage] = useState({ primary: 'en', currency: 'IQD', timezone: 'Asia/Baghdad' });
  const [features, setFeatures] = useState({ inventory: true, vault: true, employees: true, expenses: true, wholesale: true, barcode: true });
  const [print, setPrint] = useState({ template: 'default', footer: 'Thank you for your business!', showLogo: true, showTax: true });

  const save = (tab: string) => { showToast(`${tab} settings saved!`, 'success'); };

  const cardStyle: React.CSSProperties = { padding: '16px', backgroundColor: '#F5F6F7', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', backgroundColor: '#F5F6F7', borderRadius: '16px', border: '1px solid transparent', outline: 'none', fontSize: '14px' };
  const btn = (primary = false): React.CSSProperties => ({ padding: '10px 20px', borderRadius: '14px', border: 'none', backgroundColor: primary ? '#6C63FF' : '#F5F6F7', color: primary ? 'white' : '#2F2F33', fontSize: '14px', fontWeight: 500, cursor: 'pointer' });
  const tabBtn = (active: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '14px', border: 'none', backgroundColor: active ? '#6C63FF' : 'transparent', color: active ? 'white' : '#2F2F33', fontSize: '14px', fontWeight: 500, cursor: 'pointer', width: '100%', textAlign: 'left' });
  const toggle = (key: string, val: boolean) => setFeatures({ ...features, [key]: val });

  const Field = ({ label, children }: any) => <div style={{ marginBottom: '12px' }}><label style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>{label}</label>{children}</div>;
  const Toggle = ({ label, desc, checked, onChange }: any) => (
    <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
      <div><p style={{ fontSize: '14px', fontWeight: 500 }}>{label}</p><p style={{ fontSize: '12px', color: 'rgba(47,47,51,0.6)' }}>{desc}</p></div>
      <button onClick={onChange} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', backgroundColor: checked ? '#27AE60' : '#E0E0E0', cursor: 'pointer', position: 'relative' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', left: checked ? '22px' : '2px', transition: 'all 0.2s' }} />
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}><h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F2F33', marginBottom: '4px' }}>Settings</h1><p style={{ color: 'rgba(47,47,51,0.6)' }}>Manage your business preferences</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px' }}>
        <div style={cardStyle}>
          {[{ id: 'business', icon: Building, label: 'Business Profile' }, { id: 'language', icon: Globe, label: 'Language & Locale' }, { id: 'features', icon: Palette, label: 'Features' }, { id: 'printing', icon: Printer, label: 'Printing' }].map(tab => {
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabBtn(activeTab === tab.id)}><Icon size={20} />{tab.label}<ChevronRight size={16} style={{ marginLeft: 'auto' }} /></button>;
          })}
        </div>
        <div style={cardStyle}>
          {activeTab === 'business' && (<>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Business Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
              <Field label="Business Name"><input style={inputStyle} value={business.name} onChange={e => setBusiness({ ...business, name: e.target.value })} /></Field>
              <Field label="Category"><select style={inputStyle} value={business.category} onChange={e => setBusiness({ ...business, category: e.target.value })}><option>Retail Shop</option><option>Wholesale</option><option>Supermarket</option><option>Restaurant</option></select></Field>
              <Field label="Phone"><input style={inputStyle} value={business.phone} onChange={e => setBusiness({ ...business, phone: e.target.value })} /></Field>
              <Field label="Address"><input style={inputStyle} value={business.address} onChange={e => setBusiness({ ...business, address: e.target.value })} /></Field>
              <Field label="Caption"><input style={inputStyle} value={business.caption} onChange={e => setBusiness({ ...business, caption: e.target.value })} /></Field>
              <button style={btn(true)} onClick={() => save('Business')}>Save Changes</button>
            </div>
          </>)}
          {activeTab === 'language' && (<>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Language & Locale</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
              <Field label="Primary Language"><select style={inputStyle} value={language.primary} onChange={e => setLanguage({ ...language, primary: e.target.value })}><option value="en">English</option><option value="ar">Arabic</option><option value="ku">Kurdish</option></select></Field>
              <Field label="Base Currency"><select style={inputStyle} value={language.currency} onChange={e => setLanguage({ ...language, currency: e.target.value })}><option value="IQD">IQD - Iraqi Dinar</option><option value="USD">USD - US Dollar</option><option value="EUR">EUR - Euro</option></select></Field>
              <Field label="Timezone"><select style={inputStyle} value={language.timezone} onChange={e => setLanguage({ ...language, timezone: e.target.value })}><option value="Asia/Baghdad">Asia/Baghdad (GMT+3)</option><option value="Asia/Dubai">Asia/Dubai (GMT+4)</option></select></Field>
              <button style={btn(true)} onClick={() => save('Language')}>Save Changes</button>
            </div>
          </>)}
          {activeTab === 'features' && (<>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Features</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Toggle label="Inventory Management" desc="Track stock levels" checked={features.inventory} onChange={() => toggle('inventory', !features.inventory)} />
              <Toggle label="Money Vault" desc="Manage cash and transactions" checked={features.vault} onChange={() => toggle('vault', !features.vault)} />
              <Toggle label="Employee Management" desc="Staff and advances" checked={features.employees} onChange={() => toggle('employees', !features.employees)} />
              <Toggle label="Expense Tracking" desc="Track business expenses" checked={features.expenses} onChange={() => toggle('expenses', !features.expenses)} />
              <Toggle label="Wholesale Pricing" desc="Bulk discount pricing" checked={features.wholesale} onChange={() => toggle('wholesale', !features.wholesale)} />
              <Toggle label="Barcode Scanning" desc="Scan products in POS" checked={features.barcode} onChange={() => toggle('barcode', !features.barcode)} />
            </div>
          </>)}
          {activeTab === 'printing' && (<>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Printing & Receipts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
              <Field label="Receipt Template"><select style={inputStyle} value={print.template} onChange={e => setPrint({ ...print, template: e.target.value })}><option value="default">Default</option><option value="minimal">Minimal</option><option value="detailed">Detailed</option></select></Field>
              <Field label="Footer Message"><input style={inputStyle} value={print.footer} onChange={e => setPrint({ ...print, footer: e.target.value })} /></Field>
              <Toggle label="Show Logo on Receipt" desc="" checked={print.showLogo} onChange={() => setPrint({ ...print, showLogo: !print.showLogo })} />
              <Toggle label="Show Tax Details" desc="" checked={print.showTax} onChange={() => setPrint({ ...print, showTax: !print.showTax })} />
              <button style={btn(true)} onClick={() => save('Print')}>Save Changes</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
