export const currencies = [
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', decimals: 0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', decimals: 2 },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', decimals: 0 },
];

export const defaultCurrency = 'IQD';

export const exchangeRates: Record<string, number> = {
  IQD: 1,
  USD: 1310,
  EUR: 1420,
  TRY: 38,
  IRR: 0.031,
};
