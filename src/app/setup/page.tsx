'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe, Phone, Settings, Check, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { ClayCard } from '@/components/ui/clay/ClayCard';
import { ClayButton } from '@/components/ui/clay/ClayButton';
import { ClayInput } from '@/components/ui/clay/ClayInput';
import { ClayBadge } from '@/components/ui/clay/ClayBadge';

const businessCategories = [
  { value: 'retail', label: 'Retail Shop', icon: '🏪' },
  { value: 'wholesale', label: 'Wholesale', icon: '📦' },
  { value: 'pharmacy', label: 'Pharmacy', icon: '💊' },
  { value: 'electronics', label: 'Electronics', icon: '📱' },
  { value: 'supermarket', label: 'Supermarket', icon: '🛒' },
  { value: 'restaurant', label: 'Restaurant & Café', icon: '🍽️' },
  { value: 'clothing', label: 'Clothing & Textile', icon: '👕' },
  { value: 'autoparts', label: 'Auto Parts', icon: '🚗' },
  { value: 'construction', label: 'Construction Materials', icon: '🏗️' },
  { value: 'services', label: 'Services', icon: '✂️' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'Arabic', flag: '🇮🇶' },
  { code: 'ku', label: 'Kurdish (Sorani)', flag: '🏳️' },
];

const currencies = [
  { code: 'IQD', label: 'Iraqi Dinar (ع.د)', default: true },
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
];

