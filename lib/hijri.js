// Hijri <-> Gregorian using the browser/Node built-in Umm al-Qura calendar.
// All dates are handled as UTC midnight so time zones cannot shift the day.

export const HIJRI_MONTHS = [
  { en: "Muharram", ur: "محرم", ar: "محرم" },
  { en: "Safar", ur: "صفر", ar: "صفر" },
  { en: "Rabi al-Awwal", ur: "ربیع الاول", ar: "ربيع الأول" },
  { en: "Rabi al-Thani", ur: "ربیع الثانی", ar: "ربيع الآخر" },
  { en: "Jumada al-Awwal", ur: "جمادی الاول", ar: "جمادى الأولى" },
  { en: "Jumada al-Thani", ur: "جمادی الثانی", ar: "جمادى الآخرة" },
  { en: "Rajab", ur: "رجب", ar: "رجب" },
  { en: "Shaban", ur: "شعبان", ar: "شعبان" },
  { en: "Ramadan", ur: "رمضان", ar: "رمضان" },
  { en: "Shawwal", ur: "شوال", ar: "شوال" },
  { en: "Dhu al-Qadah", ur: "ذوالقعدہ", ar: "ذو القعدة" },
  { en: "Dhu al-Hijjah", ur: "ذوالحجہ", ar: "ذو الحجة" },
];

// Supported range (kept inside the years where Umm al-Qura data is dependable)
export const MIN_GREGORIAN = "1938-01-01";
export const MAX_GREGORIAN = "2076-12-31";
export const MIN_HIJRI_YEAR = 1357;
export const MAX_HIJRI_YEAR = 1499;

const DAY = 86400000;
let formatter;

function getFormatter() {
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura-nu-latn", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return formatter;
}

// Very old browsers silently fall back to the Gregorian calendar
export function isHijriSupported() {
  try {
    return getFormatter().resolvedOptions().calendar === "islamic-umalqura";
  } catch {
    return false;
  }
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY);
}

export function toISO(date) {
  return date.toISOString().slice(0, 10);
}

// "YYYY-MM-DD" -> Date, or null for impossible dates such as 2026-02-30
export function parseISO(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!m) return null;
  const date = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return toISO(date) === value ? date : null;
}

// Today's date in a time zone (undefined = the device's own zone) as "YYYY-MM-DD"
export function todayISO(timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(new Date());
}

// adjust = +1 means the local calendar is one day ahead of Umm al-Qura
export function gregorianToHijri(date, adjust = 0) {
  const parts = getFormatter().formatToParts(addDays(date, adjust));
  const get = (type) => parseInt(parts.find((p) => p.type === type).value, 10);
  return { year: get("year"), month: get("month"), day: get("day") };
}

// Returns null when that Hijri date does not exist (for example 30th of a 29-day month)
export function hijriToGregorian(year, month, day, adjust = 0) {
  if (![year, month, day].every(Number.isInteger)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 30) return null;

  // Estimate with the average lunar month, then search the days around it
  const months = (year - 1) * 12 + (month - 1);
  const estimate = new Date(
    Date.UTC(622, 6, 19) + Math.round(months * 29.530588 + day - 1) * DAY
  );
  for (let offset = -45; offset <= 45; offset++) {
    const candidate = addDays(estimate, offset);
    const h = gregorianToHijri(candidate);
    if (h.year === year && h.month === month && h.day === day) {
      return addDays(candidate, -adjust);
    }
  }
  return null;
}

export function formatHijri({ year, month, day }) {
  return `${day} ${HIJRI_MONTHS[month - 1].en} ${year} AH`;
}

export function formatGregorian(date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
