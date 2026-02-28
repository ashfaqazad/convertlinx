'use client';

import { useState, useEffect } from 'react';
import convert from 'convert-units';
import {
  ArrowRightLeft, Ruler, Scale, Thermometer,
  Droplets, CheckCircle, Zap, ChevronDown
} from 'lucide-react';
import Script from 'next/script';
import '@/styles/UnitConverter.css';  // ← sahi path


export default function UnitConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const [result, setResult] = useState(null);

  const categories = {
    Length:      ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mile'],
    Weight:      ['kg', 'g', 'mg', 'lb', 'oz', 't', 'us_ton', 'uk_ton'],
    Temperature: ['C', 'F', 'K'],
    Volume:      ['l', 'ml', 'gal', 'cup', 'tbsp', 'tsp', 'fl-oz'],
    Area:        ['m2', 'cm2', 'km2', 'ft2', 'in2', 'acre'],
  };

  const labels = {
    m: 'Meter', cm: 'Centimeter', mm: 'Millimeter', km: 'Kilometer',
    in: 'Inch', ft: 'Feet', yd: 'Yard', mile: 'Mile',
    kg: 'Kilogram', g: 'Gram', mg: 'Milligram',
    lb: 'Pound', oz: 'Ounce',
    t: 'Metric Tonne', us_ton: 'US Ton', uk_ton: 'UK Ton',
    C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',
    l: 'Liter', ml: 'Milliliter', gal: 'Gallon (US)',
    cup: 'Cup (US)', tbsp: 'Tablespoon', tsp: 'Teaspoon', 'fl-oz': 'Fluid Ounce',
    m2: 'Sq. Meter', cm2: 'Sq. Centimeter', km2: 'Sq. Kilometer',
    ft2: 'Sq. Foot', in2: 'Sq. Inch', acre: 'Acre',
  };

  const TON_TO_KG = { t: 1000, us_ton: 907.184, uk_ton: 1016.05 };
  const isCustomTon = (u) => ['t', 'us_ton', 'uk_ton'].includes(u);

  const convertValue = () => {
    if (!value || isNaN(value) || value === '') { setResult(null); return; }
    try {
      let res;
      if (isCustomTon(from) || isCustomTon(to)) {
        const inKg = isCustomTon(from)
          ? parseFloat(value) * TON_TO_KG[from]
          : convert(parseFloat(value)).from(from).to('kg');
        res = isCustomTon(to) ? inKg / TON_TO_KG[to] : convert(inKg).from('kg').to(to);
      } else {
        res = convert(parseFloat(value)).from(from).to(to);
      }
      setResult(res.toFixed(6).replace(/\.?0+$/, ''));
    } catch { setResult('Invalid'); }
  };

  useEffect(() => { convertValue(); }, [value, from, to]);

  const quickConvert = (val, f, t) => { setValue(val); setFrom(f); setTo(t); };

  const handleSwap = () => { setFrom(to); setTo(from); };

  const quickLinks = [
    { label: '1 m → ft',      val: 1,   f: 'm',  t: 'ft'  },
    { label: '100 kg → lbs',  val: 100, f: 'kg', t: 'lb'  },
    { label: '25°C → °F',     val: 25,  f: 'C',  t: 'F'   },
    { label: '500 ml → cup',  val: 500, f: 'ml', t: 'cup' },
    { label: '1 km → mile',   val: 1,   f: 'km', t: 'mile'},
    { label: '1 acre → m²',   val: 1,   f: 'acre',t:'m2'  },
    { label: '1 gal → liter', val: 1,   f: 'gal',t: 'l'   },
    { label: '1 ft → cm',     val: 1,   f: 'ft', t: 'cm'  },
  ];

  return (
    <>
      <Script id="howto-schema-unit" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Units Online for Free",
            description: "Convert length, weight, temperature, volume instantly.",
            url: "https://convertlyhub.com/unit-converter",
            step: [
              { "@type": "HowToStep", name: "Enter Value", text: "Type the value to convert." },
              { "@type": "HowToStep", name: "Select Units", text: "Choose From and To units." },
              { "@type": "HowToStep", name: "View Result", text: "Instant result appears automatically." }
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
          }, null, 2),
        }}
      />

      <main className="uc-page">

        {/* ── HERO ── */}
        <section className="uc-hero py-16 px-6 text-center">
          <div className="uc-blob-1" />
          <div className="uc-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="uc-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#6366F1' }}>Unit Converter</span>
            </div>
            <span className="uc-badge mb-5">Free Tool</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 mt-5" style={{ color: '#1a1a2e' }}>
              Unit{' '}
              <span className="uc-grad-text">Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Convert length, weight, temperature, volume & more — instantly, free, no signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="uc-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto uc-fade-up">
            <div className="uc-tool-card">

              {/* Value Input */}
              <div className="mb-8 flex flex-col items-center">
                <label className="uc-select-label mb-3 justify-center">
                  Enter Value
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value || '')}
                  placeholder="1"
                  className="uc-number-input"
                />
              </div>

              {/* From / Swap / To */}
              <div className="flex items-end gap-3 mb-6">
                {/* From */}
                <div className="flex-1">
                  <div className="uc-select-label">
                    <ArrowRightLeft className="w-4 h-4" />
                    From
                  </div>
                  <select value={from} onChange={(e) => setFrom(e.target.value)} className="uc-select">
                    {Object.entries(categories).map(([cat, units]) => (
                      <optgroup key={cat} label={cat}>
                        {units.map(u => (
                          <option key={u} value={u}>{labels[u]} ({u})</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Swap */}
                <button onClick={handleSwap} className="uc-swap-btn mb-0.5" title="Swap units">
                  <ArrowRightLeft className="w-5 h-5" />
                </button>

                {/* To */}
                <div className="flex-1">
                  <div className="uc-select-label">
                    <ArrowRightLeft className="w-4 h-4 rotate-90" />
                    To
                  </div>
                  <select value={to} onChange={(e) => setTo(e.target.value)} className="uc-select">
                    {Object.entries(categories).map(([cat, units]) => (
                      <optgroup key={cat} label={cat}>
                        {units.map(u => (
                          <option key={u} value={u}>{labels[u]} ({u})</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              {result !== null ? (
                <div className="uc-result uc-result-pop">
                  <div className="uc-result-number">{result}</div>
                  <div className="uc-result-unit">{labels[to]} ({to})</div>
                </div>
              ) : (
                <div className="uc-result-empty">
                  Enter a value above to see the conversion
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'Unlimited conversions', 'Accurate results', '100% free'].map((t, i) => (
                  <span key={i} className="uc-trust-item">
                    <span className="uc-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Convert Buttons */}
            <div className="mt-6">
              <p className="text-center text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#A5B4FC' }}>
                Quick Conversions
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickLinks.map((q, i) => (
                  <button key={i} onClick={() => quickConvert(q.val, q.f, q.t)} className="uc-quick-btn">
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="uc-divider" />
        <section className="uc-section-alt py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertlyHub?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <Ruler className="w-6 h-6" />,       color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  title: 'All Major Units',   desc: 'Length, weight, temperature, volume, area — everything covered in one place.' },
                { icon: <Zap className="w-6 h-6" />,         color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: 'Instant Results',   desc: 'Real-time conversion as you type — no button press needed.' },
                { icon: <CheckCircle className="w-6 h-6" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: 'Accurate & Free',   desc: 'Professional-grade accuracy. Unlimited conversions, completely free.' },
              ].map((b, i) => (
                <div key={i} className="uc-benefit-card">
                  <div className="uc-benefit-icon" style={{ background: b.bg, color: b.color }}>
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO ── */}
        <hr className="uc-divider" />
        <section className="uc-section-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Enter Value',   desc: 'Type the number you want to convert.' },
                { num: '2', title: 'Select Units',  desc: 'Choose From and To units from dropdowns.' },
                { num: '3', title: 'Get Result',    desc: 'Instant accurate conversion appears right away.' },
              ].map((s, i) => (
                <div key={i} className="uc-step-card">
                  <div className="uc-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="uc-divider" />
        <section className="uc-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Free Unit Converter — ConvertlyHub
              </h2>
              <p className="leading-7 text-sm">
                The <span style={{ color: '#1a1a2e', fontWeight: 600 }}>ConvertlyHub Unit Converter</span> helps
                you convert everyday measurements instantly — no formula, no calculator, no signup needed.
                Just enter a value, choose your units, and get the result right away.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>What Can I Convert?</h3>
              <p className="leading-7 text-sm">
                Length (meters to feet), weight (kg to lbs), temperature (°C to °F),
                volume (ml to cups), and area (m² to acres) — all major categories covered.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Students — math, science, homework',
                  'Professionals — engineering & reports',
                  'Travelers — distances & temperatures',
                  'Home cooks — ml, cups, grams',
                  'Anyone — quick daily conversions',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#6366F1' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="uc-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free with unlimited conversions',
                  'Length, weight, temp, volume, area',
                  'Live result as you type',
                  '8 quick conversion shortcuts',
                  'Swap units in one click',
                  'Works on mobile & desktop',
                  'No signup required',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="uc-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="uc-divider" />
        <section className="uc-section-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: 'Is the Unit Converter free?',         a: 'Yes — completely free with unlimited conversions and no hidden charges.' },
                { q: 'What units can I convert?',           a: 'Length, weight, temperature, volume, and area — all major categories.' },
                { q: 'How do I use it?',                    a: 'Enter a value, select From and To units, and the result appears instantly.' },
                { q: 'Does it work in real-time?',          a: 'Yes — conversion updates instantly as you change the value or switch units.' },
                { q: 'Are my conversions stored?',          a: 'No — inputs are only used to calculate the result. Nothing is stored.' },
                { q: 'Can I use this on my phone?',         a: 'Absolutely — works perfectly on phones, tablets, and desktops.' },
              ].map((faq, i) => (
                <details key={i} className="uc-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#6366F1' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="uc-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to convert units?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="uc-cta-btn"
            >
              <Ruler className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}

