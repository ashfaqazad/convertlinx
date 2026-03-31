'use client';

import { useState } from 'react';
import { Lock, FileCode, RefreshCw, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/Base64Tool.css';
import Link from 'next/link';

export default function Base64Tool() {
  const [mode,    setMode]    = useState('encode'); // 'encode' | 'decode'
  const [tab,     setTab]     = useState('text');   // 'text' | 'file'
  const [input,   setInput]   = useState('');
  const [output,  setOutput]  = useState('');
  const [isError, setIsError] = useState(false);
  const [fileName, setFileName] = useState('');

  // ── ENCODE ──
  const handleEncode = () => {
    if (!input.trim()) return;
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setIsError(false);
    } catch {
      setOutput('Encoding failed. Please check your input.');
      setIsError(true);
    }
  };

  // ── DECODE ──
  const handleDecode = () => {
    if (!input.trim()) return;
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
      setIsError(false);
    } catch {
      setOutput('Invalid Base64 string. Please check your input and try again.');
      setIsError(true);
    }
  };

  const handleProcess = () => mode === 'encode' ? handleEncode() : handleDecode();

  // ── FILE → BASE64 ──
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result.split(',')[1];
      setOutput(b64);
      setInput(`[File: ${file.name}]`);
      setIsError(false);
    };
    reader.readAsDataURL(file);
  };

  // ── SWAP OUTPUT → INPUT ──
  const handleSwap = () => {
    if (output && !isError) {
      setInput(output);
      setOutput('');
      setIsError(false);
      setMode(m => (m === 'encode' ? 'decode' : 'encode'));
    }
  };

  const handleCopy  = () => { if (output && !isError) navigator.clipboard.writeText(output); };
  const handleClear = () => { setInput(''); setOutput(''); setIsError(false); setFileName(''); };

  const faqs = [
    { q: 'What is Base64 encoding?', a: 'Base64 is a method of converting binary data — like files or special characters — into a plain text string using 64 printable ASCII characters. It is widely used to safely transmit data in URLs, emails, and APIs where binary content could cause problems.' },
    { q: 'Is this Base64 tool free?', a: 'Yes — completely free with no signup required. Encode and decode unlimited text or files as many times as you need.' },
    { q: 'Does Base64 encoding encrypt my data?', a: 'No. Base64 is encoding, not encryption. It only changes the format of data to make it safe to transmit as text. Anyone can easily decode a Base64 string — it provides no security. For security, use proper encryption like AES.' },
    { q: 'What can I use Base64 encoding for?', a: 'Common uses include embedding images in HTML or CSS as data URIs, encoding binary files for email attachments, passing data safely in URL query strings, storing small files in JSON APIs, and working with authentication tokens.' },
    { q: 'Can I encode a file to Base64?', a: 'Yes — switch to the File tab and upload any file. The tool converts it to a Base64 string instantly in your browser. This works for images, PDFs, and most other file types.' },
    { q: 'Why is Base64 output longer than the original?', a: 'Base64 encoding increases data size by approximately 33%. This is a known trade-off — every 3 bytes of original data becomes 4 characters of Base64 output.' },
    { q: 'Does it work offline?', a: 'Yes — everything runs entirely in your browser. No internet connection is needed after the page loads. Your data never leaves your device.' },
    { q: 'Is my data stored anywhere?', a: 'No — your text and files are never sent to any server. All encoding and decoding happens locally inside your browser. Full privacy guaranteed.' },
    { q: 'Does it work on mobile?', a: 'Yes — works perfectly on iPhone, Android, tablets, and desktops. The layout adapts cleanly to any screen size.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-b64"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Encode and Decode Base64 Online for Free',
            description:
              'Learn how to instantly encode text or files to Base64 format, or decode Base64 strings back to plain text, using the free ConvertLinx Base64 tool.',
            url: 'https://convertlinx.com/base64',
            totalTime: 'PT10S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Any plain text, URL, or file you want to encode or decode' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Base64 Encoder / Decoder' }],
            step: [
              { '@type': 'HowToStep', name: 'Choose Encode or Decode', text: 'Select whether you want to encode text to Base64 or decode a Base64 string back to plain text.' },
              { '@type': 'HowToStep', name: 'Type, paste, or upload', text: 'Enter your text in the input box, or switch to the File tab to upload a file for Base64 encoding.' },
              { '@type': 'HowToStep', name: 'Copy the result', text: 'Click the action button and copy the output. You can also swap the output back as input to chain operations.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-b64"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',                    item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Base64 Encoder Decoder',  item: 'https://convertlinx.com/base64' },
            ],
          }),
        }}
      />

      <main className="b64-page">

        {/* ── HERO ── */}
        <section className="b64-hero">
          <div className="b64-blob-1" />
          <div className="b64-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="b64-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#7C3AED' }}>Base64 Encoder / Decoder</span>
            </div>
            <span className="b64-badge">Dev Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              Free <span className="b64-grad-text">Base64 Encoder & Decoder</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Encode text or files to Base64 format, or decode Base64 strings back to plain text —
              instantly in your browser. No signup, no server, no upload. Works with text, URLs,
              JSON, and any file type.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="b64-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto b64-fade-up">
            <div className="b64-tool-card">

              <label className="block mb-3" style={{ color: '#7C3AED', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Choose Mode
              </label>

              {/* Mode toggle */}
              <div className="b64-mode-wrap">
                <button
                  className={`b64-mode-btn ${mode === 'encode' ? 'active' : ''}`}
                  onClick={() => { setMode('encode'); setOutput(''); setIsError(false); }}
                >
                  Encode →
                </button>
                <button
                  className={`b64-mode-btn ${mode === 'decode' ? 'active' : ''}`}
                  onClick={() => { setMode('decode'); setOutput(''); setIsError(false); }}
                >
                  ← Decode
                </button>
              </div>

              {/* Tab switcher (only relevant for encode) */}
              {mode === 'encode' && (
                <div className="b64-tabs">
                  <button className={`b64-tab ${tab === 'text' ? 'active' : ''}`} onClick={() => setTab('text')}>Text</button>
                  <button className={`b64-tab ${tab === 'file' ? 'active' : ''}`} onClick={() => setTab('file')}>File → Base64</button>
                </div>
              )}

              {/* File upload zone */}
              {mode === 'encode' && tab === 'file' ? (
                <label className="b64-file-zone">
                  <input type="file" className="b64-file-input" onChange={handleFile} />
                  <div className="b64-file-icon">📎</div>
                  <p className="b64-file-text">
                    <strong>Click to upload</strong> any file — image, PDF, document, or any other type
                  </p>
                  {fileName && (
                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#7C3AED', fontWeight: 600 }}>
                      ✓ {fileName}
                    </p>
                  )}
                </label>
              ) : (
                /* Text input panel */
                <div className="b64-panel">
                  <div className="b64-panel-head">
                    <span className="b64-panel-label">{mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}</span>
                    <button className="b64-panel-action" onClick={handleClear}>Clear</button>
                  </div>
                  <textarea
                    className="b64-textarea"
                    placeholder={mode === 'encode' ? 'Type or paste text to encode…' : 'Paste your Base64 string here to decode…'}
                    value={input}
                    onChange={e => { setInput(e.target.value); setOutput(''); setIsError(false); }}
                  />
                </div>
              )}

              {/* Action toolbar */}
              <div className="b64-toolbar">
                <button className="b64-btn b64-btn-primary" onClick={handleProcess}>
                  {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                </button>
                {output && !isError && (
                  <>
                    <button className="b64-btn b64-btn-ghost" onClick={handleSwap}>⇄ Swap</button>
                    <button className="b64-btn b64-btn-ghost" onClick={handleCopy}>Copy Output</button>
                  </>
                )}
                {(input || output) && (
                  <button className="b64-btn b64-btn-ghost" onClick={handleClear}>Clear</button>
                )}
              </div>

              {/* Output panel */}
              <div className="b64-panel">
                <div className="b64-panel-head">
                  <span className="b64-panel-label">{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</span>
                  {output && !isError && (
                    <span className="b64-panel-meta">{output.length} chars</span>
                  )}
                </div>
                <div className={`b64-output ${isError ? 'error' : !output ? 'empty' : ''}`}>
                  {output || 'Output will appear here after encoding or decoding…'}
                </div>
              </div>

              {/* Error banner */}
              {isError && (
                <div className="b64-error-banner">
                  <span className="b64-error-icon">⚠</span>
                  <div><strong>Error:</strong> {output}</div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {['No sign-up', 'Text & file support', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="b64-trust-item">
                    <span className="b64-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="b64-divider" />
        <section className="b64-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Choose Encode or Decode', desc: 'Select whether you want to convert text to Base64 or decode a Base64 string back to readable text.' },
                { num: '2', title: 'Paste Text or Upload File', desc: 'Enter your text in the input box, or switch to File tab to encode any file directly to Base64.' },
                { num: '3', title: 'Copy the Output',          desc: 'Click the action button and copy the result. Use Swap to chain encode and decode operations.' },
              ].map((s, i) => (
                <div key={i} className="b64-step-card">
                  <div className="b64-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="b64-divider" />
        <section className="b64-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx Base64 Tool?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Lock className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Encode Text & Files Both',
                  desc: 'Switch between text mode and file mode. Encode plain strings or upload any file — images, PDFs, documents — and get the Base64 output instantly.',
                },
                {
                  icon: <RefreshCw className="w-6 h-6" />,
                  color: '#6366F1',
                  bg: 'rgba(99,102,241,0.08)',
                  title: 'Two-Way with Swap',
                  desc: 'Encode and decode in the same tool. Use the Swap button to instantly send output back as input — perfect for chaining operations without copy-paste.',
                },
                {
                  icon: <FileCode className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Built for Developers',
                  desc: 'Works with any text — plain strings, JSON payloads, URLs, auth tokens, data URIs, and API responses. Everything you need for daily dev work.',
                },
              ].map((b, i) => (
                <div key={i} className="b64-benefit-card">
                  <div className="b64-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="b64-divider" />
        <section className="b64-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                What Is Base64 and Why Is It Used?
              </h2>
              <p className="leading-7 text-sm">
                Base64 is a binary-to-text encoding scheme that converts data into a string of
                64 printable ASCII characters. It was designed to safely represent binary data
                in environments that only handle text — such as email bodies, HTML attributes,
                JSON payloads, and HTTP headers.
              </p>
              <p className="leading-7 text-sm mt-3">
                When you embed an image directly into a CSS file as a data URI, authenticate
                with a Basic Auth header, or store a small file inside a JSON API response —
                you are using Base64. It is one of the most common encoding formats in modern
                web development and API design.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                Base64 Encoding vs Encryption — Key Difference
              </h3>
              <p className="leading-7 text-sm">
                Base64 is often confused with encryption, but they are completely different.
                Encoding only changes the format of data so it can travel safely — anyone
                can decode a Base64 string with no key or password. Encryption, on the other
                hand, scrambles data so only someone with the correct key can read it.
                Never use Base64 to protect sensitive information — use it only for safe
                data transmission and storage of non-sensitive content.
              </p>
            </div>

            <div className="b64-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Use Cases for Base64
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Embed images in HTML and CSS as data URIs',
                  'Encode files for JSON API request payloads',
                  'Generate HTTP Basic Authentication headers',
                  'Store small files inside database text fields',
                  'Pass binary data safely in URL query parameters',
                  'Encode email attachments in MIME format',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="b64-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Frontend developers — encode images and assets as data URIs',
                  'Backend developers — encode API tokens and auth headers',
                  'DevOps engineers — decode config values and secrets',
                  'QA testers — verify Base64 encoded API payloads',
                  'Security researchers — inspect encoded data in requests',
                  'Everyone — quickly encode or decode any Base64 string',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#7C3AED' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="b64-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Encode plain text to Base64 instantly',
                  'Decode Base64 strings back to text',
                  'File upload — encode any file to Base64',
                  'Swap button to chain encode and decode',
                  'Output character count shown live',
                  'Clear error messages for invalid input',
                  'Works fully offline in your browser',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="b64-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for an Online Base64 Tool
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Encode image files as Base64 data URIs for HTML',
                  'Decode JWT token payloads to inspect claims',
                  'Encode credentials for HTTP Basic Auth headers',
                  'Convert small files to Base64 for JSON APIs',
                  'Inspect Base64 encoded values in API responses',
                  'Encode configuration strings for environment variables',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="b64-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="b64-divider" />
        <section className="b64-section-main py-16 px-6">
          <Script
            id="faq-schema-b64"
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
                <details key={i} className="b64-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#7C3AED' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="b64-divider" />
        <section className="b64-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'JSON Formatter',   href: '/json-formatter' },
                { name: 'Word Counter',     href: '/word-counter' },
                { name: 'Case Converter',   href: '/case-converter' },
                { name: 'Text to PDF',      href: '/text-to-pdf' },
                { name: 'Image to Text',    href: '/image-to-text' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#7C3AED', borderColor: '#DDD6FE', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="b64-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to encode or decode?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="b64-cta-btn"
            >
              <Lock className="w-5 h-5" />
              Start Encoding
            </button>
          </div>
        </section>

      </main>
    </>
  );
}