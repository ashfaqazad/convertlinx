'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, Tag, Search, Share2, Globe } from 'lucide-react';
import Script from 'next/script';
import '@/styles/MetaTagGenerator.css';
import Link from 'next/link';

// ── CHARACTER LIMITS ──
const LIMITS = {
  title:       { soft: 60,  hard: 70  },
  description: { soft: 155, hard: 160 },
  ogTitle:     { soft: 60,  hard: 95  },
  ogDesc:      { soft: 155, hard: 200 },
  twitterTitle:{ soft: 60,  hard: 70  },
  twitterDesc: { soft: 155, hard: 160 },
};

function CharBar({ value, field }) {
  const len   = value.length;
  const soft  = LIMITS[field]?.soft  || 160;
  const hard  = LIMITS[field]?.hard  || 200;
  const pct   = Math.min((len / hard) * 100, 100);
  const color = len > hard ? 'over' : len > soft ? 'warn' : 'ok';
  return (
    <div className="mtg-char-wrap">
      <div className="mtg-char-bar">
        <div className={`mtg-char-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`mtg-char-count ${color}`}>{len} / {soft}</span>
    </div>
  );
}

export default function MetaTagGenerator() {
  // ── FORM STATE ──
  const [title,         setTitle]         = useState('');
  const [description,   setDescription]   = useState('');
  const [keywords,      setKeywords]       = useState('');
  const [author,        setAuthor]         = useState('');
  const [robots,        setRobots]         = useState('index, follow');
  const [canonical,     setCanonical]      = useState('');
  const [ogTitle,       setOgTitle]        = useState('');
  const [ogDesc,        setOgDesc]         = useState('');
  const [ogImage,       setOgImage]        = useState('');
  const [ogUrl,         setOgUrl]          = useState('');
  const [ogType,        setOgType]         = useState('website');
  const [twCard,        setTwCard]         = useState('summary_large_image');
  const [twTitle,       setTwTitle]        = useState('');
  const [twDesc,        setTwDesc]         = useState('');
  const [twImage,       setTwImage]        = useState('');
  const [twSite,        setTwSite]         = useState('');
  const [copied,        setCopied]         = useState(false);
  const [activeTab,     setActiveTab]      = useState('basic'); // basic | og | twitter

  // ── GENERATE OUTPUT ──
  const lines = [];

  // Basic
  if (title)       lines.push(`<title>${title}</title>`);
  if (description) lines.push(`<meta name="description" content="${description}">`);
  if (keywords)    lines.push(`<meta name="keywords" content="${keywords}">`);
  if (author)      lines.push(`<meta name="author" content="${author}">`);
  if (robots)      lines.push(`<meta name="robots" content="${robots}">`);
  if (canonical)   lines.push(`<link rel="canonical" href="${canonical}">`);

  // Open Graph
  const effectiveOgTitle = ogTitle || title;
  const effectiveOgDesc  = ogDesc  || description;
  if (effectiveOgTitle) lines.push(`<meta property="og:title" content="${effectiveOgTitle}">`);
  if (effectiveOgDesc)  lines.push(`<meta property="og:description" content="${effectiveOgDesc}">`);
  if (ogImage)          lines.push(`<meta property="og:image" content="${ogImage}">`);
  if (ogUrl)            lines.push(`<meta property="og:url" content="${ogUrl}">`);
  if (ogType)           lines.push(`<meta property="og:type" content="${ogType}">`);

  // Twitter
  if (twCard)                         lines.push(`<meta name="twitter:card" content="${twCard}">`);
  if (twTitle || title)               lines.push(`<meta name="twitter:title" content="${twTitle || title}">`);
  if (twDesc  || description)         lines.push(`<meta name="twitter:description" content="${twDesc || description}">`);
  if (twImage || ogImage)             lines.push(`<meta name="twitter:image" content="${twImage || ogImage}">`);
  if (twSite)                         lines.push(`<meta name="twitter:site" content="${twSite}">`);

  const output = lines.join('\n');

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTitle(''); setDescription(''); setKeywords(''); setAuthor('');
    setRobots('index, follow'); setCanonical('');
    setOgTitle(''); setOgDesc(''); setOgImage(''); setOgUrl(''); setOgType('website');
    setTwCard('summary_large_image'); setTwTitle(''); setTwDesc(''); setTwImage(''); setTwSite('');
    setCopied(false);
  };

  // ── GOOGLE PREVIEW ──
  const previewTitle = title || 'Your Page Title Here';
  const previewDesc  = description || 'Your meta description will appear here. Write a clear summary of the page content to improve click-through rates from search results.';
  const previewUrl   = canonical || ogUrl || 'https://yourwebsite.com/page';

  const faqs = [
    { q: 'What are meta tags and why do they matter?',         a: 'Meta tags are HTML snippets placed in the <head> section of a page. They tell search engines and social platforms what your page is about, affecting how it ranks and how it appears when shared.' },
    { q: 'How long should a meta title be?',                   a: 'Keep your meta title under 60 characters. Google typically displays the first 50–60 characters. Titles longer than 60 characters may be cut off in search results.' },
    { q: 'How long should a meta description be?',            a: 'Keep descriptions between 120–155 characters. Google shows roughly 155–160 characters in desktop results. Anything longer will be truncated with an ellipsis.' },
    { q: 'What are Open Graph tags?',                          a: 'Open Graph (og:) tags control how your page appears when shared on Facebook, LinkedIn, and other platforms. They set the title, description, and preview image for social shares.' },
    { q: 'What are Twitter Card tags?',                        a: 'Twitter Card tags control how your page appears when shared on Twitter/X. "summary_large_image" shows a large image preview, while "summary" shows a smaller thumbnail.' },
    { q: 'What does robots "index, follow" mean?',             a: '"index" tells search engines to include the page in results. "follow" tells them to follow links on the page. Use "noindex, nofollow" for pages you want to hide from search.' },
    { q: 'What is a canonical URL?',                           a: 'A canonical tag tells search engines which URL is the "official" version of a page. Use it to prevent duplicate content issues when the same content is accessible via multiple URLs.' },
    { q: 'Do keywords meta tags still matter for SEO?',       a: 'Google has ignored the keywords meta tag since 2009. However, some other search engines still read it, and it is harmless to include relevant keywords.' },
    { q: 'Where do I paste the generated code?',               a: 'Copy the generated tags and paste them inside the <head>...</head> section of your HTML file, or into the head section of your CMS, theme settings, or Next.js layout file.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-mtg"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Generate Meta Tags Online for Free',
            description: 'Learn how to instantly generate SEO meta tags, Open Graph tags, and Twitter Card tags using the free ConvertLinx Meta Tag Generator.',
            url: 'https://convertlinx.com/meta-tag-generator',
            totalTime: 'PT2M',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Your page title, description, and URL' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Meta Tag Generator' }],
            step: [
              { '@type': 'HowToStep', name: 'Fill in Basic SEO fields', text: 'Enter your page title, meta description, keywords, author, robots setting, and canonical URL.' },
              { '@type': 'HowToStep', name: 'Set Open Graph and Twitter tags', text: 'Switch to the Open Graph and Twitter Card tabs to configure social sharing previews.' },
              { '@type': 'HowToStep', name: 'Copy and paste', text: 'Click Copy All Tags and paste the generated HTML into the <head> section of your page.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-mtg"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',               item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Meta Tag Generator', item: 'https://convertlinx.com/meta-tag-generator' },
            ],
          }),
        }}
      />

      <main className="mtg-page">

        {/* ── HERO ── */}
        <section className="mtg-hero">
          <div className="mtg-blob-1" />
          <div className="mtg-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="mtg-breadcrumb-link">Home</a>
              <span className="mtg-breadcrumb-sep">/</span>
              <span className="mtg-breadcrumb-current">Meta Tag Generator</span>
            </div>
            <span className="mtg-badge">SEO Tool</span>
            <h1 className="mtg-hero-title">
              Free <span className="mtg-grad-text">Meta Tag Generator</span>
            </h1>
            <p className="mtg-hero-sub">
              Generate SEO meta tags, Open Graph tags, and Twitter Card tags instantly.
              Fill in the fields, preview your Google snippet, and copy the code — no signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="mtg-section-main py-10 px-6">
          <div className="max-w-5xl mx-auto mtg-fade-up">
            <div className="mtg-layout">

              {/* ── LEFT: FORM ── */}
              <div className="mtg-form-col">

                {/* Tab switcher */}
                <div className="mtg-tabs">
                  {[
                    { key: 'basic',   label: 'Basic SEO',    icon: <Search className="w-3.5 h-3.5" /> },
                    { key: 'og',      label: 'Open Graph',   icon: <Share2  className="w-3.5 h-3.5" /> },
                    { key: 'twitter', label: 'Twitter Card', icon: <Globe   className="w-3.5 h-3.5" /> },
                  ].map(t => (
                    <button
                      key={t.key}
                      className={`mtg-tab ${activeTab === t.key ? 'active' : ''}`}
                      onClick={() => setActiveTab(t.key)}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                <div className="mtg-tool-card">

                  {/* ── BASIC SEO TAB ── */}
                  {activeTab === 'basic' && (
                    <div className="mtg-fields">
                      <div className="mtg-field">
                        <label className="mtg-label">Page Title <span className="mtg-required">*</span></label>
                        <input
                          className="mtg-input"
                          type="text"
                          placeholder="e.g. Free JSON Formatter — ConvertLinx"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                        />
                        <CharBar value={title} field="title" />
                      </div>

                      <div className="mtg-field">
                        <label className="mtg-label">Meta Description <span className="mtg-required">*</span></label>
                        <textarea
                          className="mtg-textarea"
                          rows={3}
                          placeholder="e.g. Format, validate, and minify JSON instantly in your browser. Free, no signup required."
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                        />
                        <CharBar value={description} field="description" />
                      </div>

                      <div className="mtg-field">
                        <label className="mtg-label">Keywords <span className="mtg-hint">(comma separated)</span></label>
                        <input
                          className="mtg-input"
                          type="text"
                          placeholder="e.g. json formatter, json validator, online tool"
                          value={keywords}
                          onChange={e => setKeywords(e.target.value)}
                        />
                      </div>

                      <div className="mtg-row">
                        <div className="mtg-field">
                          <label className="mtg-label">Author</label>
                          <input
                            className="mtg-input"
                            type="text"
                            placeholder="e.g. Ashfaque Ahmed"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                          />
                        </div>
                        <div className="mtg-field">
                          <label className="mtg-label">Robots</label>
                          <select
                            className="mtg-select"
                            value={robots}
                            onChange={e => setRobots(e.target.value)}
                          >
                            <option value="index, follow">index, follow</option>
                            <option value="noindex, follow">noindex, follow</option>
                            <option value="index, nofollow">index, nofollow</option>
                            <option value="noindex, nofollow">noindex, nofollow</option>
                          </select>
                        </div>
                      </div>

                      <div className="mtg-field">
                        <label className="mtg-label">Canonical URL</label>
                        <input
                          className="mtg-input"
                          type="url"
                          placeholder="https://convertlinx.com/json-formatter"
                          value={canonical}
                          onChange={e => setCanonical(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── OPEN GRAPH TAB ── */}
                  {activeTab === 'og' && (
                    <div className="mtg-fields">
                      <p className="mtg-tab-note">
                        Open Graph tags control how your page looks when shared on <strong>Facebook, LinkedIn</strong>, and other platforms. Leave blank to reuse your Basic SEO values.
                      </p>

                      <div className="mtg-field">
                        <label className="mtg-label">OG Title <span className="mtg-hint">(defaults to page title)</span></label>
                        <input
                          className="mtg-input"
                          type="text"
                          placeholder={title || 'Inherits from Page Title'}
                          value={ogTitle}
                          onChange={e => setOgTitle(e.target.value)}
                        />
                        <CharBar value={ogTitle || title} field="ogTitle" />
                      </div>

                      <div className="mtg-field">
                        <label className="mtg-label">OG Description <span className="mtg-hint">(defaults to meta description)</span></label>
                        <textarea
                          className="mtg-textarea"
                          rows={3}
                          placeholder={description || 'Inherits from Meta Description'}
                          value={ogDesc}
                          onChange={e => setOgDesc(e.target.value)}
                        />
                        <CharBar value={ogDesc || description} field="ogDesc" />
                      </div>

                      <div className="mtg-field">
                        <label className="mtg-label">OG Image URL</label>
                        <input
                          className="mtg-input"
                          type="url"
                          placeholder="https://yoursite.com/og-image.jpg  (1200×630px recommended)"
                          value={ogImage}
                          onChange={e => setOgImage(e.target.value)}
                        />
                      </div>

                      <div className="mtg-row">
                        <div className="mtg-field">
                          <label className="mtg-label">OG URL</label>
                          <input
                            className="mtg-input"
                            type="url"
                            placeholder="https://yoursite.com/page"
                            value={ogUrl}
                            onChange={e => setOgUrl(e.target.value)}
                          />
                        </div>
                        <div className="mtg-field">
                          <label className="mtg-label">OG Type</label>
                          <select
                            className="mtg-select"
                            value={ogType}
                            onChange={e => setOgType(e.target.value)}
                          >
                            <option value="website">website</option>
                            <option value="article">article</option>
                            <option value="product">product</option>
                            <option value="video.movie">video</option>
                            <option value="music.song">music</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TWITTER CARD TAB ── */}
                  {activeTab === 'twitter' && (
                    <div className="mtg-fields">
                      <p className="mtg-tab-note">
                        Twitter Card tags control how your page looks when shared on <strong>Twitter / X</strong>. Leave blank to reuse your Basic SEO and Open Graph values.
                      </p>

                      <div className="mtg-field">
                        <label className="mtg-label">Card Type</label>
                        <select
                          className="mtg-select"
                          value={twCard}
                          onChange={e => setTwCard(e.target.value)}
                        >
                          <option value="summary_large_image">Summary Large Image (recommended)</option>
                          <option value="summary">Summary (small thumbnail)</option>
                          <option value="app">App Card</option>
                          <option value="player">Player Card</option>
                        </select>
                      </div>

                      <div className="mtg-field">
                        <label className="mtg-label">Twitter Title <span className="mtg-hint">(defaults to page title)</span></label>
                        <input
                          className="mtg-input"
                          type="text"
                          placeholder={title || 'Inherits from Page Title'}
                          value={twTitle}
                          onChange={e => setTwTitle(e.target.value)}
                        />
                        <CharBar value={twTitle || title} field="twitterTitle" />
                      </div>

                      <div className="mtg-field">
                        <label className="mtg-label">Twitter Description <span className="mtg-hint">(defaults to meta description)</span></label>
                        <textarea
                          className="mtg-textarea"
                          rows={3}
                          placeholder={description || 'Inherits from Meta Description'}
                          value={twDesc}
                          onChange={e => setTwDesc(e.target.value)}
                        />
                        <CharBar value={twDesc || description} field="twitterDesc" />
                      </div>

                      <div className="mtg-row">
                        <div className="mtg-field">
                          <label className="mtg-label">Twitter Image URL <span className="mtg-hint">(defaults to OG image)</span></label>
                          <input
                            className="mtg-input"
                            type="url"
                            placeholder={ogImage || 'https://yoursite.com/twitter-image.jpg'}
                            value={twImage}
                            onChange={e => setTwImage(e.target.value)}
                          />
                        </div>
                        <div className="mtg-field">
                          <label className="mtg-label">Twitter @username</label>
                          <input
                            className="mtg-input"
                            type="text"
                            placeholder="@convertlinx"
                            value={twSite}
                            onChange={e => setTwSite(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* ── RIGHT: OUTPUT + PREVIEW ── */}
              <div className="mtg-output-col">

                {/* Google Search Preview */}
                <div className="mtg-preview-card">
                  <p className="mtg-preview-label">
                    <Search className="w-3.5 h-3.5" /> Google Search Preview
                  </p>
                  <div className="mtg-google-preview">
                    <p className="mtg-gp-url">{previewUrl}</p>
                    <p className="mtg-gp-title">{previewTitle.slice(0, 60)}{previewTitle.length > 60 ? '...' : ''}</p>
                    <p className="mtg-gp-desc">{previewDesc.slice(0, 155)}{previewDesc.length > 155 ? '...' : ''}</p>
                  </div>
                </div>

                {/* Generated Code */}
                <div className="mtg-code-card">
                  <div className="mtg-code-head">
                    <span className="mtg-code-label">
                      <Tag className="w-3.5 h-3.5" /> Generated Tags
                      {lines.length > 0 && <span className="mtg-tag-count">{lines.length} tags</span>}
                    </span>
                    <div className="flex gap-2">
                      <button className="mtg-btn-sm mtg-btn-ghost" onClick={handleReset}>Reset</button>
                      <button
                        className={`mtg-btn-sm ${copied ? 'mtg-btn-copied' : 'mtg-btn-copy'}`}
                        onClick={handleCopy}
                        disabled={!output}
                      >
                        {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
                      </button>
                    </div>
                  </div>
                  <pre className="mtg-code-output">
                    {output || '<title>Your Page Title</title>\n<meta name="description" content="...">\n<!-- Fill in the fields to generate tags -->'}
                  </pre>
                </div>

                <div className="mtg-trust-strip">
                  {['No sign-up', 'Instant output', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                    <span key={i} className="mtg-trust-item">
                      <span className="mtg-trust-dot" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="mtg-divider" />
        <section className="mtg-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="mtg-section-title text-center mb-12">3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Fill in Basic SEO',       desc: 'Enter your page title and meta description. Add keywords, author, robots setting, and canonical URL as needed.' },
                { num: '2', title: 'Set Social Tags',          desc: 'Switch to Open Graph and Twitter Card tabs to control how your page looks when shared on social media.' },
                { num: '3', title: 'Copy & Paste to Head',    desc: 'Click Copy All Tags and paste the generated HTML inside the <head> section of your page or layout file.' },
              ].map((s, i) => (
                <div key={i} className="mtg-step-card">
                  <div className="mtg-step-num">{s.num}</div>
                  <h3 className="mtg-card-title font-bold text-base mb-2">{s.title}</h3>
                  <p className="mtg-card-desc text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="mtg-divider" />
        <section className="mtg-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="mtg-section-title text-center mb-10">Why Use ConvertLinx Meta Tag Generator?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Search className="w-6 h-6" />,
                  color: '#DC2626',
                  bg: 'rgba(220,38,38,0.08)',
                  title: 'SEO + Social in One Place',
                  desc: 'Generate Basic SEO tags, Open Graph tags, and Twitter Cards all in one tool — no switching between multiple generators.',
                },
                {
                  icon: <Tag className="w-6 h-6" />,
                  color: '#B45309',
                  bg: 'rgba(180,83,9,0.08)',
                  title: 'Live Character Counters',
                  desc: 'Colour-coded character bars warn you when titles or descriptions are too long — before you paste into your site.',
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Google Snippet Preview',
                  desc: 'See a live preview of how your page will look in Google search results as you type — no guessing required.',
                },
              ].map((b, i) => (
                <div key={i} className="mtg-benefit-card">
                  <div className="mtg-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="mtg-card-title font-bold text-base mb-2">{b.title}</h3>
                  <p className="mtg-card-desc text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="mtg-divider" />
        <section className="mtg-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="mtg-section-title text-2xl mb-4">What Are Meta Tags and Why Do They Matter?</h2>
              <p className="mtg-body-text leading-7 text-sm">
                Meta tags are short HTML snippets placed in the head section of a webpage. They are invisible
                to visitors but critical for search engines and social media platforms. A well-written meta
                title and description directly influence how often people click on your page in search results —
                even before Google decides where to rank it.
              </p>
              <p className="mtg-body-text leading-7 text-sm mt-3">
                Open Graph and Twitter Card tags extend this further — they control the image, title, and
                description that appear when anyone shares your link on Facebook, LinkedIn, Twitter, or
                messaging apps. Without them, social platforms guess what to show, often with poor results.
              </p>
            </div>

            <div className="mtg-seo-box">
              <h3 className="mtg-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Generate meta tags for every page of your website',
                  'Set Open Graph tags before sharing on LinkedIn',
                  'Add Twitter Cards to blog posts and articles',
                  'Fix missing or broken social preview images',
                  'Set canonical URLs to avoid duplicate content',
                  'Configure robots settings for private or staging pages',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="mtg-feature-dot" />
                    <span className="mtg-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mtg-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Web developers — generate head tags for new pages',
                  'SEO professionals — audit and fix meta tags fast',
                  'Bloggers — optimise posts for search and social',
                  'Marketing teams — control social sharing previews',
                  'Freelancers — deliver SEO-ready pages to clients',
                  'Everyone — anyone building or managing a website',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="mtg-arrow font-bold mt-0.5">→</span>
                    <span className="mtg-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mtg-seo-box">
              <h3 className="mtg-section-subtitle font-bold text-lg mb-4">Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Basic SEO: title, description, keywords, author',
                  'Robots and canonical URL support',
                  'Open Graph tags for Facebook and LinkedIn',
                  'Twitter Card tags for Twitter / X',
                  'Live Google search snippet preview',
                  'Colour-coded character limit indicators',
                  'Smart defaults — OG and Twitter inherit Basic values',
                  'One-click copy of all generated tags',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="mtg-feature-dot" />
                    <span className="mtg-body-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="mtg-divider" />
        <section className="mtg-section-main py-16 px-6">
          <Script
            id="faq-schema-mtg"
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
            <h2 className="mtg-section-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="mtg-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="mtg-faq-question font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className="mtg-faq-icon w-4 h-4 shrink-0" />
                  </summary>
                  <p className="mtg-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="mtg-divider" />
        <section className="mtg-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="mtg-section-title text-center mb-5">You may also find these free tools helpful</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Word Counter',     href: '/word-counter'    },
                { name: 'JSON Formatter',   href: '/json-formatter'  },
                { name: 'Case Converter',   href: '/case-converter'  },
                { name: 'Lorem Ipsum',      href: '/lorem-ipsum'     },
                { name: 'Base64 Encoder',   href: '/base64'          },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border mtg-related-link"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="mtg-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to generate your meta tags?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 minutes. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mtg-cta-btn"
            >
              <Tag className="w-5 h-5" />
              Generate Meta Tags
            </button>
          </div>
        </section>

      </main>
    </>
  );
}