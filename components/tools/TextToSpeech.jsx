'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Square, Play, Pause, Copy, RotateCcw, Mic, ChevronDown, Download } from 'lucide-react';
import Script from 'next/script';
import '@/styles/TextToSpeech.css';
import Link from 'next/link';

// ── CONSTANTS ──
const CHAR_LIMIT = 5000;

export default function TextToSpeech() {
  const [text,         setText]         = useState('');
  const [voices,       setVoices]       = useState([]);
  const [selectedVoice,setSelectedVoice]= useState(null);
  const [rate,         setRate]         = useState(1);
  const [pitch,        setPitch]        = useState(1);
  const [volume,       setVolume]       = useState(1);
  const [speaking,     setSpeaking]     = useState(false);
  const [paused,       setPaused]       = useState(false);
  const [supported,    setSupported]    = useState(true);
  const [copied,       setCopied]       = useState(false);
  const [charCount,    setCharCount]    = useState(0);
  const utteranceRef = useRef(null);

  // ── Load voices ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.speechSynthesis) { setSupported(false); return; }

    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        // prefer English voice as default
        const en = v.find(x => x.lang.startsWith('en-')) || v[0];
        setSelectedVoice(en);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const handleTextChange = (e) => {
    const val = e.target.value.slice(0, CHAR_LIMIT);
    setText(val);
    setCharCount(val.length);
  };

  const handleSpeak = useCallback(() => {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate   = rate;
    utterance.pitch  = pitch;
    utterance.volume = volume;

    utterance.onstart  = () => { setSpeaking(true);  setPaused(false); };
    utterance.onend    = () => { setSpeaking(false);  setPaused(false); };
    utterance.onerror  = () => { setSpeaking(false);  setPaused(false); };
    utterance.onpause  = () => setPaused(true);
    utterance.onresume = () => setPaused(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoice, rate, pitch, volume, supported]);

  const handlePauseResume = () => {
    if (!window.speechSynthesis) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const handleStop = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  const handleReset = () => {
    handleStop();
    setText('');
    setCharCount(0);
    setRate(1);
    setPitch(1);
    setVolume(1);
    if (voices.length) {
      const en = voices.find(x => x.lang.startsWith('en-')) || voices[0];
      setSelectedVoice(en);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group voices by language
  const voiceGroups = voices.reduce((acc, v) => {
    const lang = v.lang.split('-')[0].toUpperCase();
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(v);
    return acc;
  }, {});

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const estimatedSec = Math.round((wordCount / 150) * 60 / rate);
  const estimatedTime = estimatedSec < 60
    ? `~${estimatedSec}s`
    : `~${Math.floor(estimatedSec / 60)}m ${estimatedSec % 60}s`;

  const faqs = [
    { q: 'What is Text to Speech?',                          a: 'Text to Speech (TTS) is a technology that converts written text into spoken audio using synthetic voices. It is built into modern browsers via the Web Speech API and requires no installation or plugins.' },
    { q: 'Does this tool work offline?',                     a: 'Partially — the Web Speech API uses voices installed on your device. Some browsers also offer cloud voices which require an internet connection. Device voices work fully offline.' },
    { q: 'Why can\'t I hear any audio?',                     a: 'Make sure your device volume is turned up and not muted. Also check your browser\'s site permissions — some browsers require explicit permission for audio. Try refreshing the page.' },
    { q: 'How many characters can I convert at once?',       a: 'This tool supports up to 5,000 characters per conversion. For longer text, simply split it into sections and convert each separately.' },
    { q: 'Can I change the voice language?',                 a: 'Yes — the voice selector shows all voices installed on your device and browser. Different voices support different languages. If you need a specific language, install that language pack in your operating system.' },
    { q: 'What do Rate, Pitch, and Volume control?',         a: 'Rate controls how fast the speech is delivered (0.5 = slow, 2 = fast). Pitch adjusts the tone — higher values sound more high-pitched. Volume controls the loudness from 0 (silent) to 1 (full volume).' },
    { q: 'Can I download the audio as an MP3?',              a: 'The Web Speech API does not support direct audio file export in most browsers. For audio file export, consider using a dedicated desktop TTS application or a paid API service.' },
    { q: 'Is my text stored or sent anywhere?',              a: 'No — all processing happens entirely in your browser using the built-in Web Speech API. Your text is never sent to any server. Complete privacy is guaranteed.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-tts"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Convert Text to Speech Online for Free',
            description: 'Type or paste any text and instantly hear it spoken aloud using the free ConvertLinx Text to Speech tool — no signup, no install.',
            url: 'https://convertlinx.com/text-to-speech',
            totalTime: 'PT10S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Text you want to hear spoken' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx Text to Speech' }],
            step: [
              { '@type': 'HowToStep', name: 'Type or paste your text', text: 'Enter any text into the text area — up to 5,000 characters.' },
              { '@type': 'HowToStep', name: 'Choose voice and settings', text: 'Select a voice, adjust speed, pitch, and volume to your preference.' },
              { '@type': 'HowToStep', name: 'Click Speak', text: 'Press the Speak button and your text will be read aloud instantly.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-tts"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home',            item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'Text to Speech',  item: 'https://convertlinx.com/text-to-speech' },
            ],
          }),
        }}
      />

      <main className="tts-page">

        {/* ── HERO ── */}
        <section className="tts-hero">
          <div className="tts-blob-1" />
          <div className="tts-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="tts-breadcrumb-link">Home</a>
              <span className="tts-breadcrumb-sep">/</span>
              <span className="tts-breadcrumb-current">Text to Speech</span>
            </div>
            <span className="tts-badge">Audio Tool</span>
            <h1 className="tts-hero-title">
              Free <span className="tts-grad-text">Text to Speech</span> Converter
            </h1>
            <p className="tts-hero-sub">
              Type or paste any text and hear it spoken aloud instantly — right in your browser.
              Choose from multiple voices, adjust speed and pitch, no signup required.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="tts-section-main py-10 px-6">
          <div className="max-w-3xl mx-auto tts-fade-up">

            {/* Stats — show when text is entered */}
            {text && (
              <div className="tts-stats-grid">
                {[
                  { label: 'Words',      value: wordCount },
                  { label: 'Characters', value: charCount },
                  { label: 'Est. Time',  value: estimatedTime },
                ].map(({ label, value }) => (
                  <div key={label} className="tts-stat-card">
                    <span className="tts-stat-num">{value}</span>
                    <span className="tts-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="tts-tool-card">

              {/* Browser not supported warning */}
              {!supported && (
                <div className="tts-unsupported">
                  <Volume2 className="w-5 h-5" />
                  <span>Your browser does not support the Web Speech API. Please try Chrome, Edge, or Safari.</span>
                </div>
              )}

              {/* ── TEXT AREA ── */}
              <div className="tts-textarea-wrap">
                <div className="tts-textarea-header">
                  <label className="tts-control-label">Your Text</label>
                  <span className={`tts-char-counter ${charCount > CHAR_LIMIT * 0.9 ? 'warn' : ''}`}>
                    {charCount} / {CHAR_LIMIT}
                  </span>
                </div>
                <textarea
                  className="tts-textarea"
                  placeholder="Type or paste your text here — up to 5,000 characters…"
                  value={text}
                  onChange={handleTextChange}
                  rows={7}
                  disabled={speaking && !paused}
                />
                {/* Speaking progress bar */}
                {speaking && (
                  <div className="tts-progress-bar">
                    <div className={`tts-progress-fill ${paused ? 'paused' : ''}`} />
                  </div>
                )}
              </div>

              {/* ── VOICE SELECTOR ── */}
              <div className="tts-control-group">
                <label className="tts-control-label">Voice</label>
                {voices.length === 0 ? (
                  <div className="tts-voice-loading">Loading voices…</div>
                ) : (
                  <div className="tts-select-wrap">
                    <select
                      className="tts-select"
                      value={selectedVoice?.name || ''}
                      onChange={e => {
                        const v = voices.find(x => x.name === e.target.value);
                        setSelectedVoice(v || null);
                      }}
                    >
                      {Object.entries(voiceGroups).sort().map(([lang, vList]) => (
                        <optgroup key={lang} label={lang}>
                          {vList.map(v => (
                            <option key={v.name} value={v.name}>
                              {v.name} {v.localService ? '(Local)' : '(Online)'}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown className="tts-select-arrow w-4 h-4" />
                  </div>
                )}
              </div>

              {/* ── SLIDERS ── */}
              <div className="tts-sliders-grid">
                {[
                  { label: 'Speed',  value: rate,   min: 0.5, max: 2,   step: 0.1,  set: setRate,   fmt: v => `${v.toFixed(1)}×`,  color: '#7C3AED' },
                  { label: 'Pitch',  value: pitch,  min: 0,   max: 2,   step: 0.1,  set: setPitch,  fmt: v => v.toFixed(1),        color: '#D97706' },
                  { label: 'Volume', value: volume, min: 0,   max: 1,   step: 0.05, set: setVolume, fmt: v => `${Math.round(v*100)}%`, color: '#059669' },
                ].map(({ label, value, min, max, step, set, fmt, color }) => (
                  <div key={label} className="tts-slider-group">
                    <div className="tts-slider-header">
                      <label className="tts-control-label">{label}</label>
                      <span className="tts-slider-val" style={{ color }}>{fmt(value)}</span>
                    </div>
                    <input
                      type="range"
                      className="tts-range"
                      min={min} max={max} step={step}
                      value={value}
                      style={{ '--thumb-color': color }}
                      onChange={e => set(parseFloat(e.target.value))}
                    />
                    <div className="tts-range-labels">
                      <span>{label === 'Speed' ? 'Slow' : label === 'Pitch' ? 'Low' : 'Quiet'}</span>
                      <span>{label === 'Speed' ? 'Fast' : label === 'Pitch' ? 'High' : 'Loud'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div className="tts-toolbar">
                {/* Primary: Speak / Pause / Resume */}
                {!speaking ? (
                  <button
                    className="tts-btn tts-btn-primary"
                    onClick={handleSpeak}
                    disabled={!supported || !text.trim()}
                  >
                    <Play className="w-4 h-4" />
                    Speak
                  </button>
                ) : (
                  <>
                    <button className="tts-btn tts-btn-primary" onClick={handlePauseResume}>
                      {paused
                        ? <><Play  className="w-4 h-4" /> Resume</>
                        : <><Pause className="w-4 h-4" /> Pause</>
                      }
                    </button>
                    <button className="tts-btn tts-btn-stop" onClick={handleStop}>
                      <Square className="w-4 h-4" />
                      Stop
                    </button>
                  </>
                )}

                {/* Secondary actions */}
                {text && !speaking && (
                  <button className="tts-btn tts-btn-ghost" onClick={handleCopy}>
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Text'}
                  </button>
                )}
                {(text || speaking) && (
                  <button className="tts-btn tts-btn-ghost" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>

              {/* Speaking indicator */}
              {speaking && (
                <div className="tts-speaking-indicator">
                  <div className="tts-wave">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`tts-bar ${paused ? 'paused' : ''}`} style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <span className="tts-speaking-text">
                    {paused ? 'Paused' : 'Speaking…'}
                  </span>
                </div>
              )}

              <div className="tts-trust-strip">
                {['No sign-up', '100% browser-based', 'Works offline', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="tts-trust-item">
                    <span className="tts-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="tts-divider" />
        <section className="tts-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="tts-section-title text-center mb-12">3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Type or Paste Text',    desc: 'Enter any text into the box — up to 5,000 characters. Paste articles, emails, study notes, or anything you want to hear.' },
                { num: '2', title: 'Choose Voice & Settings', desc: 'Pick a voice from the list, then adjust speed, pitch, and volume to match your preference.' },
                { num: '3', title: 'Click Speak',           desc: 'Hit the Speak button and your text plays as audio instantly. Pause, resume, or stop at any time.' },
              ].map((s, i) => (
                <div key={i} className="tts-step-card">
                  <div className="tts-step-num">{s.num}</div>
                  <h3 className="tts-card-title font-bold text-base mb-2">{s.title}</h3>
                  <p className="tts-card-desc text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="tts-divider" />
        <section className="tts-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="tts-section-title text-center mb-10">Why Use ConvertLinx Text to Speech?</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Volume2 className="w-6 h-6" />,
                  color: '#7C3AED',
                  bg: 'rgba(124,58,237,0.08)',
                  title: 'Multiple Voices & Languages',
                  desc: 'Access every voice installed on your device or browser — dozens of languages and accents available.',
                },
                {
                  icon: <Mic className="w-6 h-6" />,
                  color: '#D97706',
                  bg: 'rgba(217,119,6,0.08)',
                  title: 'Full Playback Control',
                  desc: 'Adjust speed, pitch, and volume. Pause and resume mid-sentence — just like a real audio player.',
                },
                {
                  icon: <Download className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'Completely Private',
                  desc: 'Everything runs in your browser via the Web Speech API. Your text never leaves your device.',
                },
              ].map((b, i) => (
                <div key={i} className="tts-benefit-card">
                  <div className="tts-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="tts-card-title font-bold text-base mb-2">{b.title}</h3>
                  <p className="tts-card-desc text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="tts-divider" />
        <section className="tts-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">

            <div>
              <h2 className="tts-section-title text-2xl mb-4">What Is Text to Speech and How Does It Work?</h2>
              <p className="tts-body-text leading-7 text-sm">
                Text to Speech (TTS) technology converts written text into synthesized spoken audio. Our tool
                uses the browser's built-in Web Speech API — a W3C standard available in Chrome, Edge, Safari,
                and Firefox — to process your text locally on your device with zero server involvement.
              </p>
              <p className="tts-body-text leading-7 text-sm mt-3">
                Unlike cloud-based TTS services that send your text to remote servers, our tool processes
                everything in your browser. This means faster results, no usage limits on private content,
                and no privacy concerns — even for sensitive documents.
              </p>
            </div>

            <div className="tts-seo-box">
              <h3 className="tts-section-subtitle font-bold text-lg mb-4">Common Use Cases</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Listen to articles and blog posts hands-free',
                  'Proofread your writing by hearing it out loud',
                  'Language learning — hear correct pronunciation',
                  'Accessibility — assist users with reading difficulties',
                  'Listen to study notes while commuting',
                  'Review emails and documents without reading',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="tts-feature-dot" />
                    <span className="tts-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="tts-section-subtitle font-bold text-lg mb-4">Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Students — listen to notes and study material',
                  'Writers — proofread by listening to your own text',
                  'Language learners — hear correct pronunciation',
                  'Developers — test TTS integrations quickly',
                  'Accessibility users — screen reader alternative',
                  'Everyone — anyone who prefers listening over reading',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="tts-arrow font-bold mt-0.5">→</span>
                    <span className="tts-body-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tts-seo-box">
              <h3 className="tts-section-subtitle font-bold text-lg mb-4">Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Up to 5,000 characters per conversion',
                  'All browser/device voices supported',
                  'Adjustable speed from 0.5× to 2×',
                  'Pitch and volume control',
                  'Pause, resume, and stop controls',
                  'Live word count and estimated reading time',
                  'Works fully in-browser — no server',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="tts-feature-dot" />
                    <span className="tts-body-text">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="tts-divider" />
        <section className="tts-section-main py-16 px-6">
          <Script
            id="faq-schema-tts"
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
            <h2 className="tts-section-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="tts-faq-item">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="tts-faq-question font-semibold text-sm">{faq.q}</span>
                    <ChevronDown className="tts-faq-icon w-4 h-4 shrink-0" />
                  </summary>
                  <p className="tts-faq-answer mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="tts-divider" />
        <section className="tts-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="tts-section-title text-center mb-5">You may also find these free tools helpful</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Word Counter',        href: '/word-counter'   },
                { name: 'Case Converter',      href: '/case-converter' },
                { name: 'Lorem Ipsum',         href: '/lorem-ipsum'    },
                { name: 'Color Picker',        href: '/color-picker'   },
                { name: 'JSON Formatter',      href: '/json-formatter' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border tts-related-link"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="tts-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to hear your text?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 2 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="tts-cta-btn"
            >
              <Volume2 className="w-5 h-5" />
              Convert Text to Speech
            </button>
          </div>
        </section>

      </main>
    </>
  );
}