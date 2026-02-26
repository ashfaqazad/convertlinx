'use client';

import { useState, useEffect } from 'react';
import convert from 'convert-units';
import { ArrowRightLeft, Ruler, Scale, Thermometer, Droplets, CheckCircle, Zap } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";

export default function UnitConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const [result, setResult] = useState(null);

  const categories = {
    length: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mile'],
    weight: ['kg', 'g', 'mg', 'lb', 'oz', 't', 'us_ton', 'uk_ton'],
    temperature: ['C', 'F', 'K'],
    volume: ['l', 'ml', 'gal', 'cup', 'tbsp', 'tsp', 'fl-oz'],
    area: ['m2', 'cm2', 'km2', 'ft2', 'in2', 'acre'],
  };

  const labels = {
    m: 'Meter', cm: 'Centimeter', mm: 'Millimeter', km: 'Kilometer',
    in: 'Inch', ft: 'Feet', yd: 'Yard', mile: 'Mile',

    kg: 'Kilogram', g: 'Gram', mg: 'Milligram',
    lb: 'Pound', oz: 'Ounce',

    t: 'Metric Tonne',
    us_ton: 'US Ton (Short Ton)',
    uk_ton: 'UK Ton (Long Ton)',

    C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',

    l: 'Liter', ml: 'Milliliter', gal: 'Gallon (US)',
    cup: 'Cup (US)', tbsp: 'Tablespoon', tsp: 'Teaspoon', 'fl-oz': 'Fluid Ounce',

    m2: 'Square Meter', cm2: 'Square Centimeter',
    km2: 'Square Kilometer', ft2: 'Square Foot',
    in2: 'Square Inch', acre: 'Acre',
  };

  const TON_TO_KG = {
    t: 1000,
    us_ton: 907.184,
    uk_ton: 1016.05,
  };

  const isCustomTon = (unit) => ['t', 'us_ton', 'uk_ton'].includes(unit);

  const convertValue = () => {
    if (!value || isNaN(value) || value === '') {
      setResult(null);
      return;
    }

    try {
      let res;

      if (isCustomTon(from) || isCustomTon(to)) {
        let valueInKg = isCustomTon(from)
          ? parseFloat(value) * TON_TO_KG[from]
          : convert(parseFloat(value)).from(from).to('kg');

        res = isCustomTon(to)
          ? valueInKg / TON_TO_KG[to]
          : convert(valueInKg).from('kg').to(to);
      } else {
        res = convert(parseFloat(value)).from(from).to(to);
      }

      setResult(res.toFixed(6).replace(/\.?0+$/, ''));
    } catch (err) {
      setResult('Invalid');
    }
  };

  useEffect(() => {
    convertValue();
  }, [value, from, to]);

  const quickConvert = (val, f, t) => {
    setValue(val);
    setFrom(f);
    setTo(t);
  };

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-unit"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Convert Units Online for Free",
            description: "Convert length, weight, temperature, volume instantly with accurate results.",
            url: "https://pdflinx.com/unit-converter",
            step: [
              { "@type": "HowToStep", name: "Select Category", text: "Choose length, weight, temperature etc." },
              { "@type": "HowToStep", name: "Enter Value", text: "Type the value to convert." },
              { "@type": "HowToStep", name: "View Result", text: "Instant conversion appears automatically." }
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-unit"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Unit Converter", item: "https://pdflinx.com/unit-converter" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Unit Converter Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert length, weight, temperature, volume, area instantly. Accurate results — 100% free, no signup, works on all devices.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Value Input */}
            <div className="mb-8 flex flex-col items-center">
              <label className="text-xl font-semibold text-gray-800 mb-3 block text-center">
                Enter Value to Convert
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value || '')}
                className="w-full max-w-sm p-4 text-xl font-semibold text-center border-2 border-orange-300 rounded-xl focus:border-amber-500 outline-none transition bg-gray-50"
                placeholder="1"
              />
            </div>

            {/* From → To Selectors */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                  From
                </label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-gray-50"
                >
                  {Object.entries(categories).map(([cat, units]) => (
                    <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                      {units.map(u => (
                        <option key={u} value={u}>{labels[u]} ({u})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <ArrowRightLeft className="w-5 h-5 text-amber-600 rotate-180" />
                  To
                </label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-amber-500 outline-none bg-gray-50"
                >
                  {Object.entries(categories).map(([cat, units]) => (
                    <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                      {units.map(u => (
                        <option key={u} value={u}>{labels[u]} ({u})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Box */}
            {result !== null && (
              <div className="text-center p-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl text-white shadow-lg">
                <p className="text-3xl md:text-4xl font-bold mb-2">
                  {result}
                </p>
                <p className="text-lg font-semibold opacity-90">
                  {labels[to]} ({to})
                </p>
              </div>
            )}
          </div>

          {/* Quick Examples */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => quickConvert(1, 'm', 'ft')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              1 Meter → Feet
            </button>
            <button onClick={() => quickConvert(100, 'kg', 'lb')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              100 KG → Pounds
            </button>
            <button onClick={() => quickConvert(25, 'C', 'F')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              25°C → Fahrenheit
            </button>
            <button onClick={() => quickConvert(500, 'ml', 'cup')} className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-xl shadow-md hover:shadow-lg transition text-base font-medium">
              500 ml → Cup
            </button>
          </div>

          <p className="text-center mt-8 text-gray-600 text-base">
            No signup • Unlimited conversions • Accurate results • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Unit Converter Online Free - Length, Weight, Temperature & More
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert units instantly: length (meter to feet), weight (kg to lbs), temperature (C to F), volume, area — accurate, fast, and completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ruler className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">All Major Units</h3>
            <p className="text-gray-600 text-sm">
              Length, weight, temperature, volume, area — everything covered.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Real-time conversion as you type — no button press needed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Accurate & Free</h3>
            <p className="text-gray-600 text-sm">
              Professional-grade accuracy — unlimited use, completely free.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Convert Units in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Enter Value</h4>
              <p className="text-gray-600 text-sm">Type the number you want to convert.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Select Units</h4>
              <p className="text-gray-600 text-sm">Choose 'From' and 'To' units from dropdown.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Get Result</h4>
              <p className="text-gray-600 text-sm">Instant accurate conversion appears below.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-lg text-gray-600 italic max-w-3xl mx-auto">
          Convert units every day with PDF Linx — trusted for accurate, fast, and completely free measurement conversion.
        </p>
      </section>



      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Unit Converter Online (Free) – Convert Length, Weight, Temperature & More by PDFLinx
        </h2>

        {/* Intro */}
        <p className="text-base leading-7 mb-6">
          Ever tried converting meters to feet, kilograms to pounds, or Celsius to Fahrenheit—and ended up opening
          three different tabs just to get a simple answer? It’s a small thing, but it wastes time.
          That’s why we built the <span className="font-medium text-slate-900">PDFLinx Unit Converter</span> —
          a fast, accurate, and completely free online converter that helps you convert everyday units instantly.
          Just enter a value, choose your “From” and “To” units, and your result appears right away.
          No signup, no clutter, and it works smoothly on any device.
        </p>

        {/* What is */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          What Is a Unit Converter?
        </h3>
        <p className="leading-7 mb-6">
          A unit converter is a tool that transforms a measurement from one unit to another.
          For example, it can convert length (meters to feet), weight (kg to lbs),
          temperature (°C to °F), volume (ml to cups), and more.
          It’s useful for students, travelers, engineers, home cooking, fitness tracking, and everyday tasks—
          basically anytime you need quick, reliable conversions without doing manual math.
        </p>

        {/* Why use */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Why Use an Online Unit Converter?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li>Get instant conversions without formulas or calculators</li>
          <li>Switch between common measurement systems (metric ↔ imperial)</li>
          <li>Convert accurately for schoolwork, projects, and professional use</li>
          <li>Helpful for cooking, fitness, travel, shipping, and DIY tasks</li>
          <li>Save time with quick access to popular conversions</li>
        </ul>

        {/* Steps */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          How to Convert Units Online
        </h3>
        <ol className="space-y-2 mb-6 list-decimal pl-6">
          <li>Enter the value you want to convert</li>
          <li>Select the “From” unit (for example: Meter)</li>
          <li>Select the “To” unit (for example: Feet)</li>
          <li>Your converted result appears instantly</li>
          <li>Try quick conversions like meter → feet, kg → lbs, °C → °F, or ml → cup</li>
        </ol>

        <p className="mb-6">
          No sign-up, unlimited conversions, accurate results — 100% free and easy to use.
        </p>

        {/* Features box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Features of PDFLinx Unit Converter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
            <li>Free online unit converter with instant results</li>
            <li>Convert length, weight, temperature, volume, area & more</li>
            <li>Simple “From” and “To” dropdown selection</li>
            <li>Live conversion output as you enter values</li>
            <li>Popular quick conversions for everyday use</li>
            <li>Works on mobile, tablet, and desktop</li>
            <li>No signup — clean, fast, and convenient</li>
          </ul>
        </div>

        {/* Audience */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Who Should Use This Tool?
        </h3>
        <ul className="space-y-2 mb-6 list-disc pl-6">
          <li><strong>Students:</strong> Convert units for math, science, and homework</li>
          <li><strong>Professionals:</strong> Quick conversions for engineering, construction, and reports</li>
          <li><strong>Travelers:</strong> Understand distances, temperatures, and weights in different systems</li>
          <li><strong>Home cooks:</strong> Convert ml, cups, grams, and more while cooking</li>
          <li><strong>Anyone:</strong> Who wants instant, accurate conversions without effort</li>
        </ul>

        {/* Safety */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Is PDFLinx Unit Converter Accurate and Safe?
        </h3>
        <p className="leading-7 mb-6">
          Yes. The tool is designed to provide accurate conversion results using standard unit relationships.
          It’s also safe to use — no sign-up is required, and you can convert as much as you want.
          Just enter your value, pick your units, and get the result instantly.
        </p>

        {/* Closing */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Convert Units Anytime, Anywhere
        </h3>
        <p className="leading-7">
          PDFLinx Unit Converter works smoothly on Windows, macOS, Linux, Android, and iOS.
          Whether you’re on a phone, tablet, or computer, you can convert units instantly using only your browser.
        </p>
      </section>


      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Is the Unit Converter free to use?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes — it’s completely free with unlimited conversions and no hidden charges.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                What types of units can I convert?
              </summary>
              <p className="mt-2 text-gray-600">
                You can convert common categories like length, weight, temperature, volume, and area — and more,
                depending on the units available in the dropdowns.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                How do I use the converter?
              </summary>
              <p className="mt-2 text-gray-600">
                Enter a value, select the “From” unit and the “To” unit, and the result appears instantly.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Does it work in real-time?
              </summary>
              <p className="mt-2 text-gray-600">
                Yes. The conversion updates instantly as you change the value or switch units.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Are my conversions stored anywhere?
              </summary>
              <p className="mt-2 text-gray-600">
                No — your inputs are used only to calculate the result. Nothing is stored.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-5">
              <summary className="font-semibold cursor-pointer">
                Can I use this on my phone?
              </summary>
              <p className="mt-2 text-gray-600">
                Absolutely. The converter works perfectly on mobile phones, tablets, and desktops.
              </p>
            </details>

          </div>
        </div>
      </section>


      <RelatedToolsSection currentPage="unit-converter" />
    </>
  );
}
