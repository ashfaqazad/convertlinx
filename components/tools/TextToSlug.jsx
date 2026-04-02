'use client';

import { useState, useCallback } from 'react';
import { Link2, Copy, RotateCcw, Settings, ChevronDown, CheckCheck } from 'lucide-react';
import Script from 'next/script';
import '@/styles/TextToSlug.css';
import Link from 'next/link';

// ── SLUG LOGIC ──

// Custom separator chars map for special languages
const CHAR_MAP = {
  // Latin extended
  à:'a',á:'a',â:'a',ã:'a',ä:'a',å:'a',æ:'ae',
  è:'e',é:'e',ê:'e',ë:'e',
  ì:'i',í:'i',î:'i',ï:'i',
  ò:'o',ó:'o',ô:'o',õ:'o',ö:'o',ø:'o',
  ù:'u',ú:'u',û:'u',ü:'u',
  ý:'y',ÿ:'y',
  ñ:'n',ç:'c',ß:'ss',
  // German
  Ä:'ae',Ö:'oe',Ü:'ue',
  // Polish
  ł:'l',ś:'s',ź:'z',ż:'z',ć:'c',ń:'n',ó:'o',ą:'a',ę:'e',
  // Turkish
  ğ:'g',ş:'s',ı:'i',
  // Nordic
  þ:'th',ð:'d',
  // French
  œ:'oe',
  // Symbols
  '&':'and','@':'at','%':'percent','#':'',
  '$':'','!':'','?':'','(':''  ,')':'',
  '[':'',']':'','{':'','}':'',
  '|':'','^':'','~':'','`':'',
  '*':'','=':'','<':'','>':'',
  '+':'','\\':'','\/':'','"':'',
  '\'':'',',':'','…':'',
};

function transliterate(str) {
  return str
    .split('')
    .map(c => (CHAR_MAP[c] !== undefined ? CHAR_MAP[c] : c))
    .join('');
}

function generateSlug(input, { separator = '-', lowercase = true, removeStopwords = false, maxLength = 0 }) {
  if (!input.trim()) return '';

  const STOPWORDS = ['a','an','the','and','or','but','in','on','at','to','for',
    'of','with','by','from','is','it','as','be','was','are','were'];

  let slug = transliterate(input);

  // lowercase first (needed for stopword matching)
  slug = slug.toLowerCase();

  // Remove stopwords if enabled
  if (removeStopwords) {
    const words = slug.split(/\s+/);
    const filtered = words.filter(w => !STOPWORDS.includes(w.replace(/[^a-z]/g, '')));
    slug = filtered.length > 0 ? filtered.join(' ') : slug;
  }

  // Restore casing if not lowercase
  if (!lowercase) {
    // capitalize each word
    slug = input
      .split(/\s+/)
      .map((w, i) => {
        const clean = transliterate(w).replace(/[^a-zA-Z0-9]/g, '');
        return clean;
      })
      .filter(Boolean)
      .join(separator);

    if (maxLength > 0) slug = slug.slice(0, maxLength).replace(new RegExp(`\\${separator}$`), '');
    return slug;
  }

  // Replace any non-alphanumeric (except already-replaced) with separator
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')   // remove remaining special chars
    .trim()
    .replace(/[\s-]+/g, separator)   // spaces & dashes → separator
    .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), ''); // trim separators

  // Max length
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
    // Don't end on a separator
    slug = slug.replace(new RegExp(`\\${separator}+$`), '');
  }

  return slug;
}

// ── PRESETS ──
const PRESETS = [
  { label: 'Blog Post',    text: 'How to Build a Modern Web App with Next.js and Tailwind CSS' },
  { label: 'Product',      text: 'Premium Wireless Noise-Cancelling Headphones — Studio Edition' },
  { label: 'Category',     text: 'Web Design & Development Tools for Professionals' },
  { label: 'News Article', text: 'Breaking: Scientists Discover New Species in Amazon Rainforest!' },
];

