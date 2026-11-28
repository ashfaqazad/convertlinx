// Age arithmetic on UTC-midnight dates (see parseISO in hijri.js).
// Rule for dates that do not exist in a month or year (29 February, the 31st,
// the 30th of a 29-day Hijri month): they count from the 1st of the next month.
import { gregorianToHijri, hijriToGregorian } from "./hijri.js";

const DAY = 86400000;

export const MIN_AGE_DATE = "1900-01-01";
export const MAX_AGE_DATE = "2100-12-31";

export const daysBetween = (from, to) => Math.round((to - from) / DAY);

// The date on which `months` full months are completed after `date`
export function addMonths(date, months) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + months;
  const result = new Date(Date.UTC(y, m, date.getUTCDate()));
  // Overflowed into the following month: use its first day
  if (result.getUTCDate() !== date.getUTCDate()) return new Date(Date.UTC(y, m + 1, 1));
  return result;
}

// Returns null when `on` is before `birth`
export function calculateAge(birth, on) {
  if (on < birth) return null;

  let months =
    (on.getUTCFullYear() - birth.getUTCFullYear()) * 12 + (on.getUTCMonth() - birth.getUTCMonth());
  if (addMonths(birth, months) > on) months -= 1;

  const totalDays = daysBetween(birth, on);

  // First birthday that falls on or after `on`; the day of birth itself is not a birthday
  let turning = Math.max(1, Math.floor(months / 12));
  if (addMonths(birth, turning * 12) < on) turning += 1;
  const nextBirthday = addMonths(birth, turning * 12);

  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: daysBetween(addMonths(birth, months), on),
    totalMonths: months,
    totalWeeks: Math.floor(totalDays / 7),
    extraDays: totalDays % 7,
    totalDays,
    turning,
    nextBirthday,
    daysToBirthday: daysBetween(on, nextBirthday),
  };
}

// Date on which Hijri month number `index` (counted from year 1) reaches `day`
function hijriAnchor(index, day) {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  const exact = hijriToGregorian(year, month, day);
  if (exact) return exact;
  const next = index + 1;
  return hijriToGregorian(Math.floor(next / 12), (next % 12) + 1, 1);
}

export function calculateHijriAge(birth, on) {
  if (on < birth) return null;

  const from = gregorianToHijri(birth);
  const to = gregorianToHijri(on);
  const start = from.year * 12 + (from.month - 1);

  let months = to.year * 12 + (to.month - 1) - start;
  let anchor = hijriAnchor(start + months, from.day);
  if (anchor > on) {
    months -= 1;
    anchor = hijriAnchor(start + months, from.day);
  }

  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: daysBetween(anchor, on),
    birth: from,
  };
}
