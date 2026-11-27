"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, Moon, Languages } from "lucide-react";
import AdjustControl from "./AdjustControl";
import { ToolHero, ToolSections, CopyButton, Block } from "@/components/ToolSections";
import {
  HIJRI_MONTHS, MIN_GREGORIAN, MAX_GREGORIAN, MIN_HIJRI_YEAR, MAX_HIJRI_YEAR,
  gregorianToHijri, hijriToGregorian, formatHijri, formatGregorian,
  isHijriSupported, parseISO, todayISO,
} from "@/lib/hijri";

const FAQS = [
  { q: "How do I convert a Hijri date to Gregorian?", a: "Choose Hijri to Gregorian, enter the day, month and year, and the matching Gregorian date and weekday appear instantly." },
  { q: "Which Islamic calendar does this converter use?", a: "It uses the Umm al-Qura calendar, the official civil calendar of Saudi Arabia, through your browser's built-in calendar support." },
  { q: "Can the result be wrong by a day?", a: "It can differ by a day from the date announced in your country, because many countries start months by moon sighting. The -1 and +1 adjustment lets you match the local date." },
  { q: "Why does it say my Hijri date does not exist?", a: "Hijri months have either 29 or 30 days. If you enter the 30th of a month that had 29 days in that year, there is no such date." },
  { q: "Which years are supported?", a: `Gregorian dates from 1938 to 2076 and Hijri years from ${MIN_HIJRI_YEAR} to ${MAX_HIJRI_YEAR} AH.` },
];

function convertToHijri(value, adjust) {
  const date = parseISO(value);
  if (!date) return { error: "Please enter a complete, valid date." };
  if (value < MIN_GREGORIAN || value > MAX_GREGORIAN) return { error: "Please pick a date between 1938 and 2076." };
  const hijri = gregorianToHijri(date, adjust);
  return { main: formatHijri(hijri), hijri, sub: formatGregorian(date) };
}

function convertToGregorian({ day, month, year }, adjust) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(d) || d < 1 || d > 30) return { error: "Hijri day must be a number from 1 to 30." };
  if (!Number.isInteger(y) || y < MIN_HIJRI_YEAR || y > MAX_HIJRI_YEAR) {
    return { error: `Hijri year must be from ${MIN_HIJRI_YEAR} to ${MAX_HIJRI_YEAR}.` };
  }
  const date = hijriToGregorian(y, m, d, adjust);
  if (!date) return { error: `${HIJRI_MONTHS[m - 1].en} ${y} has only 29 days. Please choose another day.` };
  const hijri = { day: d, month: m, year: y };
  return { main: formatGregorian(date), hijri, sub: formatHijri(hijri) };
}