const features = [
  { key: 'pos', label: 'POS Terminal', description: 'Point of Sale terminal' },
  { key: 'inventory', label: 'Inventory Management', description: 'Product and stock management' },
  { key: 'vault', label: 'Money Vault', description: 'Cash and transaction tracking' },
  { key: 'employees', label: 'Employee Management', description: 'Staff and payroll' },
  { key: 'expenses', label: 'Expense Tracking', description: 'Business expenses' },
  { key: 'reports', label: 'PDF Reports & Invoices', description: 'Generate reports' },
  { key: 'barcode', label: 'Barcode Scanning', description: 'Product barcodes' },
  { key: 'multiCurrency', label: 'Multi-Currency', description: 'Multiple currencies' },
  { key: 'wholesale', label: 'Wholesale / Retail Tiers', description: 'Different pricing' },
  { key: 'printer', label: 'Thermal Printer', description: 'Receipt printing' },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    step1: {
      businessName: '',
      category: '',
      customCategory: '',
    },
    step2: {
      language: 'en',
      primaryCurrency: 'IQD',
      secondaryCurrencies: [] as string[],
    },
    step3: {
      phone: '',
      address: '',
      caption: '',
      website: '',
    },
    step4: {
      features: features.map(f => f.key),
    },
  });

  const steps = [
    { num: 1, title: 'Business Identity', icon: Building2 },
    { num: 2, title: 'Language & Locale', icon: Globe },
    { num: 3, title: 'Business Details', icon: Phone },
    { num: 4, title: 'Features', icon: Settings },
  ];

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.step1.businessName.length >= 2 && formData.step1.category;
      case 2:
        return formData.step2.language && formData.step2.primaryCurrency;
      case 3:
        return formData.step3.phone.length >= 10;
      case 4:
        return formData.step4.features.length > 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard/overview');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleFeature = (key: string) => {
    const features = formData.step4.features;
    if (features.includes(key)) {
      setFormData({
        ...formData,
        step4: { features: features.filter(f => f !== key) },
      });
    } else {
      setFormData({
        ...formData,
        step4: { features: [...features, key] },
      });
    }
  };

  const toggleSecondaryCurrency = (code: string) => {
    const current = formData.step2.secondaryCurrencies;
    if (current.includes(code)) {
      setFormData({
        ...formData,
        step2: { ...formData.step2, secondaryCurrencies: current.filter(c => c !== code) },
      });
    } else {
      setFormData({
        ...formData,
        step2: { ...formData.step2, secondaryCurrencies: [...current, code] },
      });
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Business Identity</h2>
              <p className="text-[#2F2F33]/60 text-sm">Tell us about your business</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Business Name</label>
              <ClayInput
                placeholder="Enter your business name"
                value={formData.step1.businessName}
                onChange={(e) => setFormData({ ...formData, step1: { ...formData.step1, businessName: e.target.value } })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Business Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {businessCategories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setFormData({ ...formData, step1: { ...formData.step1, category: cat.value } })}
                    className={`p-3 rounded-[14px] text-center transition-all ${
                      formData.step1.category === cat.value
                        ? 'bg-[#6C63FF] text-white shadow-lg'
                        : 'bg-[#F5F6F7] hover:bg-[#E0E0E0]'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
              {formData.step1.category === 'other' && (
                <div className="mt-3">
                  <ClayInput
                    placeholder="Enter custom category"
                    value={formData.step1.customCategory}
                    onChange={(e) => setFormData({ ...formData, step1: { ...formData.step1, customCategory: e.target.value } })}
                  />
                </div>
              )}
            </div>

            {formData.step1.businessName && formData.step1.category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-[16px] bg-[#F5F6F7] mt-4"
              >
                <p className="text-sm text-[#2F2F33]/60 mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#6C63FF] flex items-center justify-center text-white font-bold text-lg">
                    {formData.step1.businessName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{formData.step1.businessName}</p>
                    <p className="text-sm text-[#2F2F33]/60">
                      {businessCategories.find(c => c.value === formData.step1.category)?.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Language & Locale</h2>
              <p className="text-[#2F2F33]/60 text-sm">Set your preferred language and currency</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Primary Language</label>
              <div className="flex gap-3">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setFormData({ ...formData, step2: { ...formData.step2, language: lang.code } })}
                    className={`flex-1 p-4 rounded-[16px] text-center transition-all ${
                      formData.step2.language === lang.code
                        ? 'bg-[#6C63FF] text-white shadow-lg'
                        : 'bg-[#F5F6F7] hover:bg-[#E0E0E0]'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Primary Currency</label>
              <div className="flex gap-2">
                {currencies.map(currency => (
                  <button
                    key={currency.code}
                    onClick={() => setFormData({ ...formData, step2: { ...formData.step2, primaryCurrency: currency.code } })}
                    className={`flex-1 p-3 rounded-[14px] text-sm font-medium transition-all ${
                      formData.step2.primaryCurrency === currency.code
                        ? 'bg-[#6C63FF] text-white'
                        : 'bg-[#F5F6F7]'
                    }`}
                  >
                    {currency.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Secondary Currencies (Optional)</label>
              <div className="flex gap-2 flex-wrap">
                {currencies.filter(c => c.code !== formData.step2.primaryCurrency).map(currency => (
                  <button
                    key={currency.code}
                    onClick={() => toggleSecondaryCurrency(currency.code)}
                    className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${
                      formData.step2.secondaryCurrencies.includes(currency.code)
                        ? 'bg-[#6C63FF] text-white'
                        : 'bg-[#F5F6F7]'
                    }`}
                  >
                    {currency.code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Timezone</label>
              <select className="w-full px-4 py-2.5 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm">
                <option value="Asia/Baghdad">Asia/Baghdad (GMT+3)</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Business Details</h2>
              <p className="text-[#2F2F33]/60 text-sm">Add your contact information and branding</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F2F33]/40 font-medium">+964</span>
                <ClayInput
                  placeholder="7501234567"
                  className="pl-16"
                  value={formData.step3.phone.replace('+964', '')}
                  onChange={(e) => setFormData({ ...formData, step3: { ...formData.step3, phone: '+964' + e.target.value } })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Business Address</label>
              <textarea
                className="w-full px-4 py-3 bg-[#F5F6F7] rounded-[16px] border border-transparent focus:border-[#6C63FF] outline-none text-sm"
                rows={2}
                placeholder="Enter your business address"
                value={formData.step3.address}
                onChange={(e) => setFormData({ ...formData, step3: { ...formData.step3, address: e.target.value } })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Business Caption (Optional)</label>
              <ClayInput
                placeholder="A short tagline for your business"
                maxLength={100}
                value={formData.step3.caption}
                onChange={(e) => setFormData({ ...formData, step3: { ...formData.step3, caption: e.target.value } })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Website (Optional)</label>
              <ClayInput
                placeholder="https://yourbusiness.com"
                value={formData.step3.website}
                onChange={(e) => setFormData({ ...formData, step3: { ...formData.step3, website: e.target.value } })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Business Logo (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-[16px] bg-[#F5F6F7] flex items-center justify-center border-2 border-dashed border-[#E0E0E0]">
                  <Upload className="w-6 h-6 text-[#2F2F33]/40" />
                </div>
                <div>
                  <ClayButton variant="ghost" size="sm">Upload Logo</ClayButton>
                  <p className="text-xs text-[#2F2F33]/60 mt-1">PNG, JPG. Max 10MB.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Feature Selection</h2>
              <p className="text-[#2F2F33]/60 text-sm">Choose the modules you need</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map(feature => (
                <button
                  key={feature.key}
                  onClick={() => toggleFeature(feature.key)}
                  className={`p-4 rounded-[16px] text-left transition-all ${
                    formData.step4.features.includes(feature.key)
                      ? 'bg-[#6C63FF] text-white shadow-lg'
                      : 'bg-[#F5F6F7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{feature.label}</p>
                      <p className={`text-sm ${formData.step4.features.includes(feature.key) ? 'text-white/70' : 'text-[#2F2F33]/60'}`}>
                        {feature.description}
                      </p>
                    </div>
                    {formData.step4.features.includes(feature.key) && (
                      <Check className="w-5 h-5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s.num
                      ? 'bg-[#6C63FF] text-white'
                      : 'bg-[#E0E0E0] text-[#2F2F33]/60'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-2 ${
                      step > s.num ? 'bg-[#6C63FF]' : 'bg-[#E0E0E0]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#2F2F33]/60">
            Step {step} of 4: {steps.find(s => s.num === step)?.title}
          </p>
        </div>

        <ClayCard className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-[#E0E0E0]">
            <ClayButton
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </ClayButton>
            <ClayButton
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? 'Saving...' : step === 4 ? 'Complete Setup' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </ClayButton>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
