'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Globe, Palette, Printer, Users, Link2, Shield, ChevronRight, Upload, Check } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';
import { ClayInput } from '@/components/ui/clay/ClayInput';

const tabs = [
  { id: 'business', label: 'Business Profile', icon: Building },
  { id: 'language', label: 'Language & Locale', icon: Globe },
  { id: 'features', label: 'Features', icon: Palette },
  { id: 'printing', label: 'Printing & Receipts', icon: Printer },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'security', label: 'Data & Security', icon: Shield },
];

const businessCategories = [
  'Retail Shop', 'Wholesale', 'Pharmacy', 'Electronics', 'Supermarket',
  'Restaurant & Café', 'Clothing & Textile', 'Auto Parts', 'Construction Materials', 'Services', 'Other'
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [businessInfo, setBusinessInfo] = useState({
    name: 'CashCo-KRD',
    category: 'Retail Shop',
    phone: '+9647501234567',
    address: 'Erbil, Kurdistan Region, Iraq',
    caption: 'Your trusted business partner',
    website: '',
  });

  const [languageSettings, setLanguageSettings] = useState({
    primary: 'en',
    secondary: ['USD', 'EUR'],
    timezone: 'Asia/Baghdad',
    dateFormat: 'DD/MM/YYYY',
  });

  const [featureToggles, setFeatureToggles] = useState({
    pos: true,
    inventory: true,
    vault: true,
    employees: true,
    expenses: true,
    reports: true,
    barcode: true,
    multiCurrency: true,
    wholesale: true,
    printer: true,
  });

  const [printSettings, setPrintSettings] = useState({
    printerType: 'thermal80',
    template: 'default',
    footerMessage: 'Thank you for your business!',
    showLogo: true,
    showTax: true,
    showDiscount: true,
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Business Name</label>
                  <ClayInput
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Business Category</label>
                  <select
                    value={businessInfo.category}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
                  >
                    {businessCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F2F33]/40">+964</span>
                    <ClayInput
                      className="pl-14"
                      value={businessInfo.phone.replace('+964', '')}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, phone: '+964' + e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Website</label>
                  <ClayInput
                    placeholder="https://yourbusiness.com"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <textarea
                    className="w-full px-4 py-3 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
                    rows={2}
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Business Caption</label>
                  <ClayInput
                    placeholder="A short tagline for your business"
                    value={businessInfo.caption}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, caption: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Business Logo</h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-[20px] bg-[#6C63FF] flex items-center justify-center text-white font-bold text-3xl">
                  C
                </div>
                <div>
                  <ClayButton variant="ghost">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </ClayButton>
                  <p className="text-xs text-[#2F2F33]/60 mt-1">PNG, JPG or PDF. Max 10MB. 512x512px recommended.</p>
                </div>
              </div>
            </div>

            <ClayButton variant="primary">Save Changes</ClayButton>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Language & Localization</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Primary Language</label>
                  <div className="flex gap-3">
                    {[
                      { code: 'en', label: 'English', flag: '🇬🇧' },
                      { code: 'ar', label: 'Arabic', flag: '🇮🇶' },
                      { code: 'ku', label: 'Kurdish (Sorani)', flag: '🏳️' },
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguageSettings({ ...languageSettings, primary: lang.code })}
                        className={`flex-1 p-4 rounded-[16px] text-center transition-colors ${
                          languageSettings.primary === lang.code
                            ? 'bg-[#6C63FF] text-white'
                            : 'bg-[#F5F6F7] text-[#2F2F33]'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Secondary Currencies</label>
                  <div className="flex gap-2 flex-wrap">
                    {['USD', 'EUR', 'TRY', 'IRR'].map(currency => (
                      <button
                        key={currency}
                        onClick={() => {
                          const current = languageSettings.secondary;
                          const newSecondary = current.includes(currency)
                            ? current.filter(c => c !== currency)
                            : [...current, currency];
                          setLanguageSettings({ ...languageSettings, secondary: newSecondary });
                        }}
                        className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                          languageSettings.secondary.includes(currency)
                            ? 'bg-[#6C63FF] text-white'
                            : 'bg-[#F5F6F7] text-[#2F2F33]'
                        }`}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Timezone</label>
                  <select
                    value={languageSettings.timezone}
                    onChange={(e) => setLanguageSettings({ ...languageSettings, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
                  >
                    <option value="Asia/Baghdad">Asia/Baghdad (GMT+3)</option>
                    <option value="Asia/Istanbul">Asia/Istanbul (GMT+3)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Date Format</label>
                  <select
                    value={languageSettings.dateFormat}
                    onChange={(e) => setLanguageSettings({ ...languageSettings, dateFormat: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <ClayButton variant="primary">Save Changes</ClayButton>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Feature Toggles</h2>
              <p className="text-sm text-[#2F2F33]/60 mb-4">Enable or disable modules for your organization.</p>
              <div className="space-y-3">
                {[
                  { key: 'pos', label: 'POS Terminal', description: 'Point of Sale terminal for transactions' },
                  { key: 'inventory', label: 'Inventory Management', description: 'Product and stock management' },
                  { key: 'vault', label: 'Money Vault', description: 'Cash and transaction tracking' },
                  { key: 'employees', label: 'Employee Management', description: 'Staff and payroll management' },
                  { key: 'expenses', label: 'Expense Tracking', description: 'Business expense logging' },
                  { key: 'reports', label: 'PDF Reports & Invoices', description: 'Generate reports and invoices' },
                  { key: 'barcode', label: 'Barcode Generation & Scanning', description: 'Product barcode support' },
                  { key: 'multiCurrency', label: 'Multi-Currency Payments', description: 'Support multiple currencies' },
                  { key: 'wholesale', label: 'Wholesale / Retail Price Tiers', description: 'Different pricing levels' },
                  { key: 'printer', label: 'Thermal Printer Support', description: 'Receipt printing' },
                ].map(feature => (
                  <div key={feature.key} className="flex items-center justify-between p-4 rounded-[16px] bg-[#F5F6F7]">
                    <div>
                      <p className="font-medium">{feature.label}</p>
                      <p className="text-sm text-[#2F2F33]/60">{feature.description}</p>
                    </div>
                    <button
                      onClick={() => setFeatureToggles({ ...featureToggles, [feature.key]: !featureToggles[feature.key as keyof typeof featureToggles] })}
                      className={`w-12 h-6 rounded-full transition-colors ${featureToggles[feature.key as keyof typeof featureToggles] ? 'bg-[#6C63FF]' : 'bg-[#E0E0E0]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${featureToggles[feature.key as keyof typeof featureToggles] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <ClayButton variant="primary">Save Changes</ClayButton>
          </div>
        );

      case 'printing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Printing Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Printer Type</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'thermal80', label: 'Thermal 80mm' },
                      { value: 'thermal58', label: 'Thermal 58mm' },
                      { value: 'a4', label: 'A4' },
                      { value: 'none', label: 'No Printer' },
                    ].map(printer => (
                      <button
                        key={printer.value}
                        onClick={() => setPrintSettings({ ...printSettings, printerType: printer.value })}
                        className={`flex-1 p-3 rounded-[14px] text-sm font-medium transition-colors ${
                          printSettings.printerType === printer.value
                            ? 'bg-[#6C63FF] text-white'
                            : 'bg-[#F5F6F7] text-[#2F2F33]'
                        }`}
                      >
                        {printer.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Receipt Template</label>
                  <select
                    value={printSettings.template}
                    onChange={(e) => setPrintSettings({ ...printSettings, template: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
                  >
                    <option value="default">Default Template</option>
                    <option value="minimal">Minimal</option>
                    <option value="detailed">Detailed</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Footer Message</label>
                  <textarea
                    className="w-full px-4 py-3 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
                    rows={2}
                    value={printSettings.footerMessage}
                    onChange={(e) => setPrintSettings({ ...printSettings, footerMessage: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'showLogo', label: 'Show Logo on Receipt' },
                    { key: 'showTax', label: 'Show Tax Breakdown' },
                    { key: 'showDiscount', label: 'Show Discount Details' },
                  ].map(toggle => (
                    <div key={toggle.key} className="flex items-center justify-between">
                      <span className="text-sm">{toggle.label}</span>
                      <button
                        onClick={() => setPrintSettings({ ...printSettings, [toggle.key]: !printSettings[toggle.key as keyof typeof printSettings] })}
                        className={`w-10 h-5 rounded-full transition-colors ${printSettings[toggle.key as keyof typeof printSettings] ? 'bg-[#6C63FF]' : 'bg-[#E0E0E0]'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${printSettings[toggle.key as keyof typeof printSettings] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ClayButton variant="primary">Save Changes</ClayButton>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">User Management</h2>
              <ClayButton variant="primary" size="sm">
                Add User
              </ClayButton>
            </div>
            <ClayCard className="p-4">
              <p className="text-[#2F2F33]/60 text-center py-8">
                User management coming soon. Contact the organization owner to manage users.
              </p>
            </ClayCard>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Integrations</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-[16px] bg-[#F5F6F7]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Exchange Rate API</p>
                      <p className="text-sm text-[#2F2F33]/60">Fetch daily exchange rates</p>
                    </div>
                    <ClayButton variant="ghost" size="sm">Configure</ClayButton>
                  </div>
                </div>
                <div className="p-4 rounded-[16px] bg-[#F5F6F7]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Webhooks</p>
                      <p className="text-sm text-[#2F2F33]/60">External system notifications</p>
                    </div>
                    <ClayButton variant="ghost" size="sm">Configure</ClayButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Data & Security</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-[16px] bg-[#F5F6F7]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export All Data</p>
                      <p className="text-sm text-[#2F2F33]/60">Download all your data as CSV</p>
                    </div>
                    <ClayButton variant="ghost" size="sm">Export</ClayButton>
                  </div>
                </div>
                <div className="p-4 rounded-[16px] bg-[#F5F6F7]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-[#2F2F33]/60">Manage your active login sessions</p>
                    </div>
                    <ClayButton variant="ghost" size="sm">View</ClayButton>
                  </div>
                </div>
                <div className="p-4 rounded-[16px] bg-[#E74C3C]/10 border border-[#E74C3C]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#E74C3C]">Delete Account</p>
                      <p className="text-sm text-[#2F2F33]/60">Permanently delete your account and data</p>
                    </div>
                    <ClayButton variant="danger" size="sm">Delete</ClayButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2F2F33]">Settings</h1>
        <p className="text-[#2F2F33]/60">Manage your business configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <ClayCard className="lg:w-[280px] p-2 h-fit">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-[#6C63FF] text-white'
                    : 'text-[#2F2F33] hover:bg-[#F5F6F7]'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </nav>
        </ClayCard>

        {/* Tab Content */}
        <ClayCard className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderTabContent()}
          </motion.div>
        </ClayCard>
      </div>
    </div>
  );
}
