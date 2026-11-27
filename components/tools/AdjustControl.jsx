"use client";

const OPTIONS = [
  { value: -1, label: "-1 day" },
  { value: 0, label: "0 (Umm al-Qura)" },
  { value: 1, label: "+1 day" },
];

export default function AdjustControl({ value, onChange }) {
  return (
    <div className="mt-6 text-center">
      <p className="uc-select-label justify-center">Moon sighting adjustment</p>
      <div className="dc-tabs" role="group" aria-label="Moon sighting adjustment">
        {OPTIONS.map((o) => (
          <button key={o.value} type="button" className="dc-tab" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className="dc-note">
        Dates use the Saudi Umm al-Qura calendar. In Pakistan and several other countries a month starts
        when the moon is sighted, so your local date can differ by a day. Use the buttons above to match it,
        and follow your local moon sighting authority for religious occasions.
      </p>
    </div>
  );
}
