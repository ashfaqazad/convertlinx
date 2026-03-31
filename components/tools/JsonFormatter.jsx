'use client';

import { useState, useCallback } from 'react';
import { Code2, Braces, FileJson, Minimize2, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/JsonFormatter.css';
import Link from 'next/link';

// ── SYNTAX HIGHLIGHT ──
function syntaxColor(json) {
  return json
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) return `<span class="jf-key">${match}</span>`;
          return `<span class="jf-string">${match}</span>`;
        }
        if (/true|false/.test(match)) return `<span class="jf-bool">${match}</span>`;
        if (/null/.test(match))       return `<span class="jf-null">${match}</span>`;
        return `<span class="jf-num">${match}</span>`;
      }
    );
}

export default function JsonFormatter() {
  const [input,     setInput]     = useState('');
  const [indent,    setIndent]    = useState(2);
  const [formatted, setFormatted] = useState('');
  const [error,     setError]     = useState(null);
  const [stats,     setStats]     = useState(null);

  // ── FORMAT ──
  const format = useCallback(() => {
    if (!input.trim()) { setError(null); setFormatted(''); setStats(null); return; }
    try {
      const parsed = JSON.parse(input);
      const out    = JSON.stringify(parsed, null, indent === 'tab' ? '\t' : Number(indent));
      setFormatted(out);
      setError(null);
      const keys  = (out.match(/"[^"]+"\s*:/g) || []).length;
      const lines = out.split('\n').length;
      setStats({ keys, lines, size: new Blob([out]).size });
    } catch (e) {
      setError(e.message);
      setFormatted('');
      setStats(null);
    }
  }, [input, indent]);

  // ── MINIFY ──
  const minify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const out    = JSON.stringify(parsed);
      setFormatted(out);
      setError(null);
      setStats({ keys: (out.match(/"[^"]+"\s*:/g) || []).length, lines: 1, size: new Blob([out]).size });
    } catch (e) { setError(e.message); }
  }, [input]);

  const copyOutput  = () => { if (formatted) navigator.clipboard.writeText(formatted); };
  const handleClear = () => { setInput(''); setFormatted(''); setError(null); setStats(null); };

  const loadSample = () => {
    setInput(
      JSON.stringify(
        {
          name: 'ConvertLinx',
          version: '2.0',
          tools: ['JSON Formatter', 'Word Counter', 'Case Converter'],
          free: true,
          meta: { author: 'Ashfaque', year: 2026 },
        },
        null,
        2
      )
    );
    setFormatted(''); setError(null); setStats(null);
  };

  const faqs = [
    { q: 'Is this JSON formatter free to use?',          a: 'Yes — completely free with no signup required. Format or validate unlimited JSON as many times as you need.' },
    { q: 'Does my JSON data get sent to a server?',      a: 'No — everything runs entirely inside your browser. Your JSON never leaves your device. Full privacy guaranteed.' },
    { q: 'What is JSON minification?',                   a: 'Minifying removes all whitespace and line breaks from JSON, making the file as small as possible — great for APIs and production builds.' },
    { q: 'Can I use tabs instead of spaces for indent?', a: 'Yes — select "Tab" from the indent dropdown and the formatter will use actual tab characters for indentation.' },
    { q: 'Does it work on mobile?',                      a: 'Yes — the tool works perfectly on iPhone, Android, tablets, and desktops. The layout adapts cleanly to any screen size.' },
    { q: 'What error messages does the validator show?', a: 'When your JSON is invalid, the tool shows the exact parse error from the browser engine, including the position of the syntax mistake.' },
    { q: 'What does the key count show?',                a: 'Key count shows how many named properties exist across your entire JSON structure — useful for quickly understanding the size of complex objects.' },
    { q: 'Can I format nested or deeply nested JSON?',   a: 'Absolutely. The formatter handles any level of nesting. Simply paste your JSON and hit Format — it handles arrays, objects, and primitives at any depth.' },
    { q: 'Does syntax highlighting work automatically?', a: 'Yes — formatted output is colour-coded automatically: keys, strings, numbers, booleans, and null values all appear in different colours.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-jf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Format JSON Online for Free',
            description:
              'Learn how to instantly format, validate, and minify JSON using the free ConvertLinx JSON Formatter — with syntax highlighting, error detection, and key stats.',
            url: 'https://convertlinx.com/json-formatter',
            totalTime: 'PT5S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Any raw or minified JSON string' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx JSON Formatter' }],
            step: [
              { '@type': 'HowToStep', name: 'Paste your JSON', text: 'Type or paste any raw, minified, or broken JSON into the input panel on the left.' },
              { '@type': 'HowToStep', name: 'Click Format JSON', text: 'Press the Format JSON button. The tool validates your JSON and displays the formatted, syntax-highlighted output instantly.' },
              { '@type': 'HowToStep', name: 'Copy or minify', text: 'Copy the formatted output to your clipboard, or click Minify to compress it back into a single line.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-jf"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',           item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'JSON Formatter', item: 'https://convertlinx.com/json-formatter' },
            ],
          }),
        }}
      />

      <main className="jf-page">

        {/* ── HERO ── */}
        <section className="jf-hero">
          <div className="jf-blob-1" />
          <div className="jf-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="jf-breadcrumb-link">Home</a>
              <span className="jf-breadcrumb-sep">/</span>
              <span className="jf-breadcrumb-current">JSON Formatter</span>
            </div>
            <span className="jf-badge">Dev Tool</span>
            <h1 className="jf-hero-title">
              Free Online <span className="jf-grad-text">JSON Formatter</span>
            </h1>
            <p className="jf-hero-sub">
              Format, validate, and minify JSON instantly — with syntax highlighting and error detection.
              No signup, no limits, 100% browser-based. Your data never leaves your device.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="jf-section-main py-10 px-6">
          <div className="max-w-5xl mx-auto jf-fade-up">

            {/* Stats Grid */}
            {stats && (
              <div className="jf-stats-grid">
                {[
                  { label: 'Lines', value: stats.lines },
                  { label: 'Keys',  value: stats.keys  },
                  { label: 'Size',  value: `${stats.size} B` },
                ].map(({ label, value }) => (
                  <div key={label} className="jf-stat-card">
                    <span className="jf-stat-num">{value}</span>
                    <span className="jf-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="jf-tool-card">

              {/* Toolbar */}
              <div className="jf-toolbar">
                <button className="jf-btn jf-btn-primary" onClick={format}>
                  <Braces className="w-4 h-4" /> Format JSON
                </button>
                <button className="jf-btn jf-btn-ghost" onClick={minify}>
                  <Minimize2 className="w-4 h-4" /> Minify
                </button>
                <button className="jf-btn jf-btn-ghost" onClick={loadSample}>Load Sample</button>
                <button className="jf-btn jf-btn-ghost" onClick={handleClear}>Clear</button>
                {formatted && (
                  <button className="jf-btn jf-btn-ghost" onClick={copyOutput}>Copy Output</button>
                )}
                <div className="jf-indent-wrap">
                  <label className="jf-indent-label">Indent:</label>
                  <select
                    className="jf-indent-select"
                    value={indent}
                    onChange={e => setIndent(e.target.value)}
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value="tab">Tab</option>
                  </select>
                </div>
              </div>

              {/* Editor Grid */}
              <div className="jf-editor">
                {/* Input Panel */}
                <div className="jf-panel">
                  <div className="jf-panel-head">
                    <span className="jf-panel-label">Raw JSON</span>
                    <span className="jf-panel-meta">{input.length} chars</span>
                  </div>
                  <textarea
                    className="jf-textarea"
                    placeholder={'{\n  "paste": "your JSON here"\n}'}
                    value={input}
                    onChange={e => { setInput(e.target.value); setFormatted(''); setError(null); setStats(null); }}
                  />
                </div>

                {/* Output Panel */}
                <div className="jf-panel">
                  <div className="jf-panel-head">
                    <span className="jf-panel-label">Formatted Output</span>
                    {stats && <span className="jf-panel-meta">{stats.lines} lines · {stats.keys} keys</span>}
                  </div>
                  <div
                    className={`jf-output ${error ? 'error' : formatted ? 'success' : 'empty'}`}
                    dangerouslySetInnerHTML={{
                      __html: formatted
                        ? syntaxColor(
                            formatted
                              .replace(/&/g, '&amp;')
                              .replace(/</g, '&lt;')
                              .replace(/>/g, '&gt;')
                          )
                        : error
                        ? ''
                        : 'Formatted output will appear here…',
                    }}
                  />
                </div>
              </div>

              {/* Error Badge */}
              {error && (
                <div className="jf-error-badge">
                  <span className="jf-error-icon">⚠</span>
                  <div><strong>Invalid JSON:</strong> {error}</div>
                </div>
              )}

              <div className="jf-trust-strip">
                {['No sign-up', 'Client-side only', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="jf-trust-item">
                    <span className="jf-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="jf-divider" />
        <section className="jf-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="jf-section-title text-center mb-12">3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Paste Your JSON',   desc: 'Type or paste any raw, minified, or messy JSON into the left panel — from APIs, config files, or anywhere else.' },
                { num: '2', title: 'Format & Validate', desc: 'Click Format JSON. The tool validates your JSON and displays it with clean indentation and colour-coded syntax.' },
                { num: '3', title: 'Copy or Minify',    desc: 'Copy the formatted output, or click Minify to compress it back into a single-line string for production use.' },
              ].map((s, i) => (
                <div key={i} className="jf-step-card">
                  <div className="jf-step-num">{s.num}</div>
                  <h3 className="jf-card-title font-bold text-base mb-2">{s.title}</h3>
                  <p className="jf-card-desc text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="jf-divider" />
        <section className="jf-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="jf-section-title text-center mb-10">Why Use ConvertLinx JSON Formatter?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Braces className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(16,185,129,0.08)',
                  title: 'Instant Formatting',
                  desc: 'Paste any JSON and click Format — indentation, line breaks, and structure are applied instantly with no delay.',
                },
                {
                  icon: <Code2 className="w-6 h-6" />,
                  color: '#0369A1',
                  bg: 'rgba(3,105,161,0.08)',
                  title: 'Syntax Highlighting',
                  desc: 'Keys, strings, numbers, booleans, and null values are colour-coded so you can read complex JSON at a glance.',
                },
                {
                  icon: <FileJson className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Error Detection',
                  desc: 'Invalid JSON shows a clear error message with the exact parse failure — no guessing where the syntax broke.',
                },
              ].map((b, i) => (
                <div key={i} className="jf-benefit-card">
                  <div className="jf-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="jf-card-title font-bold text-base mb-2">{b.title}</h3>
                  <p className="jf-card-desc text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="jf-divider" />
        <section className="jf-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="jf-section-title text-2xl mb-4">Why JSON Formatting Matters</h2>
              <p className="jf-body-text leading-7 text-sm">
                JSON is the standard data format for APIs, configuration files, and data exchange on the web.
                Raw or minified JSON is almost impossible to read — a formatter turns it into a clean,
                indented structure that developers can scan and debug in seconds.
              </p>
              <p className="jf-body-text leading-7 text-sm mt-3">
                Our free JSON formatter runs entirely in your browser. No data is sent to any server,
                making it safe to use with API keys, private configs, and internal data structures.
                Just paste and format — no install, no login.
              </p>
            </div>

            <div>
              <h3 className="jf-section-subtitle font-bold text-lg mb-3">Common JSON Use Cases</h3>
              <p className="jf-body-text leading-7 text-sm">
                JSON is used everywhere — REST API responses, Next.js and React config files,
                package.json, environment schemas, database exports, and more. Whether you are
                debugging a 400 error from an API, reading a deeply nested config, or comparing
                two JSON payloads, a formatter makes the job faster and less error-prone.
              </p>
            </div>

            <div className="jf-seo-box">
              <h3 className="jf-section-subtitle font-bold text-lg mb-4">Common Use Cases for This Tool</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Format and read API responses from REST or GraphQL',
                  'Validate JSON config files before deploying',
                  'Minify JSON for smaller payload sizes in production',
                  'Debug malformed JSON with exact error messages',
                  'Beautify package.json or tsconfig.json files',
                  'Inspect and explore nested data structures',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="jf-feature-dot" />
                    <span className="jf-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="jf-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Frontend developers — debug API responses fast',
                  'Backend developers — validate JSON payloads',
                  'DevOps engineers — inspect config and schema files',
                  'QA engineers — compare and verify JSON outputs',
                  'Students — learn JSON structure interactively',
                  'Everyone — anyone working with JSON data',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="jf-arrow font-bold mt-0.5">→</span>
                    <span className="jf-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="jf-seo-box">
              <h3 className="jf-section-subtitle font-bold text-lg mb-4">Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Format with 2 spaces, 4 spaces, or tabs',
                  'Syntax highlighting for all JSON types',
                  'Real-time error detection and messages',
                  'Minify to single-line compressed output',
                  'Key count, line count, and byte size stats',
                  'Load sample JSON to try instantly',
                  'Works fully offline in browser',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="jf-feature-dot" />
                    <span className="jf-body-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="jf-divider" />
        <section className="jf-section-main py-16 px-6">
          <Script
            id="faq-schema-jf"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map(faq => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              }),
            }}
          />
          <div className="max-w-3xl mx-auto">
            <h2 className="jf-section-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="jf-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="jf-faq-question font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className="jf-faq-icon w-4 h-4 shrink-0" />
                  </summary>
                  <p className="jf-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="jf-divider" />
        <section className="jf-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="jf-section-title text-center mb-5">You may also find these free tools helpful</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Word Counter',        href: '/word-counter'   },
                { name: 'Case Converter',      href: '/case-converter' },
                { name: 'Base64 Encoder',      href: '/base64-tool'     },
                { name: 'Text to PDF',         href: '/text-to-pdf'    },
                { name: 'Image to Text (OCR)', href: '/image-to-text'  },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border jf-related-link"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="jf-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to format your JSON?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="jf-cta-btn"
            >
              <Braces className="w-5 h-5" />
              Format JSON Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}