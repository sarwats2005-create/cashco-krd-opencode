import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = 'IQD'): string {
  const formatter = new Intl.NumberFormat('en-IQ', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'IQD' ? 0 : 2,
    maximumFractionDigits: currency === 'IQD' ? 0 : 2,
  });
  return formatter.format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IQ').format(num);
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'date' = 'short'): string {
  const d = new Date(date);
  if (format === 'date') {
    return d.toLocaleDateString('en-IQ');
  }
  if (format === 'long') {
    return d.toLocaleString('en-IQ');
  }
  return d.toLocaleDateString('en-IQ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function generateEmployeeId(year: number, sequence: number): string {
  return `EMP-${year}-${sequence.toString().padStart(4, '0')}`;
}

export function convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>): number {
  if (from === to) return amount;
  const inBase = amount * rates[from];
  return inBase / rates[to];
}