export default function HijriDateConverter({ seo }) {
  const [mode, setMode] = useState("toHijri");
  const [gregorian, setGregorian] = useState("");
  const [parts, setParts] = useState({ day: "1", month: "9", year: "1448" });
  const [adjust, setAdjust] = useState(0);
  const [supported, setSupported] = useState(true);

  // Start from today's date once we are in the browser
  useEffect(() => {
    if (!isHijriSupported()) { setSupported(false); return; }
    const iso = todayISO();
    const h = gregorianToHijri(parseISO(iso));
    setGregorian(iso);
    setParts({ day: String(h.day), month: String(h.month), year: String(h.year) });
  }, []);

  let result = null;
  if (!supported) result = { error: "Your browser does not support the Islamic calendar. Please update it or try another browser." };
  else if (mode === "toGregorian") result = convertToGregorian(parts, adjust);
  else if (gregorian) result = convertToHijri(gregorian, adjust);

  const setPart = (key) => (e) => setParts((p) => ({ ...p, [key]: e.target.value }));
  const urdu = result?.hijri && `${result.hijri.day} ${HIJRI_MONTHS[result.hijri.month - 1].ur} ${result.hijri.year} ہجری`;

  return (
    <main className="uc-page">
      <ToolHero crumb="Hijri Date Converter" title="Hijri Date" accent="Converter"
        intro="Convert Gregorian to Hijri and Hijri to Gregorian dates, with Urdu month names." />

      <section className="uc-section-main py-10 px-6">
        <div className="max-w-2xl mx-auto uc-tool-card">
          <div className="dc-tabs mb-6" role="group" aria-label="Conversion direction">
            <button type="button" className="dc-tab" aria-pressed={mode === "toHijri"} onClick={() => setMode("toHijri")}>Gregorian to Hijri</button>
            <button type="button" className="dc-tab" aria-pressed={mode === "toGregorian"} onClick={() => setMode("toGregorian")}>Hijri to Gregorian</button>
          </div>

          {mode === "toHijri" ? (
            <label className="block">
              <span className="uc-select-label">Gregorian date</span>
              <input type="date" className="dc-field" value={gregorian} min={MIN_GREGORIAN} max={MAX_GREGORIAN}
                onChange={(e) => setGregorian(e.target.value)} />
            </label>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label>
                <span className="uc-select-label">Day</span>
                <input type="number" min="1" max="30" className="dc-field" value={parts.day} onChange={setPart("day")} />
              </label>
              <label>
                <span className="uc-select-label">Month</span>
                <select className="uc-select" value={parts.month} onChange={setPart("month")}>
                  {HIJRI_MONTHS.map((m, i) => <option key={m.en} value={i + 1}>{`${m.en} (${m.ur})`}</option>)}
                </select>
              </label>
              <label>
                <span className="uc-select-label">Year (AH)</span>
                <input type="number" min={MIN_HIJRI_YEAR} max={MAX_HIJRI_YEAR} className="dc-field" value={parts.year} onChange={setPart("year")} />
              </label>
            </div>
          )}

          <div aria-live="polite">
            {!result ? (
              <div className="uc-result-empty">Pick a date to see the conversion</div>
            ) : result.error ? (
              <p className="dc-error">{result.error}</p>
            ) : (
              <div className="uc-result">
                <div className="uc-result-number" style={{ fontSize: "clamp(1.5rem, 6vw, 2.25rem)" }}>{result.main}</div>
                <p className="dc-rtl" dir="rtl" lang="ur">{urdu}</p>
                <p className="uc-result-unit">{result.sub}</p>
                <CopyButton text={`${result.sub} = ${result.main}`} />
              </div>
            )}
          </div>

          <AdjustControl value={adjust} onChange={setAdjust} />
        </div>
      </section>

      <ToolSections
        benefits={[
          { icon: ArrowRightLeft, color: "#6366F1", title: "Two-Way Conversion", desc: "Gregorian to Hijri and back again, with the weekday." },
          { icon: Languages, color: "#10B981", title: "Urdu Month Names", desc: "Every result also shows the Hijri date in Urdu." },
          { icon: Moon, color: "#F59E0B", title: "Moon Sighting Control", desc: "Adjust by one day to match your local calendar." },
        ]}
        steps={seo.howItWorks}
        related={[["/today-islamic-date", "Today Islamic Date"], ["/unit-converter", "Unit Converter"], ["/word-counter", "Word Counter"]]}
        faqs={FAQS}
        ctaTitle="Convert another date"
        ctaText="Free, no signup, and the calculation runs in your browser."
      >
        <Block title="Free Islamic date converter">
          <p>
            Use this <strong>Islamic date converter</strong> when a form, certificate or invitation needs both
            calendars. It works as a <strong>Hijri to Gregorian converter</strong> and in the other direction too.
            If you only want today&apos;s date, see the{" "}
            <Link href="/today-islamic-date" className="dc-link">today Islamic date</Link> page.
          </p>
        </Block>
        <Block title="How the Hijri calendar works">
          <p>
            The Hijri calendar is lunar. It counts from the Prophet&apos;s migration to Madinah in 622 CE and has
            twelve months of 29 or 30 days. Because the lunar year is shorter than the solar year, occasions such
            as Ramadan and the two Eids move earlier through the Gregorian calendar each year. For other kinds of
            conversion, such as length or weight, use the{" "}
            <Link href="/unit-converter" className="dc-link">unit converter</Link>.
          </p>
        </Block>
        <Block title="Check dates that matter">
          <p>
            A calculated date is a good guide for planning, but it is not a moon sighting announcement. For
            religious duties and legal documents, confirm the date with the relevant authority in your country.
          </p>
        </Block>
      </ToolSections>
    </main>
  );
}
