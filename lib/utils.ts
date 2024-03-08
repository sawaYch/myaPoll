import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultBaseInterval = 500;

export const isNumeric = (value: string) => {
  return !isNaN(parseFloat(value)) && isFinite(value as any);
};
