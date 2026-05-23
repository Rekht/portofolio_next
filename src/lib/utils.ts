import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MONTHS: Record<string, number> = {
  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'mei': 4, 'jun': 5,
  'jul': 6, 'aug': 7, 'agt': 7, 'sep': 8, 'oct': 9, 'okt': 9, 'nov': 10, 'dec': 11, 'des': 11
};

export function parseDateFromPeriod(period: string): Date {
  if (!period) return new Date(0);
  const parts = period.split('-').map(s => s.trim());
  const dateStr = parts[0]; 
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'sekarang') return new Date();
  
  const tokens = dateStr.toLowerCase().split(/\s+/);
  let year = 0; let month = 0;
  for (const token of tokens) {
    if (!isNaN(parseInt(token)) && token.length === 4) year = parseInt(token);
    else {
      for (const [key, val] of Object.entries(MONTHS)) {
        if (token.startsWith(key)) { month = val; break; }
      }
    }
  }
  if (year > 0) return new Date(year, month, 1);
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
}
