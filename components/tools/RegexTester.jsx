'use client';

import { useState, useMemo } from 'react';
import { Code2, Copy, Check, AlertTriangle, Sparkles, Shield, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/RegexTester.css';
import Link from 'next/link';

const FLAG_OPTIONS = [
  { key: 'g', label: 'Global', hint: 'Find all matches' },
  { key: 'i', label: 'Ignore Case', hint: 'Case-insensitive' },
  { key: 'm', label: 'Multiline', hint: '^ and $ match line breaks' },
  { key: 's', label: 'Dot All', hint: '. matches newlines' },
];

const QUICK_PATTERNS = [
  { name: 'Email', pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.-]+' },
  { name: 'URL', pattern: 'https?:\\/\\/[\\w.-]+\\.[a-zA-Z]{2,}[^\\s]*' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: 'IPv4 Address', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b' },
  { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}\\b' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('[\\w.+-]+@[\\w-]+\\.[\\w.-]+');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState(
    'Contact us at support@convertlinx.com or sales@convertlinx.com for help.'
  );
  const [copied, setCopied] = useState(false);

  const activeFlags = Object.keys(flags).filter((k) => flags[k]).join('');

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      return { regex: new RegExp(pattern, activeFlags), error: null };
    } catch (err) {
      return { regex: null, error: err.message };
    }
  }, [pattern, activeFlags]);

  const matches = useMemo(() => {
    if (!regex || !testString) return [];
    const results = [];
    if (flags.g) {
      let m;
      const re = new RegExp(pattern, activeFlags);
      while ((m = re.exec(testString)) !== null) {
        results.push(m);
        if (m.index === re.lastIndex) re.lastIndex++;
        if (results.length > 500) break;
      }
    } else {
      const m = testString.match(regex);
      if (m) results.push(m);
    }
    return results;
  }, [regex, testString, flags.g, pattern, activeFlags]);

  const highlightedParts = useMemo(() => {
    if (!matches.length) return [{ text: testString, isMatch: false }];
    const parts = [];
    let lastIndex = 0;
    matches.forEach((m) => {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false });
      }
      parts.push({ text: m[0], isMatch: true });
      lastIndex = m.index + m[0].length;
    });
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false });
    }
    return parts;
  }, [matches, testString]);

  const toggleFlag = (key) => setFlags((f) => ({ ...f, [key]: !f[key] }));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`/${pattern}/${activeFlags}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const faqs = [
    { q: 'Is the Regex Tester free?', a: 'Yes — completely free, unlimited testing, no signup required.' },
    { q: 'What regex flavor does this tool use?', a: 'It uses JavaScript\'s native RegExp engine — the same regex behavior you get in browsers, Node.js, and any JavaScript codebase.' },
    { q: 'What do the g, i, m, and s flags mean?', a: 'g (global) finds all matches instead of just the first. i (ignore case) makes matching case-insensitive. m (multiline) makes ^ and $ match the start/end of each line. s (dot all) makes . match newline characters too.' },
    { q: 'Why is my regex not matching anything?', a: 'Common reasons include forgetting to escape special characters (like . or ( ) ), using the wrong flags, or a typo in the pattern. Check the error message shown above the test area for invalid patterns.' },
    { q: 'Can I test regex with capture groups?', a: 'Yes — matches with capture groups (using parentheses) show each captured group separately in the match results list below the test area.' },
    { q: 'Is my test data uploaded anywhere?', a: 'No — all regex matching happens directly in your browser using JavaScript\'s built-in RegExp engine. Nothing is sent to any server.' },
    { q: 'Does this work for validating emails, URLs, or phone numbers?', a: 'Yes — use the quick pattern buttons to instantly load common patterns for email, URL, phone number, date, IP address, and hex color validation.' },
    { q: 'Why does my pattern throw a syntax error?', a: 'JavaScript regex requires certain characters to be escaped, like ( ) [ ] . * + ? and \\. If you see an error, check for unmatched brackets or unescaped special characters.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-regex"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Test a Regular Expression Online for Free',
            description: 'Write a regex pattern, paste test text, and see matches highlighted live — with capture groups and flag support.',
            url: 'https://convertlinx.com/regex-tester',
            totalTime: 'PT10S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'A regex pattern and sample text' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Regex Tester' }],
            step: [
              { '@type': 'HowToStep', name: 'Write Your Pattern', text: 'Enter a regular expression and select the flags you need (g, i, m, s).' },
              { '@type': 'HowToStep', name: 'Paste Test Text', text: 'Add the text you want to test your pattern against.' },
              { '@type': 'HowToStep', name: 'View Live Matches', text: 'Matches are highlighted instantly, with capture groups listed below.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-regex"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Regex Tester', item: 'https://convertlinx.com/regex-tester' },
            ],
          }),
        }}
      />

      <main className="rt-page">

        {/* ── HERO ── */}
        <section className="rt-hero">
          <div className="rt-blob-1" />
          <div className="rt-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="rt-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#059669' }}>Regex Tester</span>
            </div>
            <span className="rt-badge">Free Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Regex <span className="rt-grad-text">Tester</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Test regular expressions online with live match highlighting, capture groups,
              and flag support (g, i, m, s). Built-in patterns for email, URL, phone, and more.
              No signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="rt-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto rt-fade-up">
            <div className="rt-tool-card">

              {/* Quick Patterns */}
              <div className="mb-6">
                <label className="block mb-3" style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  Quick Patterns
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PATTERNS.map((qp, i) => (
                    <button key={i} onClick={() => setPattern(qp.pattern)} className="rt-quick-pill">
                      <Sparkles className="w-3 h-3" />
                      {qp.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Input */}
              <div className="mb-4">
                <label className="block mb-3" style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  Regular Expression
                </label>
                <div className="rt-pattern-row">
                  <span className="rt-slash">/</span>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter your regex pattern"
                    className="rt-pattern-input"
                    spellCheck={false}
                  />
                  <span className="rt-slash">/{activeFlags}</span>
                  <button onClick={handleCopy} className="rt-copy-icon-btn" title="Copy regex">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <p className="rt-error-msg">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Invalid regex: {error}
                  </p>
                )}
              </div>

              {/* Flags */}
              <div className="mb-7">
                <label className="block mb-3" style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  Flags
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FLAG_OPTIONS.map((fl) => (
                    <label key={fl.key} className={`rt-flag-option ${flags[fl.key] ? 'active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={flags[fl.key]}
                        onChange={() => toggleFlag(fl.key)}
                        className="rt-flag-checkbox"
                      />
                      <div>
                        <div className="rt-flag-label">{fl.key} — {fl.label}</div>
                        <div style={{ fontSize: '10.5px', color: '#9CA3AF' }}>{fl.hint}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Test String */}
              <div className="mb-6">
                <label className="block mb-3" style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  Test String
                </label>
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  rows={5}
                  className="rt-textarea"
                  placeholder="Paste text to test your regex against..."
                />
              </div>

              {/* Highlighted Preview */}
              <div className="rt-result-card mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>
                  Live Preview — {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                </p>
                <div className="rt-highlight-box">
                  {highlightedParts.map((part, i) =>
                    part.isMatch ? (
                      <mark key={i} className="rt-mark">{part.text}</mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </div>
              </div>

              {/* Match Details */}
              {matches.length > 0 && (
                <div className="rt-matches-list">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>
                    Match Details
                  </p>
                  <div className="space-y-2">
                    {matches.slice(0, 50).map((m, i) => (
                      <div key={i} className="rt-match-item">
                        <span className="rt-match-index">#{i + 1}</span>
                        <span className="rt-match-value">{m[0]}</span>
                        {m.length > 1 && (
                          <span className="rt-match-groups">
                            groups: {m.slice(1).map((g, gi) => `${gi + 1}: "${g ?? ''}"`).join(', ')}
                          </span>
                        )}
                        <span className="rt-match-pos">at index {m.index}</span>
                      </div>
                    ))}
                  </div>
                  {matches.length > 50 && (
                    <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>
                      Showing first 50 of {matches.length} matches
                    </p>
                  )}
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No signup', 'Unlimited testing', 'Nothing stored', '100% free', 'Live highlighting'].map((t, i) => (
                  <span key={i} className="rt-trust-item">
                    <span className="rt-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="rt-divider" />
        <section className="rt-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Write Your Pattern', desc: 'Type a regex pattern or pick a ready-made one for email, URL, phone, or date.' },
                { num: '2', title: 'Paste Test Text', desc: 'Add the text you want to match against — matches highlight instantly as you type.' },
                { num: '3', title: 'Check the Matches', desc: 'See every match, its position, and any captured groups in the results list.' },
              ].map((s, i) => (
                <div key={i} className="rt-step-card">
                  <div className="rt-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="rt-divider" />
        <section className="rt-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Code2 className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Live Match Highlighting',
                  desc: 'See exactly what your pattern matches as you type — no need to run code or check a console.',
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  color: '#0284C7',
                  bg: 'rgba(2,132,199,0.08)',
                  title: 'Ready-Made Patterns',
                  desc: 'One click loads tested patterns for email, URL, phone number, date, IP address, and hex color.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  color: '#6366F1',
                  bg: 'rgba(99,102,241,0.08)',
                  title: 'Secure & Private',
                  desc: 'All matching runs in your browser using native JavaScript RegExp — your text never leaves your device.',
                },
              ].map((b, i) => (
                <div key={i} className="rt-benefit-card">
                  <div className="rt-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="rt-divider" />
        <section className="rt-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why Test Regex Before Using It in Code
              </h2>
              <p className="leading-7 text-sm">
                Regular expressions are powerful but unforgiving — a single missing escape character
                or misplaced quantifier can silently match the wrong text, or nothing at all. Testing
                a pattern against real sample data before shipping it in form validation, search
                filters, or data parsing catches these mistakes early, before they reach production.
              </p>
              <p className="leading-7 text-sm mt-3">
                Whether you're validating an email field, extracting data from log files, or writing
                a find-and-replace pattern, a live regex tester saves the time of running your code
                repeatedly just to check if a pattern behaves the way you expect.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Understanding Regex Flags
              </h3>
              <p className="leading-7 text-sm">
                The <strong>g</strong> (global) flag returns every match in the text instead of stopping
                at the first one. The <strong>i</strong> (ignore case) flag makes matching case-insensitive,
                so "Hello" and "hello" both match. The <strong>m</strong> (multiline) flag changes how
                <code> ^ </code> and <code> $ </code> behave, matching the start and end of each line
                rather than the whole string. The <strong>s</strong> (dot all) flag makes the
                <code> . </code> character match newlines too, which it normally does not.
              </p>
            </div>

            <div className="rt-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Regex silently matches the wrong part of a string',
                  'Unsure whether a pattern needs the g or i flag',
                  'Need to validate emails, URLs, or phone numbers quickly',
                  'Capture groups not returning the expected value',
                  'Pattern throws a syntax error with no clear reason',
                  'Need to test a pattern before adding it to production code',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="rt-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Developers — debug and validate regex before shipping code',
                  'QA engineers — verify input validation patterns',
                  'Data analysts — extract structured data from text or logs',
                  'Students — learn how regex patterns actually behave',
                  'SEO specialists — write URL redirect and rewrite rules',
                  'Anyone writing form validation for emails, phones, or dates',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#059669' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rt-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited regex testing',
                  'Live match highlighting as you type',
                  'Capture group support',
                  'g, i, m, s flag toggles',
                  'Ready-made patterns for common formats',
                  'One-click copy of the full regex',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="rt-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for a Regex Tester
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Validate email and phone number input fields',
                  'Extract structured data from text or CSV files',
                  'Debug a broken regex before deploying it',
                  'Write URL rewrite and redirect rules',
                  'Test find-and-replace patterns for code refactors',
                  'Learn regex syntax with instant visual feedback',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="rt-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="rt-divider" />
        <section className="rt-section-main py-16 px-6">
          <Script
            id="faq-schema-regex"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
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
                <details key={i} className="rt-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="rt-divider" />
        <section className="rt-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'JSON Formatter', href: '/json-formatter' },
                { name: 'Base64 Encode/Decode', href: '/base64-tool' },
                { name: 'Case Converter', href: '/case-converter' },
                { name: 'Word Counter', href: '/word-counter' },
                { name: 'Text to Slug', href: '/text-to-slug' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#059669', borderColor: '#A7F3D0', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="rt-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to test your regex?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="rt-cta-btn"
            >
              <Code2 className="w-5 h-5" />
              Test Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}