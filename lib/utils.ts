import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultBaseInterval = 200;

export const isNumeric = (value: string) => {
  return !isNaN(parseFloat(value)) && isFinite(value as any);
};
