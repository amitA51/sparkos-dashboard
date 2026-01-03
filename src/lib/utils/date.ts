import { format, isToday, isTomorrow, isYesterday, isPast, differenceInDays } from 'date-fns';
import { he } from 'date-fns/locale';
import type { TimeOfDay } from '../types';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getHebrewGreeting(): string {
  const timeOfDay = getTimeOfDay();
  const greetings: Record<TimeOfDay, string> = {
    morning: 'בוקר טוב',
    afternoon: 'צהריים טובים',
    evening: 'ערב טוב',
    night: 'לילה טוב'
  };
  return greetings[timeOfDay];
}

export function formatHebrewDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'EEEE, d בMMMM', { locale: he });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (isToday(date)) return 'היום';
  if (isTomorrow(date)) return 'מחר';
  if (isYesterday(date)) return 'אתמול';

  const days = differenceInDays(date, new Date());

  if (days > 0 && days <= 7) {
    return format(date, 'EEEE', { locale: he });
  }

  return format(date, 'd/M', { locale: he });
}

export function isOverdue(dateStr: string): boolean {
  return isPast(new Date(dateStr)) && !isToday(new Date(dateStr));
}

export function getDaysUntil(dateStr: string): number {
  return differenceInDays(new Date(dateStr), new Date());
}