export default function TextToSlug() {
  const [input,           setInput]          = useState('');
  const [separator,       setSeparator]      = useState('-');
  const [lowercase,       setLowercase]      = useState(true);
  const [removeStopwords, setRemoveStopwords]= useState(false);
  const [maxLength,       setMaxLength]      = useState(0);
  const [copiedIndex,     setCopiedIndex]    = useState(null);

  // Generate slug + variants
  const slug = generateSlug(input, { separator, lowercase, removeStopwords, maxLength });

  // Always show — (hyphen) variant as primary if separator is something else
  const slugHyphen    = generateSlug(input, { separator: '-',  lowercase, removeStopwords, maxLength });
  const slugUnderscore= generateSlug(input, { separator: '_',  lowercase, removeStopwords, maxLength });
  const slugDot       = generateSlug(input, { separator: '.',  lowercase, removeStopwords, maxLength });
  const slugNone      = generateSlug(input, { separator: '',   lowercase, removeStopwords, maxLength });

  const variants = [
    { key: 'hyphen',     label: 'Hyphen (URL)',     value: slugHyphen,     example: 'my-page-title'  },
    { key: 'underscore', label: 'Underscore (File)', value: slugUnderscore, example: 'my_page_title'  },
    { key: 'dot',        label: 'Dot (Domain)',      value: slugDot,        example: 'my.page.title'  },
    { key: 'none',       label: 'No separator',      value: slugNone,       example: 'mypagetitle'    },
  ];

  const copyValue = useCallback((key, value) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleReset = () => {
    setInput('');
    setSeparator('-');
    setLowercase(true);
    setRemoveStopwords(false);
    setMaxLength(0);
    setCopiedIndex(null);
  };

  const wordCount = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
  const slugLen   = slug.length;

  const faqs = [
    { q: 'What is a URL slug?',                             a: 'A URL slug is the part of a web address that identifies a specific page in a human-readable form. For example, in "example.com/blog/my-first-post", the slug is "my-first-post". It should be short, descriptive, and use only lowercase letters, numbers, and hyphens.' },
    { q: 'Why should slugs use hyphens instead of spaces?', a: 'Spaces in URLs are encoded as "%20" which looks ugly and can break in some systems. Hyphens are the standard separator recommended by Google and all major search engines. They are readable, SEO-friendly, and universally compatible.' },
    { q: 'Does this tool handle special characters?',       a: 'Yes — it automatically converts accented characters (é → e, ü → ue, ñ → n), replaces symbols like & with "and", and strips characters that are not URL-safe. This ensures your slug works correctly in all browsers and systems.' },
    { q: 'What are stopwords and should I remove them?',    a: 'Stopwords are common words like "a", "the", "and", "or", "in" that add little meaning to a URL. Removing them makes slugs shorter and more keyword-focused. For example, "the best tools for the web" becomes "best-tools-web". This is optional and depends on your preference.' },
    { q: 'What is the ideal slug length for SEO?',         a: 'Google recommends keeping URLs short and descriptive. Aim for 3–5 meaningful words. Very long slugs get truncated in search results. Use the Max Length option to automatically cap your slug at a specific character count.' },
    { q: 'Can I use this for WordPress, Shopify or other CMS?', a: 'Yes — the output is a clean slug compatible with WordPress, Shopify, Webflow, Ghost, and any other CMS. Just copy the hyphen variant and paste it into the "Slug" or "Permalink" field in your CMS.' },
    { q: 'What is the difference between slug separators?', a: 'Hyphens are best for URLs and SEO (blog posts, pages). Underscores are common in filenames and Python/database conventions. Dots are used in domain-style naming. No separator creates a single concatenated string used in some coding conventions.' },
    { q: 'Is my text stored or sent anywhere?',            a: 'No — all slug generation happens instantly in your browser with JavaScript. Nothing is sent to any server. Your text stays completely private.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-slug"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert Text to a URL Slug Online for Free',
            description: 'Instantly convert any title or text into a clean, SEO-friendly URL slug using the free ConvertLinx Text to Slug Generator.',
            url: 'https://convertlinx.com/text-to-slug',
            totalTime: 'PT5S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'A page title or text string' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Text to Slug Generator' }],
            step: [
              { '@type': 'HowToStep', name: 'Enter your text',       text: 'Type or paste a page title, product name, or any text into the input box.' },
              { '@type': 'HowToStep', name: 'Adjust options',        text: 'Choose separator style, toggle lowercase, remove stopwords, or set max length.' },
              { '@type': 'HowToStep', name: 'Copy your slug',        text: 'Click Copy next to any slug variant and paste it into your CMS, code, or URL.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-slug"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',                   item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Text to Slug Generator', item: 'https://convertlinx.com/text-to-slug' },
            ],
          }),
        }}
      />

      <main className="slug-page">

        {/* ── HERO ── */}
        <section className="slug-hero">
          <div className="slug-blob-1" />
          <div className="slug-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="slug-breadcrumb-link">Home</a>
              <span className="slug-breadcrumb-sep">/</span>
              <span className="slug-breadcrumb-current">Text to Slug Generator</span>
            </div>
            <span className="slug-badge">SEO Tool</span>
            <h1 className="slug-hero-title">
              Free <span className="slug-grad-text">Text to Slug</span> Generator
            </h1>
            <p className="slug-hero-sub">
              Convert any title or text into a clean, SEO-friendly URL slug instantly.
              Supports special characters, multiple separator styles, stopword removal,
              and max length. No signup, 100% browser-based.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="slug-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto slug-fade-up">

            {/* Stats */}
            {input && (
              <div className="slug-stats-grid">
                {[
                  { label: 'Words',       value: wordCount },
                  { label: 'Slug Length', value: slugLen   },
                  { label: 'Characters',  value: input.length },
                ].map(({ label, value }) => (
                  <div key={label} className="slug-stat-card">
                    <span className="slug-stat-num">{value}</span>
                    <span className="slug-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="slug-tool-card">

              {/* ── INPUT ── */}
              <div className="slug-input-section">
                <div className="slug-input-header">
                  <label className="slug-control-label">Your Text / Title</label>
                  <span className="slug-input-hint">{input.length} chars</span>
                </div>
                <input
                  type="text"
                  className="slug-input"
                  placeholder="e.g. How to Build a Modern Web App with Next.js"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />

                {/* Quick presets */}
                <div className="slug-presets">
                  <span className="slug-presets-label">Try:</span>
                  {PRESETS.map(p => (
                    <button
                      key={p.label}
                      className="slug-preset-btn"
                      onClick={() => setInput(p.text)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── OPTIONS ── */}
              <div className="slug-options-section">
                <label className="slug-control-label mb-3 block">
                  <Settings className="w-3.5 h-3.5 inline mr-1.5" />
                  Options
                </label>
                <div className="slug-options-grid">

                  {/* Separator */}
                  <div className="slug-option-group">
                    <label className="slug-option-label">Separator</label>
                    <div className="slug-sep-tabs">
                      {[
                        { val: '-', display: '— Hyphen'     },
                        { val: '_', display: '_ Underscore' },
                        { val: '.', display: '. Dot'        },
                        { val: '',  display: 'None'         },
                      ].map(({ val, display }) => (
                        <button
                          key={val}
                          className={`slug-sep-tab ${separator === val ? 'active' : ''}`}
                          onClick={() => setSeparator(val)}
                        >
                          {display}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="slug-toggles">
                    {/* Lowercase */}
                    <label className="slug-toggle-label">
                      <button
                        role="switch"
                        aria-checked={lowercase}
                        className={`slug-toggle ${lowercase ? 'on' : 'off'}`}
                        onClick={() => setLowercase(v => !v)}
                      >
                        <span className="slug-toggle-thumb" />
                      </button>
                      <span className="slug-toggle-text">Lowercase</span>
                      <span className="slug-toggle-hint">Recommended for URLs</span>
                    </label>

                    {/* Remove stopwords */}
                    <label className="slug-toggle-label">
                      <button
                        role="switch"
                        aria-checked={removeStopwords}
                        className={`slug-toggle ${removeStopwords ? 'on' : 'off'}`}
                        onClick={() => setRemoveStopwords(v => !v)}
                      >
                        <span className="slug-toggle-thumb" />
                      </button>
                      <span className="slug-toggle-text">Remove Stopwords</span>
                      <span className="slug-toggle-hint">Removes: a, the, and, or…</span>
                    </label>
                  </div>

                  {/* Max Length */}
                  <div className="slug-option-group">
                    <div className="slug-maxlen-header">
                      <label className="slug-option-label">Max Length</label>
                      <span className="slug-maxlen-val">
                        {maxLength === 0 ? 'No limit' : `${maxLength} chars`}
                      </span>
                    </div>
                    <input
                      type="range"
                      className="slug-range"
                      min={0} max={100} step={5}
                      value={maxLength}
                      onChange={e => setMaxLength(Number(e.target.value))}
                    />
                    <div className="slug-range-labels">
                      <span>No limit</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SLUG OUTPUTS ── */}
              <div className="slug-outputs-section">
                <label className="slug-control-label mb-3 block">Generated Slugs</label>
                {input.trim() === '' ? (
                  <div className="slug-output-placeholder">
                    <Link2 className="w-8 h-8 slug-placeholder-icon" />
                    <p>Enter text above to generate your slug</p>
                  </div>
                ) : (
                  <div className="slug-outputs-list">
                    {variants.map(({ key, label, value }) => (
                      <div key={key} className={`slug-output-row ${separator === key.replace('hyphen','-').replace('underscore','_').replace('dot','.').replace('none','') ? 'active' : ''}`}>
                        <div className="slug-output-meta">
                          <span className="slug-output-label">{label}</span>
                          <span className="slug-output-len">{value.length} chars</span>
                        </div>
                        <div className="slug-output-value-row">
                          <code className="slug-output-code">
                            {value || <span className="slug-output-empty">— empty —</span>}
                          </code>
                          <button
                            className={`slug-copy-btn ${copiedIndex === key ? 'copied' : ''}`}
                            onClick={() => copyValue(key, value)}
                            disabled={!value}
                          >
                            {copiedIndex === key
                              ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
                              : <><Copy className="w-3.5 h-3.5" /> Copy</>
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset */}
              {input && (
                <div className="slug-toolbar">
                  <button className="slug-btn slug-btn-ghost" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              )}

              <div className="slug-trust-strip">
                {['No sign-up', 'Instant generation', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="slug-trust-item">
                    <span className="slug-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="slug-divider" />
        <section className="slug-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="slug-section-title text-center mb-12">3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Enter Your Text',    desc: 'Type or paste any page title, product name, blog post heading, or any text string you want to turn into a URL.' },
                { num: '2', title: 'Adjust Options',     desc: 'Pick a separator style, toggle lowercase, optionally remove stopwords, or cap your slug with max length.' },
                { num: '3', title: 'Copy & Paste',       desc: 'Click Copy next to any slug variant and paste it directly into WordPress, Shopify, your codebase, or any CMS.' },
              ].map((s, i) => (
                <div key={i} className="slug-step-card">
                  <div className="slug-step-num">{s.num}</div>
                  <h3 className="slug-card-title font-bold text-base mb-2">{s.title}</h3>
                  <p className="slug-card-desc text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="slug-divider" />
        <section className="slug-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="slug-section-title text-center mb-10">Why Use ConvertLinx Slug Generator?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Link2 className="w-6 h-6" />,
                  color: '#D97706',
                  bg: 'rgba(217,119,6,0.08)',
                  title: '4 Slug Variants at Once',
                  desc: 'Get hyphen, underscore, dot, and no-separator versions simultaneously — pick the right one for your use case.',
                },
                {
                  icon: <Settings className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Smart Special Char Handling',
                  desc: 'Automatically converts accented letters, German umlauts, symbols, and non-ASCII characters to URL-safe equivalents.',
                },
                {
                  icon: <Copy className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'SEO-Optimised Output',
                  desc: 'Stopword removal, max length control, and lowercase enforcement — everything Google recommends for clean URLs.',
                },
              ].map((b, i) => (
                <div key={i} className="slug-benefit-card">
                  <div className="slug-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="slug-card-title font-bold text-base mb-2">{b.title}</h3>
                  <p className="slug-card-desc text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="slug-divider" />
        <section className="slug-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="slug-section-title text-2xl mb-4">What Is a URL Slug and Why Does It Matter for SEO?</h2>
              <p className="slug-body-text leading-7 text-sm">
                A URL slug is the human-readable identifier at the end of a web address. For a blog post titled
                "How to Build a Modern Web App", the ideal slug would be{' '}
                <code className="slug-code">how-to-build-a-modern-web-app</code>. Search engines use slugs to
                understand page content, and clean slugs directly improve click-through rates in search results.
              </p>
              <p className="slug-body-text leading-7 text-sm mt-3">
                Google has explicitly recommended using hyphens over underscores in URLs, keeping slugs short
                and descriptive, and avoiding unnecessary parameters or stop words. Our generator follows all
                of these best practices automatically.
              </p>
            </div>

            <div className="slug-seo-box">
              <h3 className="slug-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Generate WordPress or Shopify post slugs',
                  'Create clean URLs for blog posts and articles',
                  'Convert product names to URL-safe strings',
                  'Generate file or folder names from titles',
                  'Create CSS class names from component names',
                  'Build route paths in Next.js, React or Vue',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="slug-feature-dot" />
                    <span className="slug-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="slug-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Bloggers — create SEO-friendly post URLs',
                  'Developers — generate route paths and IDs',
                  'SEO specialists — optimise permalink structure',
                  'E-commerce owners — clean product page URLs',
                  'Content managers — consistent CMS slugs',
                  'Everyone — anyone building pages for the web',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="slug-arrow font-bold mt-0.5">→</span>
                    <span className="slug-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="slug-seo-box">
              <h3 className="slug-section-subtitle font-bold text-lg mb-4">Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  '4 separator variants — hyphen, underscore, dot, none',
                  'Accented & special character transliteration',
                  'Optional stopword removal (a, the, and…)',
                  'Max length control with slider',
                  'Lowercase toggle — on by default',
                  'Live character & word count',
                  'One-click copy per variant',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="slug-feature-dot" />
                    <span className="slug-body-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="slug-divider" />
        <section className="slug-section-main py-16 px-6">
          <Script
            id="faq-schema-slug"
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
            <h2 className="slug-section-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="slug-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="slug-faq-question font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className="slug-faq-icon w-4 h-4 shrink-0" />
                  </summary>
                  <p className="slug-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="slug-divider" />
        <section className="slug-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="slug-section-title text-center mb-5">You may also find these free tools helpful</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Word Counter',   href: '/word-counter'   },
                { name: 'Case Converter', href: '/case-converter' },
                { name: 'Lorem Ipsum',    href: '/lorem-ipsum'    },
                { name: 'Color Picker',   href: '/color-picker'   },
                { name: 'JSON Formatter', href: '/json-formatter' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border slug-related-link"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="slug-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to generate your slug?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="slug-cta-btn"
            >
              <Link2 className="w-5 h-5" />
              Generate Slug
            </button>
          </div>
        </section>

      </main>
    </>
  );
}