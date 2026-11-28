"use client";

import { useState } from "react";
import { Percent, ListChecks, ShieldCheck } from "lucide-react";
import { ToolHero, ToolSections, CopyButton } from "@/components/ToolSections";
import { TOOL_CONTENT } from "@/lib/toolContent";
import { percentOf, whatPercent, percentChange, adjustByPercent, formatNumber } from "@/lib/percentage";

const f = formatNumber;

// `sentence` receives the two numbers as typed plus the result
const MODES = [
  {
    id: "of",
    tab: "X% of Y",
    labels: ["Percentage (X)", "Number (Y)"],
    solve: percentOf,
    show: (r) => f(r.value),
    sentence: (a, b, r) => `${f(a)}% of ${f(b)} = ${f(r.value)}`,
    example: "What is 15% of 2,000? Multiply 2,000 by 15 and divide by 100. The answer is 300.",
  },
  {
    id: "is",
    tab: "X is what % of Y",
    labels: ["Part (X)", "Total (Y)"],
    solve: whatPercent,
    show: (r) => `${f(r.value)}%`,
    sentence: (a, b, r) => `${f(a)} is ${f(r.value)}% of ${f(b)}`,
    example: "You scored 45 out of 60. Divide 45 by 60 and multiply by 100. The score is 75%.",
  },
  {
    id: "change",
    tab: "% Increase / Decrease",
    labels: ["Old value", "New value"],
    solve: percentChange,
    show: (r) => `${f(Math.abs(r.value))}% ${r.value > 0 ? "increase" : r.value < 0 ? "decrease" : "change"}`,
    sentence: (a, b, r) => `From ${f(a)} to ${f(b)}: a difference of ${r.difference > 0 ? "+" : ""}${f(r.difference)}`,
    example: "A price goes from 800 to 1,000. The difference is 200, and 200 divided by 800 is a 25% increase.",
  },
  {
    id: "adjust",
    tab: "Add / Subtract %",
    labels: ["Number", "Percentage"],
    solve: adjustByPercent,
    show: (r) => f(r.value),
    sentence: (a, b, r, direction) =>
      `${f(a)} ${direction === "subtract" ? "minus" : "plus"} ${f(b)}% (${f(r.amount)}) = ${f(r.value)}`,
    example: "Take 20% off 1,500: 20% of 1,500 is 300, so you pay 1,200. Adding 20% instead gives 1,800.",
  },
];

export default function PercentageCalculator({ seo }) {
  const [modeId, setModeId] = useState("of");
  const [values, setValues] = useState(["", ""]);
  const [direction, setDirection] = useState("add");

  const mode = MODES.find((m) => m.id === modeId);
  const result = mode.solve(values[0], values[1], direction);
  const sentence = result && !result.error
    ? mode.sentence(Number(values[0]), Number(values[1]), result, direction)
    : "";

  const setValue = (index) => (e) =>
    setValues((current) => current.map((v, i) => (i === index ? e.target.value : v)));

  return (
    <main className="uc-page dc-page dc-percent">
      <ToolHero crumb="Percentage Calculator" title="Percentage" accent="Calculator"
        intro="Work out a percentage of a number, a percentage score, a price increase or decrease, and add or take off a percentage." />

      <section className="uc-section-main py-10 px-6">
        <div className="max-w-2xl mx-auto uc-tool-card">
          <div className="dc-tabs mb-6" role="group" aria-label="Calculation type">
            {MODES.map((m) => (
              <button key={m.id} type="button" className="dc-tab" aria-pressed={modeId === m.id}
                onClick={() => { setModeId(m.id); setValues(["", ""]); }}>
                {m.tab}
              </button>
            ))}
          </div>

          {modeId === "adjust" && (
            <div className="dc-tabs mb-5" role="group" aria-label="Add or subtract">
              {[["add", "Add (+)"], ["subtract", "Subtract (-)"]].map(([id, label]) => (
                <button key={id} type="button" className="dc-tab" aria-pressed={direction === id}
                  onClick={() => setDirection(id)}>
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mode.labels.map((label, index) => (
              <label key={`${mode.id}-${label}`} className="block min-w-0">
                <span className="uc-select-label">{label}</span>
                <input type="number" inputMode="decimal" step="any" className="dc-field" value={values[index]}
                  onChange={setValue(index)} />
              </label>
            ))}
          </div>

          <div aria-live="polite">
            {!result ? (
              <div className="uc-result-empty">Enter both numbers to see the answer</div>
            ) : result.error ? (
              <p className="dc-error">{result.error}</p>
            ) : (
              <div className="uc-result">
                <div className="uc-result-number" style={{ fontSize: "clamp(1.5rem, 7vw, 2.5rem)" }}>{mode.show(result)}</div>
                <p className="uc-result-unit">{sentence}</p>
                <CopyButton text={modeId === "change" ? `${sentence} (${mode.show(result)})` : sentence} />
              </div>
            )}
          </div>

          <p className="dc-note"><strong>Example:</strong> {mode.example}</p>
        </div>
      </section>

      <ToolSections
        benefits={[
          { icon: Percent, color: "#6D28D9", title: "Four Calculations", desc: "Percentage of, what percent, change, and add or subtract." },
          { icon: ListChecks, color: "#10B981", title: "Worked Examples", desc: "Each mode shows how the answer is reached." },
          { icon: ShieldCheck, color: "#F59E0B", title: "Private", desc: "Your numbers are calculated in your browser and not uploaded." },
        ]}
        steps={seo.howItWorks}
        related={[["/unit-converter", "Unit Converter"], ["/currency-converter", "Currency Converter"], ["/age-calculator", "Age Calculator"]]}
        content={TOOL_CONTENT["percentage-calculator"]}
        ctaTitle="Work out another percentage"
        ctaText="Free, no signup, and the maths runs in your browser."
      />
    </main>
  );
}
