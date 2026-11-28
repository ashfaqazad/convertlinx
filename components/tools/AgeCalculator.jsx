"use client";

import { useEffect, useState } from "react";
import { Cake, CalendarDays, ShieldCheck } from "lucide-react";
import { ToolHero, ToolSections, CopyButton } from "@/components/ToolSections";
import { TOOL_CONTENT } from "@/lib/toolContent";
import {
  MIN_GREGORIAN, MAX_GREGORIAN, formatGregorian, formatHijri,
  isHijriSupported, parseISO, todayISO,
} from "@/lib/hijri";
import { MIN_AGE_DATE, MAX_AGE_DATE, calculateAge, calculateHijriAge } from "@/lib/age";

const plural = (n, word) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;
const spell = (age) => `${plural(age.years, "year")}, ${plural(age.months, "month")}, ${plural(age.days, "day")}`;
const inRange = (value) => value >= MIN_AGE_DATE && value <= MAX_AGE_DATE;

function getResult(dob, on, today) {
  const birth = parseISO(dob);
  const target = parseISO(on);
  if (!birth || !target) return { error: "Please enter a complete, valid date." };
  if (!inRange(dob) || !inRange(on)) return { error: "Please pick dates between 1900 and 2100." };
  if (dob > today) return { error: "The date of birth is in the future. Please check the year." };
  if (on < dob) return { error: "The age on date is before the date of birth. Please choose a later date." };

  const age = calculateAge(birth, target);
  const hijriReady = dob >= MIN_GREGORIAN && on <= MAX_GREGORIAN && isHijriSupported();
  return { birth, target, age, hijri: hijriReady ? calculateHijriAge(birth, target) : null };
}

export default function AgeCalculator({ seo }) {
  const [dob, setDob] = useState("");
  const [on, setOn] = useState("");
  const [today, setToday] = useState("");

  // The device's own date is only known once we are in the browser
  useEffect(() => {
    const iso = todayISO();
    setToday(iso);
    setOn(iso);
  }, []);

  const result = dob && on && today ? getResult(dob, on, today) : null;
  const age = result?.age;
  const isToday = on === today;

  let birthdayText = "";
  if (age) {
    birthdayText = age.daysToBirthday === 0
      ? `Happy birthday! Age ${age.turning} is completed on this date.`
      : `${plural(age.daysToBirthday, "day")} to go: age ${age.turning} on ${formatGregorian(age.nextBirthday)}`;
  }

  const rows = age && [
    ["Born on", formatGregorian(result.birth)],
    ["Next birthday", birthdayText],
    ["Total months", `${plural(age.totalMonths, "month")} completed`],
    ["Total weeks", `${plural(age.totalWeeks, "week")} and ${plural(age.extraDays, "day")}`],
    ["Total days", plural(age.totalDays, "day")],
    ...(result.hijri
      ? [["Hijri age", spell(result.hijri)], ["Hijri date of birth", formatHijri(result.hijri.birth)]]
      : []),
  ];

  return (
    <main className="uc-page dc-page dc-age">
      <ToolHero crumb="Age Calculator" title="Age" accent="Calculator"
        intro="Find your exact age in years, months and days from your date of birth, and see how long until your next birthday." />

      <section className="uc-section-main py-10 px-6">
        <div className="max-w-2xl mx-auto uc-tool-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block min-w-0">
              <span className="uc-select-label">Date of birth</span>
              <input type="date" className="dc-field" value={dob} min={MIN_AGE_DATE} max={today || MAX_AGE_DATE}
                onChange={(e) => setDob(e.target.value)} />
            </label>
            <label className="block min-w-0">
              <span className="uc-select-label">Age on date</span>
              <input type="date" className="dc-field" value={on} min={MIN_AGE_DATE} max={MAX_AGE_DATE}
                onChange={(e) => setOn(e.target.value)} />
            </label>
          </div>
          {today && !isToday && (
            <div className="text-center mt-3">
              <button type="button" className="dc-tab" onClick={() => setOn(today)}>Use today&apos;s date</button>
            </div>
          )}

          <div aria-live="polite">
            {!result ? (
              <div className="uc-result-empty">Enter your date of birth to see your age</div>
            ) : result.error ? (
              <p className="dc-error">{result.error}</p>
            ) : (
              <>
                <div className="uc-result">
                  <div className="uc-result-number" style={{ fontSize: "clamp(1.5rem, 6vw, 2.25rem)", wordBreak: "normal" }}>
                    {spell(age)}
                  </div>
                  <p className="uc-result-unit">{isToday ? "Your age today" : `Age on ${formatGregorian(result.target)}`}</p>
                  <CopyButton text={`Age on ${formatGregorian(result.target)}: ${spell(age)}`} />
                </div>
                <div className="dc-table-wrap mt-5">
                  <table className="dc-table">
                    <tbody>
                      {rows.map(([label, value]) => (
                        <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.hijri && (
                  <p className="dc-note">
                    The Hijri age uses the Umm al-Qura calendar. It can differ by a day from the dates announced by moon sighting where you live.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <ToolSections
        benefits={[
          { icon: Cake, color: "#BE123C", title: "Exact Age", desc: "Years, months and days, plus totals in months, weeks and days." },
          { icon: CalendarDays, color: "#10B981", title: "Any Date You Choose", desc: "Check the age on an admission, joining or deadline date." },
          { icon: ShieldCheck, color: "#F59E0B", title: "Private", desc: "The dates are calculated in your browser and not uploaded." },
        ]}
        steps={seo.howItWorks}
        related={[["/hijri-date-converter", "Hijri Date Converter"], ["/today-islamic-date", "Today Islamic Date"], ["/percentage-calculator", "Percentage Calculator"]]}
        content={TOOL_CONTENT["age-calculator"]}
        ctaTitle="Calculate another age"
        ctaText="Free, no signup, and the dates stay on your device."
      />
    </main>
  );
}
