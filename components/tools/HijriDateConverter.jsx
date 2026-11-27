"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft, Moon, Languages } from "lucide-react";
import AdjustControl from "./AdjustControl";
import { ToolHero, ToolSections, CopyButton } from "@/components/ToolSections";
import { TOOL_CONTENT } from "@/lib/toolContent";
import {
  HIJRI_MONTHS, MIN_GREGORIAN, MAX_GREGORIAN, MIN_HIJRI_YEAR, MAX_HIJRI_YEAR,
  gregorianToHijri, hijriToGregorian, formatHijri, formatGregorian,
  isHijriSupported, parseISO, todayISO,
} from "@/lib/hijri";

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
    <main className="uc-page dc-page dc-hijri">
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
          { icon: ArrowRightLeft, color: "#B45309", title: "Two-Way Conversion", desc: "Gregorian to Hijri and back again, with the weekday." },
          { icon: Languages, color: "#10B981", title: "Urdu Month Names", desc: "Every result also shows the Hijri date in Urdu." },
          { icon: Moon, color: "#F59E0B", title: "Moon Sighting Control", desc: "Adjust by one day to match your local calendar." },
        ]}
        steps={seo.howItWorks}
        related={[["/today-islamic-date", "Today Islamic Date"], ["/unit-converter", "Unit Converter"], ["/word-counter", "Word Counter"]]}
        content={TOOL_CONTENT["hijri-date-converter"]}
        ctaTitle="Convert another date"
        ctaText="Free, no signup, and the calculation runs in your browser."
      />
    </main>
  );
}
