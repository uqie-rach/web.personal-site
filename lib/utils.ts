import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractStrings(input: string): string[] {
  const matches = input.match(/"([^"]+)"/g);

  if (!matches) return [];

  return matches.map(str => str.replace(/^"|"$/g, ''));
}

