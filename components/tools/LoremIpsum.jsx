'use client';

import { useState, useCallback } from 'react';
import { Type, Copy, RefreshCw, AlignLeft, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/LoremIpsum.css';
import Link from 'next/link';

// ── LOREM IPSUM DATA ──
const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum','perspiciatis','unde','omnis','iste','natus',
  'error','accusantium','doloremque','laudantium','totam','rem','aperiam','eaque','ipsa',
  'quae','ab','illo','inventore','veritatis','quasi','architecto','beatae','vitae',
  'dicta','explicabo','nemo','ipsam','quia','voluptas','aspernatur','odit','fugit',
  'consequuntur','magni','dolores','eos','ratione','sequi','nesciunt','neque','porro',
  'quisquam','dolorem','adipisci','numquam','eius','modi','tempora','incidunt','magnam',
];

const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence() {
  const len = 8 + Math.floor(Math.random() * 12);
  const words = Array.from({ length: len }, (_, i) => {
    const w = randomWord();
    return i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
  return words.join(' ') + '.';
}

function generateParagraph(sentenceCount = 5) {
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

function generateWords(count) {
  const words = Array.from({ length: count }, (_, i) => {
    const w = randomWord();
    return i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
  return words.join(' ') + '.';
}

export default function LoremIpsum() {
  const [type,      setType]      = useState('paragraphs'); // paragraphs | sentences | words
  const [count,     setCount]     = useState(3);
  const [startWith, setStartWith] = useState(true);
  const [output,    setOutput]    = useState('');
  const [copied,    setCopied]    = useState(false);

  const generate = useCallback(() => {
    let result = '';
    if (type === 'paragraphs') {
      const paras = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWith) return CLASSIC_START + ' ' + generateParagraph(4);
        return generateParagraph(5 + Math.floor(Math.random() * 3));
      });
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWith) return CLASSIC_START;
        return generateSentence();
      });
      result = sentences.join(' ');
    } else {
      result = generateWords(count);
    }
    setOutput(result);
    setCopied(false);
  }, [type, count, startWith]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => { setOutput(''); setCopied(false); };

  const wordCount = output.trim() === '' ? 0 : output.trim().split(/\s+/).length;
  const charCount = output.length;
  const paraCount = output.trim() === '' ? 0 : output.split(/\n\n+/).filter(p => p.trim()).length;

  const faqs = [
    { q: 'What is Lorem Ipsum?',                          a: 'Lorem Ipsum is placeholder text derived from a Latin work by Cicero. It has been used in the printing and typesetting industry since the 1500s to fill space before real content is ready.' },
    { q: 'Why do designers use Lorem Ipsum?',             a: 'Designers use Lorem Ipsum so that the visual layout can be reviewed without being distracted by readable content. It helps clients and reviewers focus on design, spacing, and typography rather than words.' },
    { q: 'Is this Lorem Ipsum free to use?',              a: 'Yes — completely free with no signup required. Generate as much placeholder text as you need for any project.' },
    { q: 'Can I generate just sentences or words?',       a: 'Yes — switch between Paragraphs, Sentences, or Words using the type selector. You can also set exactly how many you need.' },
    { q: 'Does the text always start with "Lorem ipsum"?', a: 'By default yes — the classic opening is kept for familiarity. You can uncheck the "Start with Lorem ipsum" option to generate fully random text instead.' },
    { q: 'Is my generated text stored anywhere?',         a: 'No — everything runs entirely in your browser. Nothing is sent to any server. Full privacy guaranteed.' },
    { q: 'Can I use this for web design mockups?',        a: 'Absolutely. This tool is ideal for Figma, Adobe XD, Webflow, and any other design or prototyping tool. Just generate, copy, and paste.' },
    { q: 'Does it work on mobile?',                       a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops. The layout adapts cleanly to any screen size.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-li"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Generate Lorem Ipsum Text Online for Free',
            description: 'Learn how to instantly generate Lorem Ipsum placeholder text — by paragraphs, sentences, or words — using the free ConvertLinx Lorem Ipsum Generator.',
            url: 'https://convertlinx.com/lorem-ipsum',
            totalTime: 'PT5S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'No input required' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Lorem Ipsum Generator' }],
            step: [
              { '@type': 'HowToStep', name: 'Choose type and amount', text: 'Select whether you want paragraphs, sentences, or words, then set the count.' },
              { '@type': 'HowToStep', name: 'Click Generate', text: 'Press the Generate button. Lorem Ipsum placeholder text appears instantly.' },
              { '@type': 'HowToStep', name: 'Copy and use', text: 'Click Copy to clipboard and paste it into your design tool, code editor, or document.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-li"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',                item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Lorem Ipsum Generator', item: 'https://convertlinx.com/lorem-ipsum' },
            ],
          }),
        }}
      />

      <main className="li-page">

        {/* ── HERO ── */}
        <section className="li-hero">
          <div className="li-blob-1" />
          <div className="li-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="li-breadcrumb-link">Home</a>
              <span className="li-breadcrumb-sep">/</span>
              <span className="li-breadcrumb-current">Lorem Ipsum Generator</span>
            </div>
            <span className="li-badge">Design Tool</span>
            <h1 className="li-hero-title">
              Free <span className="li-grad-text">Lorem Ipsum</span> Generator
            </h1>
            <p className="li-hero-sub">
              Generate placeholder text instantly — by paragraphs, sentences, or words.
              Perfect for wireframes, mockups, and design prototypes. No signup, 100% browser-based.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="li-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto li-fade-up">

            {/* Stats — only show after generating */}
            {output && (
              <div className="li-stats-grid">
                {[
                  { label: 'Words',      value: wordCount },
                  { label: 'Characters', value: charCount },
                  { label: 'Paragraphs', value: paraCount },
                ].map(({ label, value }) => (
                  <div key={label} className="li-stat-card">
                    <span className="li-stat-num">{value}</span>
                    <span className="li-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="li-tool-card">

              {/* Controls */}
              <div className="li-controls">
                {/* Type selector */}
                <div className="li-control-group">
                  <label className="li-control-label">Generate</label>
                  <div className="li-type-tabs">
                    {['paragraphs', 'sentences', 'words'].map(t => (
                      <button
                        key={t}
                        className={`li-type-tab ${type === t ? 'active' : ''}`}
                        onClick={() => setType(t)}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Count */}
                <div className="li-control-group">
                  <label className="li-control-label">
                    Amount
                    <span className="li-count-badge">{count}</span>
                  </label>
                  <input
                    type="range"
                    className="li-range"
                    min={1}
                    max={type === 'words' ? 200 : type === 'sentences' ? 20 : 10}
                    value={count}
                    onChange={e => setCount(Number(e.target.value))}
                  />
                  <div className="li-range-labels">
                    <span>1</span>
                    <span>{type === 'words' ? 200 : type === 'sentences' ? 20 : 10}</span>
                  </div>
                </div>

                {/* Start with classic */}
                <div className="li-control-group li-checkbox-group">
                  <label className="li-checkbox-label">
                    <input
                      type="checkbox"
                      className="li-checkbox"
                      checked={startWith}
                      onChange={e => setStartWith(e.target.checked)}
                    />
                    <span className="li-checkbox-custom" />
                    <span className="li-checkbox-text">Start with <em>"Lorem ipsum dolor sit amet…"</em></span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="li-toolbar">
                <button className="li-btn li-btn-primary" onClick={generate}>
                  <RefreshCw className="w-4 h-4" /> Generate
                </button>
                {output && (
                  <>
                    <button className="li-btn li-btn-ghost" onClick={handleCopy}>
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button className="li-btn li-btn-ghost" onClick={handleClear}>Clear</button>
                  </>
                )}
              </div>

              {/* Output */}
              <div className={`li-output-wrap ${output ? 'has-content' : ''}`}>
                {output ? (
                  <div className="li-output-text">
                    {output.split('\n\n').map((para, i) => (
                      <p key={i} className="li-para">{para}</p>
                    ))}
                  </div>
                ) : (
                  <div className="li-output-placeholder">
                    <AlignLeft className="w-8 h-8 li-placeholder-icon" />
                    <p>Click <strong>Generate</strong> to create your Lorem Ipsum text</p>
                  </div>
                )}
              </div>

              <div className="li-trust-strip">
                {['No sign-up', 'Instant generation', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="li-trust-item">
                    <span className="li-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="li-divider" />
        <section className="li-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="li-section-title text-center mb-12">3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Choose Type & Amount', desc: 'Select paragraphs, sentences, or words and set the exact amount you need using the slider.' },
                { num: '2', title: 'Click Generate',       desc: 'Placeholder text appears instantly. Regenerate as many times as you like to get different variations.' },
                { num: '3', title: 'Copy & Paste',         desc: 'Click Copy to clipboard and paste directly into Figma, your code editor, CMS, or any design tool.' },
              ].map((s, i) => (
                <div key={i} className="li-step-card">
                  <div className="li-step-num">{s.num}</div>
                  <h3 className="li-card-title font-bold text-base mb-2">{s.title}</h3>
                  <p className="li-card-desc text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="li-divider" />
        <section className="li-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="li-section-title text-center mb-10">Why Use ConvertLinx Lorem Ipsum Generator?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Type className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Paragraphs, Sentences or Words',
                  desc: 'Generate exactly the right amount of text in any format — perfect for any design context.',
                },
                {
                  icon: <RefreshCw className="w-6 h-6" />,
                  color: '#D97706',
                  bg: 'rgba(217,119,6,0.08)',
                  title: 'Instant Regeneration',
                  desc: 'Click Generate again to get a completely fresh variation — no two outputs are the same.',
                },
                {
                  icon: <Copy className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'One-Click Copy',
                  desc: 'Copy everything to your clipboard in one click — ready to paste into Figma, VS Code, or your CMS.',
                },
              ].map((b, i) => (
                <div key={i} className="li-benefit-card">
                  <div className="li-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="li-card-title font-bold text-base mb-2">{b.title}</h3>
                  <p className="li-card-desc text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="li-divider" />
        <section className="li-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="li-section-title text-2xl mb-4">What Is Lorem Ipsum and Why Do Designers Use It?</h2>
              <p className="li-body-text leading-7 text-sm">
                Lorem Ipsum is the industry-standard placeholder text used in graphic design, web design,
                and publishing. It originates from a Latin text by Cicero written in 45 BC, and has been
                used in typesetting since the 1500s. The scrambled Latin looks enough like real text that
                it allows designers to focus on layout and visual hierarchy without the distraction of
                readable content.
              </p>
              <p className="li-body-text leading-7 text-sm mt-3">
                When presenting mockups to clients, using Lorem Ipsum prevents reviewers from fixating on
                the words rather than the design. It has become the universal signal for "content goes here,"
                understood by designers, developers, and clients worldwide.
              </p>
            </div>

            <div className="li-seo-box">
              <h3 className="li-section-subtitle font-bold text-lg mb-4">Common Use Cases for This Tool</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Fill Figma and Adobe XD mockups with placeholder text',
                  'Populate HTML/CSS layouts during development',
                  'Test typography and font choices before real copy',
                  'Fill CMS templates before content is written',
                  'Create realistic-looking wireframes for presentations',
                  'Test email templates with real-length placeholder text',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="li-feature-dot" />
                    <span className="li-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="li-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'UI/UX designers — fill mockups and wireframes fast',
                  'Web developers — populate layouts during build',
                  'Content strategists — plan page structure before copy',
                  'Graphic designers — test print layouts and typography',
                  'Students — practice design without waiting for copy',
                  'Everyone — anyone who needs quick placeholder text',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="li-arrow font-bold mt-0.5">→</span>
                    <span className="li-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="li-seo-box">
              <h3 className="li-section-subtitle font-bold text-lg mb-4">Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Generate paragraphs, sentences, or words',
                  'Adjustable count with a live slider',
                  'Option to start with classic Lorem Ipsum opening',
                  'Live word, character, and paragraph count',
                  'One-click copy to clipboard',
                  'Infinite regeneration for fresh variations',
                  'Works fully offline in browser',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="li-feature-dot" />
                    <span className="li-body-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="li-divider" />
        <section className="li-section-main py-16 px-6">
          <Script
            id="faq-schema-li"
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
            <h2 className="li-section-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="li-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="li-faq-question font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className="li-faq-icon w-4 h-4 shrink-0" />
                  </summary>
                  <p className="li-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="li-divider" />
        <section className="li-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="li-section-title text-center mb-5">You may also find these free tools helpful</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Word Counter',        href: '/word-counter'    },
                { name: 'Case Converter',      href: '/case-converter'  },
                { name: 'JSON Formatter',      href: '/json-formatter'  },
                { name: 'Color Picker',        href: '/color-picker'    },
                { name: 'Base64 Encoder',      href: '/base64-tool'     },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border li-related-link"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="li-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to generate placeholder text?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="li-cta-btn"
            >
              <Type className="w-5 h-5" />
              Generate Lorem Ipsum
            </button>
          </div>
        </section>

      </main>
    </>
  );
}