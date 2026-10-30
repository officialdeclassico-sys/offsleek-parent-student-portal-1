import { useEffect, useState } from 'react';

export const IST_TIMEZONE = 'Asia/Kolkata';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export interface ISTDateParts {
  year: number;
  monthIndex: number; // 0-11
  day: number; // 1-31
  hours: number; // 0-23
  minutes: number; // 0-59
  seconds: number; // 0-59
  weekdayShort: string; // 'Mon', 'Tue', etc.
  weekdayLong: string; // 'Monday', 'Tuesday', etc.
  monthShort: string; // 'Jan', 'Feb', etc.
  monthLong: string; // 'January', 'February', etc.
}

/**
 * Extracts accurate date and time components in the Asia/Kolkata (IST) timezone.
 */
export function getISTDateParts(date: Date = new Date()): ISTDateParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short',
  });

  const longWeekdayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIMEZONE,
    weekday: 'long',
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  }

  const year = parseInt(map.year || '0', 10);
  const monthNum = parseInt(map.month || '1', 10); // 1-12
  const monthIndex = Math.max(0, Math.min(11, monthNum - 1));
  const day = parseInt(map.day || '1', 10);
  const rawHour = parseInt(map.hour || '0', 10);
  const hours = rawHour === 24 ? 0 : rawHour;
  const minutes = parseInt(map.minute || '0', 10);
  const seconds = parseInt(map.second || '0', 10);
  const weekdayShort = map.weekday || 'Mon';
  const weekdayLong = longWeekdayFormatter.format(date);

  return {
    year,
    monthIndex,
    day,
    hours,
    minutes,
    seconds,
    weekdayShort,
    weekdayLong,
    monthShort: MONTHS_SHORT[monthIndex],
    monthLong: MONTHS_LONG[monthIndex],
  };
}

/**
 * Formats a date in IST as "DD MMM YYYY" (e.g. "29 Oct 2026").
 */
export function formatISTDate(date: Date = new Date()): string {
  const { day, monthShort, year } = getISTDateParts(date);
  return `${day} ${monthShort} ${year}`;
}

/**
 * Formats a date in IST as "EEE, DD MMM YYYY" (e.g. "Thu, 29 Oct 2026").
 */
export function formatISTDayAndDate(date: Date = new Date()): string {
  const { weekdayShort, day, monthShort, year } = getISTDateParts(date);
  return `${weekdayShort}, ${day} ${monthShort} ${year}`;
}

/**
 * Formats a date in IST as "MMMM YYYY" (e.g. "October 2026").
 */
export function formatISTMonthYear(date: Date = new Date()): string {
  const { monthLong, year } = getISTDateParts(date);
  return `${monthLong} ${year}`;
}

/**
 * Formats the live clock in IST (e.g. "10:42 AM" or "9:41").
 */
export function formatISTClock(date: Date = new Date(), includePeriod = false): string {
  const { hours, minutes } = getISTDateParts(date);
  const h12 = hours % 12 || 12;
  const mins = String(minutes).padStart(2, '0');
  if (includePeriod) {
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${h12}:${mins} ${period}`;
  }
  return `${h12}:${mins}`;
}

/**
 * Formats a submission timestamp in IST as "DD MMM, H:MM AM/PM" (e.g. "29 Oct, 2:15 PM").
 */
export function formatISTTimestamp(date: Date = new Date()): string {
  const { day, monthShort, hours, minutes } = getISTDateParts(date);
  const h12 = hours % 12 || 12;
  const mins = String(minutes).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${day} ${monthShort}, ${h12}:${mins} ${ampm}`;
}

/**
 * Returns a contextual greeting based on the current hour in Asia/Kolkata.
 */
export function getISTGreeting(date: Date = new Date()): string {
  const { hours } = getISTDateParts(date);
  if (hours < 12) return 'Good Morning';
  if (hours < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Returns a Date shifted by `daysOffset` days from the given Date.
 */
export function addISTDays(date: Date = new Date(), daysOffset: number): Date {
  return new Date(date.getTime() + daysOffset * 24 * 60 * 60 * 1000);
}

/**
 * Computes the Monday–Friday dates for the current week in Asia/Kolkata,
 * along with the active weekday key ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri').
 */
export function getISTCurrentWeekMonToFri(date: Date = new Date()): {
  currentWeekdayKey: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  daysList: Array<{ key: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'; dayName: string; dateNum: number; isToday: boolean }>;
} {
  const { year, monthIndex, day, weekdayShort } = getISTDateParts(date);
  const weekdayOrder: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const currentDow = weekdayOrder[weekdayShort] ?? 1;
  // Monday of the current week (if Sunday, go back 6 days; otherwise 1 - currentDow)
  const diffToMonday = currentDow === 0 ? -6 : 1 - currentDow;
  const baseUtc = new Date(Date.UTC(year, monthIndex, day));

  const keys: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const daysList = keys.map((key, idx) => {
    const d = new Date(baseUtc.getTime() + (diffToMonday + idx) * 24 * 60 * 60 * 1000);
    return {
      key,
      dayName: key,
      dateNum: d.getUTCDate(),
      isToday: currentDow === idx + 1,
    };
  });

  const currentWeekdayKey: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' =
    weekdayShort === 'Mon' ||
    weekdayShort === 'Tue' ||
    weekdayShort === 'Wed' ||
    weekdayShort === 'Thu' ||
    weekdayShort === 'Fri'
      ? weekdayShort
      : 'Mon';

  return { currentWeekdayKey, daysList };
}

/**
 * React hook that keeps a live Date updated so clocks, greetings, and dates stay current at runtime.
 */
export function useISTNow(intervalMs = 15000): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
