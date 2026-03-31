'use client';

import { useState } from 'react';
import { Type, Shuffle, Copy, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/CaseConverter.css';
import Link from 'next/link';

const CASES = [
  { id: 'lower',       label: 'lowercase',      preview: 'hello world',  fn: t => t.toLowerCase() },
  { id: 'upper',       label: 'UPPERCASE',      preview: 'HELLO WORLD',  fn: t => t.toUpperCase() },
  { id: 'title',       label: 'Title Case',     preview: 'Hello World',  fn: t => t.replace(/\b\w/g, c => c.toUpperCase()) },
  { id: 'sentence',    label: 'Sentence case',  preview: 'Hello world.',  fn: t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
  { id: 'camel',       label: 'camelCase',      preview: 'helloWorld',   fn: t => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { id: 'pascal',      label: 'PascalCase',     preview: 'HelloWorld',   fn: t => { const r = t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); return r.charAt(0).toUpperCase() + r.slice(1); } },
  { id: 'snake',       label: 'snake_case',     preview: 'hello_world',  fn: t => t.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') },
  { id: 'kebab',       label: 'kebab-case',     preview: 'hello-world',  fn: t => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '') },
  { id: 'constant',    label: 'CONSTANT_CASE',  preview: 'HELLO_WORLD',  fn: t => t.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') },
  { id: 'alternating', label: 'aLtErNaTiNg',   preview: 'hElLo WoRlD',  fn: t => t.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
];

export default function CaseConverter() {
  const [text, setText]     = useState('');
  const [active, setActive] = useState('title');

  const activeCase = CASES.find(c => c.id === active);
  const output     = text ? activeCase.fn(text) : '';

  const handleCopy  = () => { if (output) navigator.clipboard.writeText(output); };
  const handleClear = () => setText('');
  const handleSwap  = () => { if (output) setText(output); };

  const faqs = [
    { q: 'Is this case converter free?', a: 'Yes — completely free with no signup required. Convert unlimited text between any case format as many times as you need.' },
    { q: 'What is camelCase used for?', a: 'camelCase is widely used in programming — especially in JavaScript, Java, and Swift — for naming variables and functions. For example: myVariableName or getUserData.' },
    { q: 'What is the difference between PascalCase and camelCase?', a: 'Both join words without spaces, but PascalCase capitalises every word including the first (HelloWorld), while camelCase keeps the first word lowercase (helloWorld). PascalCase is common for class names; camelCase for variables and functions.' },
    { q: 'What is snake_case used for?', a: 'snake_case uses underscores between words and is popular in Python, Ruby, and database column names. It is also common in file naming conventions on Linux systems.' },
    { q: 'What is kebab-case?', a: 'kebab-case uses hyphens between words and is common in URLs, CSS class names, and HTML attributes. For example: my-component or background-color.' },
    { q: 'Does conversion work instantly?', a: 'Yes — everything runs in your browser with no server required. Results appear the moment you select a case format. No delay, no upload, no waiting.' },
    { q: 'Can I convert multiple paragraphs at once?', a: 'Yes — paste as much text as you want including multiple paragraphs, and the converter handles all of it in one go.' },
    { q: 'Is my text stored anywhere?', a: 'No — your text is never sent to any server. All conversion happens locally inside your browser. Full privacy guaranteed.' },
    { q: 'Does it work on mobile?', a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops. The layout is fully responsive and adapts to any screen size.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-cc"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert Text Case Online for Free',
            description:
              'Learn how to instantly convert text to uppercase, lowercase, title case, camelCase, snake_case, and more using the free ConvertLinx Case Converter.',
            url: 'https://convertlinx.com/case-converter',
            totalTime: 'PT10S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Any text, sentence, paragraph, or code snippet' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Case Converter' }],
            step: [
              { '@type': 'HowToStep', name: 'Choose a case format', text: 'Select the case you want to convert to — uppercase, lowercase, title case, camelCase, snake_case, and more.' },
              { '@type': 'HowToStep', name: 'Type or paste your text', text: 'Enter or paste your text into the input box on the left side.' },
              { '@type': 'HowToStep', name: 'Copy the converted output', text: 'The converted result appears instantly on the right. Click Copy to grab it.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-cc"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',           item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Case Converter', item: 'https://convertlinx.com/case-converter' },
            ],
          }),
        }}
      />

      <main className="cc-page">

        {/* ── HERO ── */}
        <section className="cc-hero">
          <div className="cc-blob-1" />
          <div className="cc-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="cc-breadcrumb-link">Home</a>
              <span style={{ color: '#FCA5A5' }}>/</span>
              <span style={{ color: '#EA580C' }}>Case Converter</span>
            </div>
            <span className="cc-badge">Text Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Free Online <span className="cc-grad-text">Case Converter</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Instantly convert text to uppercase, lowercase, title case, camelCase, PascalCase,
              snake_case, kebab-case and more — for developers, writers, and content creators.
              No signup, 100% browser-based. Your text never leaves your device.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="cc-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto cc-fade-up">
            <div className="cc-tool-card">

              <label className="block mb-3" style={{ color: '#EA580C', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Choose a Case Format
              </label>

              {/* Case selector buttons */}
              <div className="cc-cases-grid">
                {CASES.map(c => (
                  <button
                    key={c.id}
                    className={`cc-case-btn ${active === c.id ? 'active' : ''}`}
                    onClick={() => setActive(c.id)}
                  >
                    {c.label}
                    <span className="cc-case-preview">{c.preview}</span>
                  </button>
                ))}
              </div>

              {/* Side-by-side editor */}
              <div className="cc-editor">
                <div className="cc-panel">
                  <div className="cc-panel-head">
                    <span className="cc-panel-label">Input</span>
                    <button className="cc-panel-action" onClick={handleClear}>Clear</button>
                  </div>
                  <textarea
                    className="cc-textarea"
                    placeholder="Type or paste your text here…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                </div>

                <div className="cc-panel">
                  <div className="cc-panel-head">
                    <span className="cc-panel-label">{activeCase.label}</span>
                    <button className="cc-panel-action" onClick={handleCopy}>Copy</button>
                  </div>
                  <div className="cc-output-text">
                    {output || <span className="cc-output-empty">Output will appear here…</span>}
                  </div>
                </div>
              </div>

              <div className="cc-toolbar">
                <button className="cc-btn cc-btn-ghost" onClick={handleCopy}>Copy Output</button>
                <button className="cc-btn cc-btn-ghost" onClick={handleSwap}>Use as Input</button>
                <button className="cc-btn cc-btn-ghost" onClick={handleClear}>Clear All</button>
              </div>

              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No sign-up', 'Instant convert', '10 case formats', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="cc-trust-item">
                    <span className="cc-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="cc-divider" />
        <section className="cc-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Pick a Case Format',   desc: 'Choose from 10 formats — uppercase, lowercase, title case, camelCase, snake_case, and more.' },
                { num: '2', title: 'Paste Your Text',      desc: 'Type directly or paste any content — paragraphs, code, headings, names, or anything else.' },
                { num: '3', title: 'Copy the Result',      desc: 'The converted output appears instantly on the right. Click Copy or use it as new input.' },
              ].map((s, i) => (
                <div key={i} className="cc-step-card">
                  <div className="cc-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="cc-divider" />
        <section className="cc-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx Case Converter?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Type className="w-6 h-6" />,
                  color: '#EA580C',
                  bg: 'rgba(234,88,12,0.08)',
                  title: '10 Case Formats in One Place',
                  desc: 'From everyday formats like uppercase and title case to developer formats like camelCase, PascalCase, snake_case, and kebab-case — all in a single tool.',
                },
                {
                  icon: <Shuffle className="w-6 h-6" />,
                  color: '#A855F7',
                  bg: 'rgba(168,85,247,0.08)',
                  title: 'Instant, No-Click Conversion',
                  desc: 'Select a case format and the output updates immediately — no button to press, no waiting, no server roundtrip. Pure browser-side speed.',
                },
                {
                  icon: <Copy className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Built for Developers & Writers',
                  desc: 'Developers use it daily for variable naming conventions. Writers use it to fix headings and titles. Designers use it for CSS class names and tokens.',
                },
              ].map((b, i) => (
                <div key={i} className="cc-benefit-card">
                  <div className="cc-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="cc-divider" />
        <section className="cc-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                What Is a Case Converter?
              </h2>
              <p className="leading-7 text-sm">
                A case converter is a tool that changes the capitalisation style of text. Whether you
                need to fix text that was accidentally typed in all caps, rename variables to follow
                a coding convention, or prepare headings for a blog post — a case converter does it
                instantly without manual editing.
              </p>
              <p className="leading-7 text-sm mt-3">
                Our free online case converter supports 10 different formats including everyday text
                styles and developer-specific naming conventions, all running entirely in your browser
                with zero setup and no account required.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                All 10 Case Formats Explained
              </h3>
              <p className="leading-7 text-sm">
                <strong style={{ color: '#1a1a2e' }}>lowercase</strong> — converts every letter to small case. Used for casual writing, email addresses, and normalising data.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>UPPERCASE</strong> — converts every letter to capitals. Common for headings, acronyms, and emphasis.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>Title Case</strong> — capitalises the first letter of every word. Standard for article titles, product names, and headings.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>Sentence case</strong> — capitalises only the first letter of the first word. Follows standard sentence grammar.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>camelCase</strong> — joins words with no spaces, first word lowercase, rest capitalised. Standard for JavaScript and Java variables.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>PascalCase</strong> — same as camelCase but every word is capitalised including the first. Used for class names and components.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>snake_case</strong> — words joined with underscores, all lowercase. Standard in Python, Ruby, and database column naming.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>kebab-case</strong> — words joined with hyphens, all lowercase. Used in URLs, CSS classes, and HTML data attributes.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>CONSTANT_CASE</strong> — uppercase with underscores. Used for constants and environment variable names in most languages.
                <br /><br />
                <strong style={{ color: '#1a1a2e' }}>aLtErNaTiNg</strong> — alternates uppercase and lowercase letters. Mostly used for memes and fun social content.
              </p>
            </div>

            <div className="cc-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Use Cases for This Tool
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Rename JavaScript variables to camelCase quickly',
                  'Fix all-caps text pasted from a document',
                  'Convert blog post titles to proper Title Case',
                  'Generate snake_case column names for databases',
                  'Create kebab-case slugs for URLs and CSS classes',
                  'Format constants in CONSTANT_CASE for config files',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="cc-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Developers — convert variable and function names instantly',
                  'Writers — fix capitalisation in headings and titles',
                  'Designers — generate CSS class names in kebab-case',
                  'Data analysts — create consistent snake_case column names',
                  'Students — correct case errors in essays and assignments',
                  'Everyone — fix pasted text that has wrong capitalisation',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#EA580C' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cc-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  '10 different case formats supported',
                  'Instant conversion as you type',
                  'Side-by-side input and output view',
                  'Copy output with one click',
                  'Use output as new input for chaining',
                  'Handles multiple paragraphs at once',
                  'Works fully offline in your browser',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="cc-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for an Online Case Converter
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Convert text to camelCase for JavaScript variables',
                  'Fix title capitalisation for blog posts and articles',
                  'Generate kebab-case from plain text for CSS and URLs',
                  'Convert sentences to snake_case for Python code',
                  'Fix clipboard text pasted in wrong case format',
                  'Convert plain names to PascalCase for React components',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="cc-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="cc-divider" />
        <section className="cc-section-main py-16 px-6">
          <Script
            id="faq-schema-cc"
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
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="cc-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#EA580C' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="cc-divider" />
        <section className="cc-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Word Counter',     href: '/word-counter' },
                { name: 'JSON Formatter',   href: '/json-formatter' },
                { name: 'Base64 Encoder',   href: '/base64-tool' },
                { name: 'Text to PDF',      href: '/text-to-pdf' },
                { name: 'Image to Text',    href: '/image-to-text' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#EA580C', borderColor: '#FED7AA', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="cc-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to convert your text?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cc-cta-btn"
            >
              <Type className="w-5 h-5" />
              Convert Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}