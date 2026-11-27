"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Moon, Languages } from "lucide-react";
import AdjustControl from "./AdjustControl";
import { ToolHero, ToolSections, CopyButton, Block } from "@/components/ToolSections";
import { TOOL_CONTENT } from "@/lib/toolContent";
import {
  HIJRI_MONTHS, gregorianToHijri, formatHijri, formatGregorian,
  isHijriSupported, parseISO, todayISO,
} from "@/lib/hijri";

export default function TodayIslamicDate({ seo, today }) {
  const [iso, setIso] = useState(today);
  const [adjust, setAdjust] = useState(0);
  const [supported, setSupported] = useState(true);

  // The server renders the date in Pakistan time; the device date takes over here
  useEffect(() => {
    setSupported(isHijriSupported());
    const update = () => setIso(todayISO());
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  const date = parseISO(iso);
  const hijri = date && supported ? gregorianToHijri(date, adjust) : null;
  const month = hijri ? HIJRI_MONTHS[hijri.month - 1] : null;

  return (
    <main className="uc-page dc-page dc-today">
      <ToolHero crumb="Today Islamic Date" title="Today Islamic" accent="Date"
        intro="Today's Hijri date with the Gregorian date and the month name in Urdu and Arabic." />

      <section className="uc-section-main py-10 px-6">
        <div className="max-w-2xl mx-auto uc-tool-card">
          {hijri ? (
            <div className="uc-result" style={{ marginTop: 0 }}>
              <div className="dc-big">{formatHijri(hijri)}</div>
              <p className="dc-rtl" dir="rtl" lang="ur">{`${hijri.day} ${month.ur} ${hijri.year} ہجری`}</p>
              <p className="dc-rtl" dir="rtl" lang="ar">{`${hijri.day} ${month.ar} ${hijri.year} هـ`}</p>
              <p className="uc-result-unit">{formatGregorian(date)}</p>
              <CopyButton text={`${formatHijri(hijri)} (${formatGregorian(date)})`} />
            </div>
          ) : (
            <p className="dc-error" role="alert">
              Your browser does not support the Islamic calendar. Please update it or try another browser.
            </p>
          )}
          <AdjustControl value={adjust} onChange={setAdjust} />
        </div>
      </section>

      <ToolSections
        benefits={[
          { icon: CalendarDays, color: "#047857", title: "Both Calendars", desc: "Hijri and Gregorian dates side by side, with the weekday." },
          { icon: Languages, color: "#10B981", title: "Urdu and Arabic", desc: "The month name is written in English, Urdu and Arabic." },
          { icon: Moon, color: "#F59E0B", title: "Local Adjustment", desc: "Shift by one day to match the moon sighting where you live." },
        ]}
        steps={seo.howItWorks}
        related={[["/hijri-date-converter", "Hijri Date Converter"], ["/unit-converter", "Unit Converter"], ["/word-counter", "Word Counter"]]}
        content={TOOL_CONTENT["today-islamic-date"]}
        ctaTitle="Need another date?"
        ctaText="Check today's date again, or convert any other day with the Hijri date converter."
      >
        <Block title="Islamic months in Urdu and Arabic">
          <div className="dc-table-wrap">
            <table className="dc-table">
              <thead><tr><th>No.</th><th>English</th><th>Urdu</th><th>Arabic</th></tr></thead>
              <tbody>
                {HIJRI_MONTHS.map((m, i) => (
                  <tr key={m.en}>
                    <td>{i + 1}</td>
                    <td>{m.en}</td>
                    <td dir="rtl" lang="ur">{m.ur}</td>
                    <td dir="rtl" lang="ar">{m.ar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      </ToolSections>
    </main>
  );
}
