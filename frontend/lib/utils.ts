import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind classes cleanly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to short day & month object (e.g. { day: '15', month: 'Okt' })
 */
export function formatDateShort(dateStr?: string | Date): { day: string; month: string } {
  if (!dateStr) return { day: '--', month: '---' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: '--', month: '---' };
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleDateString('id-ID', { month: 'short' });
    return { day, month };
  } catch {
    return { day: '--', month: '---' };
  }
}

/**
 * Format date to localized Indonesian long string (e.g. "15 Oktober 2026")
 */
export function formatDateLong(dateStr?: string | Date): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Generate a WhatsApp chat URL with optional pre-filled message
 */
export function getWhatsAppUrl(phone: string, text?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const base = `https://wa.me/${cleanPhone}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

/**
 * Calculate reading time in minutes for given text content
 */
export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
