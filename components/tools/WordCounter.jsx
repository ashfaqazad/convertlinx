'use client';

import { useState, useCallback } from 'react';
import { Type, FileText, Clock, AlignLeft, Hash, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/WordCounter.css';
import Link from 'next/link';

export default function WordCounter() {
  const [text, setText] = useState('');

  // ── STATS ──
  const words      = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars      = text.length;
  const charsNoSp  = text.replace(/\s/g, '').length;
  const sentences  = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readTime   = Math.max(1, Math.ceil(words / 200));

  // ── KEYWORD DENSITY ──
  const getKeywords = useCallback(() => {
    if (!text.trim()) return [];
    const stopWords = new Set([
      'the','a','an','is','it','in','on','at','to','of','and','or','but','for',
      'with','that','this','as','be','was','are','were','by','from','have','has',
      'had','not','do','did','will','would','could','should','may','might','shall',
      'can','i','you','he','she','we','they','me','him','her','us','them','my',
      'your','his','our','their','its','what','which','who','when','where','how',
      'all','been','if','so','no','up','out','about','into','than','then','there',
      'these','those','such','more','some','also','just','like','well','back','get',
      'go','one','two','new','other','time','year','way','day','man','woman',
    ]);
    const freq = {};
    text.toLowerCase().match(/\b[a-z]{3,}\b/g)?.forEach(w => {
      if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [text]);

  const keywords = getKeywords();

  const handleCopy = () => { if (text) navigator.clipboard.writeText(text); };
  const handleClear = () => setText('');

  const faqs = [
    { q: 'Is this word counter free to use?', a: 'Yes — completely free with no signup required. Count unlimited text as many times as you need.' },
    { q: 'Does it count characters with or without spaces?', a: 'Both. The tool shows total characters including spaces and separately without spaces so you can check for any platform limit.' },
    { q: 'What is reading time based on?', a: 'Reading time is calculated at 200 words per minute, which is a standard reading speed. It gives you a good estimate for articles, essays, and blog posts.' },
    { q: 'Does the word counter work offline?', a: 'Yes — everything runs entirely in your browser. No internet connection is needed after the page loads. Your text never leaves your device.' },
    { q: 'Can I use this for essays or assignments?', a: 'Absolutely. Students use this tool regularly to check word limits for school essays, college applications, and research papers.' },
    { q: 'Does it count sentence and paragraph numbers?', a: 'Yes — the tool automatically counts sentences (split by punctuation) and paragraphs (split by blank lines) so you get a full breakdown.' },
    { q: 'Is my text stored anywhere?', a: 'No — your text is never sent to any server. Everything is processed locally inside your browser. Full privacy guaranteed.' },
    { q: 'Does it work on mobile?', a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops. The layout adapts cleanly to any screen size.' },
    { q: 'What is keyword density?', a: 'Keyword density shows which words appear most frequently in your text. It is useful for writers and SEO professionals to check if a topic is covered well.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-wc"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Count Words Online for Free',
            description:
              'Learn how to instantly count words, characters, sentences, paragraphs and reading time in any text using the free ConvertLinx Word Counter.',
            url: 'https://convertlinx.com/word-counter',
            totalTime: 'PT10S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Any text, essay, article, or document content' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Word Counter' }],
            step: [
              { '@type': 'HowToStep', name: 'Paste or type your text', text: 'Type or paste any text into the input box — essays, articles, blog posts, assignments, or any other content.' },
              { '@type': 'HowToStep', name: 'View live stats', text: 'Word count, character count, sentence count, paragraph count and reading time update automatically as you type.' },
              { '@type': 'HowToStep', name: 'Check keyword density', text: 'Scroll down to see your top keywords and how often each one appears — useful for SEO and content writing.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-wc"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Word Counter', item: 'https://convertlinx.com/word-counter' },
            ],
          }),
        }}
      />

      <main className="wc-page">

        {/* ── HERO ── */}
        <section className="wc-hero">
          <div className="wc-blob-1" />
          <div className="wc-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="wc-breadcrumb-link">Home</a>
              <span style={{ color: '#93C5FD' }}>/</span>
              <span style={{ color: '#2563EB' }}>Word Counter</span>
            </div>
            <span className="wc-badge">Writing Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Free Online <span className="wc-grad-text">Word Counter</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Count words, characters, sentences, paragraphs and reading time instantly — for essays,
              blog posts, assignments, social captions, and any other writing. No signup, no limits,
              100% browser-based. Your text never leaves your device.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="wc-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto wc-fade-up">

            {/* Stats Grid */}
            <div className="wc-stats-grid">
              {[
                { label: 'Words',       value: words },
                { label: 'Characters',  value: chars },
                { label: 'No Spaces',   value: charsNoSp },
                { label: 'Sentences',   value: sentences },
                { label: 'Paragraphs',  value: paragraphs },
                { label: 'Read Time',   value: `${readTime} min` },
              ].map(({ label, value }) => (
                <div key={label} className="wc-stat-card">
                  <span className="wc-stat-num">{value}</span>
                  <span className="wc-stat-label">{label}</span>
                </div>
              ))}
            </div>

            <div className="wc-tool-card">
              <label className="block mb-3" style={{ color: '#2563EB', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Type or Paste Your Text
              </label>

              <textarea
                className="wc-textarea"
                placeholder="Start typing or paste your text here — word count updates live as you write…"
                value={text}
                onChange={e => setText(e.target.value)}
              />

              <div className="wc-toolbar">
                <button className="wc-btn wc-btn-ghost" onClick={handleClear}>Clear</button>
                <button className="wc-btn wc-btn-ghost" onClick={handleCopy}>Copy Text</button>
              </div>

              {/* Keyword Density */}
              {keywords.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#2563EB', marginBottom: '4px' }}>
                    Keyword Density
                  </p>
                  <div className="wc-kw-list">
                    {keywords.map(([word, count]) => (
                      <div key={word} className="wc-kw-chip">
                        {word}
                        <span className="wc-kw-count">{count}×</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No sign-up', 'Live count', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="wc-trust-item">
                    <span className="wc-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="wc-divider" />
        <section className="wc-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Paste Your Text',     desc: 'Type directly or paste any content — essays, articles, captions, code comments, anything.' },
                { num: '2', title: 'Stats Update Live',   desc: 'Word count, characters, sentences, paragraphs and reading time all update automatically as you type.' },
                { num: '3', title: 'Check Keywords',      desc: 'Scroll down in the tool to see your top keywords and frequency — useful for SEO and content checks.' },
              ].map((s, i) => (
                <div key={i} className="wc-step-card">
                  <div className="wc-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="wc-divider" />
        <section className="wc-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx Word Counter?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Type className="w-6 h-6" />,
                  color: '#2563EB',
                  bg: 'rgba(37,99,235,0.08)',
                  title: 'Instant Live Counting',
                  desc: 'No button to click. Word count, character count and all stats update in real time as you type or paste — zero delay.',
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Full Text Breakdown',
                  desc: 'Get words, characters (with and without spaces), sentences, paragraphs, and estimated reading time all in one place.',
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Reading Time Estimate',
                  desc: 'Instantly know how long your article or essay will take to read — great for blog writers, journalists, and content creators.',
                },
              ].map((b, i) => (
                <div key={i} className="wc-benefit-card">
                  <div className="wc-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="wc-divider" />
        <section className="wc-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why Word Count Matters
              </h2>
              <p className="leading-7 text-sm">
                Whether you are writing a college essay, a blog post, a Twitter thread, or a professional
                report — word count matters. Most platforms and assignments have specific limits, and
                going over or under can affect your grade, reach, or clarity.
              </p>
              <p className="leading-7 text-sm mt-3">
                Our free word counter gives you an instant, accurate breakdown without needing to open
                Microsoft Word, Google Docs, or any other heavy application. Just paste your text and
                everything is counted live, right in your browser.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Word Limits Across Popular Platforms
              </h3>
              <p className="leading-7 text-sm">
                Different platforms have very different word or character limits — Twitter and X cap posts
                at 280 characters, LinkedIn articles perform best between 1,500 and 2,000 words, college
                application essays typically require 500 to 650 words, and most SEO blog posts need at
                least 1,000 words to rank well. Knowing your count before publishing helps you stay
                within limits and hit your target length every time.
              </p>
            </div>

            <div className="wc-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Use Cases for This Tool
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Check word count for college essays and applications',
                  'Count characters for Twitter, Instagram, or SMS',
                  'Estimate reading time before publishing blog posts',
                  'Meet assignment word limits for school or university',
                  'Check article length for SEO and content strategy',
                  'Count words in resumes and professional cover letters',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="wc-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Students — check essay and assignment word limits quickly',
                  'Bloggers — target the right word count for SEO ranking',
                  'Copywriters — write to brief without guessing length',
                  'Social media managers — stay within platform character limits',
                  'Authors — track chapter and manuscript length easily',
                  'Everyone — any writing that needs a quick length check',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#2563EB' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="wc-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Live word count as you type',
                  'Total characters including spaces',
                  'Characters without spaces',
                  'Sentence and paragraph count',
                  'Estimated reading time',
                  'Keyword density analysis',
                  'Works fully offline in browser',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="wc-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for an Online Word Counter
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Count words in essays before submission deadlines',
                  'Check character limits for social media posts',
                  'Measure reading time for newsletters and articles',
                  'Analyse keyword frequency for on-page SEO',
                  'Track progress on long-form writing projects',
                  'Verify resume and cover letter length before sending',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="wc-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="wc-divider" />
        <section className="wc-section-main py-16 px-6">
          <Script
            id="faq-schema-wc"
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
                <details key={i} className="wc-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#2563EB' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="wc-divider" />
        <section className="wc-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Case Converter',       href: '/case-converter' },
                { name: 'Base64 Encoder',       href: '/base64-tool' },
                { name: 'JSON Formatter',       href: '/json-formatter' },
                { name: 'Text to PDF',          href: '/text-to-pdf' },
                { name: 'Image to Text (OCR)',  href: '/image-to-text' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#2563EB', borderColor: '#BFDBFE', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="wc-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to count your words?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="wc-cta-btn"
            >
              <Type className="w-5 h-5" />
              Start Counting
            </button>
          </div>
        </section>

      </main>
    </>
  );
}