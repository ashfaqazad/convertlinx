"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Moon, Languages } from "lucide-react";
import AdjustControl from "./AdjustControl";
import { ToolHero, ToolSections, CopyButton, Block } from "@/components/ToolSections";
import {
  HIJRI_MONTHS, gregorianToHijri, formatHijri, formatGregorian,
  isHijriSupported, parseISO, todayISO,
} from "@/lib/hijri";

const FAQS = [
  { q: "What is the Islamic date today?", a: "The large card at the top of this page shows today's Hijri date with the matching Gregorian date, worked out from your device's date using the Umm al-Qura calendar." },
  { q: "Why is the date in Pakistan sometimes different?", a: "Pakistan begins each Islamic month after local moon sighting, while Umm al-Qura is calculated in advance for Saudi Arabia. The two can differ by a day, so use the -1 or +1 buttons to match the announced date." },
  { q: "When does a new Islamic day start?", a: "In Islamic practice a new day begins at sunset. This page changes the date at midnight, following your device's calendar, so after Maghrib you may already be in the next Islamic day." },
  { q: "How many days are in a Hijri year?", a: "A Hijri year has 12 lunar months of 29 or 30 days, 354 or 355 days in total, which is about 11 days shorter than a Gregorian year." },
];

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
    <main className="uc-page">
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
          { icon: CalendarDays, color: "#6366F1", title: "Both Calendars", desc: "Hijri and Gregorian dates side by side, with the weekday." },
          { icon: Languages, color: "#10B981", title: "Urdu and Arabic", desc: "The month name is written in English, Urdu and Arabic." },
          { icon: Moon, color: "#F59E0B", title: "Local Adjustment", desc: "Shift by one day to match the moon sighting where you live." },
        ]}
        steps={seo.howItWorks}
        related={[["/hijri-date-converter", "Hijri Date Converter"], ["/unit-converter", "Unit Converter"], ["/word-counter", "Word Counter"]]}
        faqs={FAQS}
        ctaTitle="Need another date?"
        ctaText="Check today's date again, or convert any other day with the Hijri date converter."
      >
        <Block title="Today's Hijri date">
          <p>
            This page answers one question quickly: what is the <strong>today Islamic date</strong>? To convert a
            birthday, a document date or an upcoming occasion instead, open the{" "}
            <Link href="/hijri-date-converter" className="dc-link">Hijri date converter</Link>, which works in both
            directions.
          </p>
        </Block>
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
