'use client';

import { useState, useMemo } from 'react';
import { MessageCircle, Copy, ExternalLink, QrCode, Check, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import '@/styles/WhatsAppLinkGenerator.css';
import Link from 'next/link';

export default function WhatsAppLinkGenerator() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Strip everything except digits (no +, spaces, dashes, brackets)
  const cleanPhone = useMemo(() => phone.replace(/\D/g, ''), [phone]);
  const isValid = cleanPhone.length >= 8 && cleanPhone.length <= 15;

  const generatedLink = useMemo(() => {
    if (!isValid) return '';
    const base = `https://wa.me/${cleanPhone}`;
    return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base;
  }, [cleanPhone, message, isValid]);

  const qrUrl = generatedLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(generatedLink)}`
    : '';

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const faqs = [
    { q: 'Is the WhatsApp Link Generator free?', a: 'Yes — completely free, unlimited link generation, no signup required.' },
    { q: 'Do I need to save the number as a contact?', a: 'No — that is the whole point of a click-to-chat link. Anyone can message you on WhatsApp without saving your number in their phone.' },
    { q: 'What format should I enter the phone number in?', a: 'Enter the number with country code but without the + sign, spaces, or leading zeros — for example 923001234567 for a Pakistani number or 919876543210 for an Indian number.' },
    { q: 'Can I add a pre-filled message to the link?', a: 'Yes — type your message in the message box and it will automatically open in the chat window when someone clicks your link.' },
    { q: 'Does this work with WhatsApp Business?', a: 'Yes — wa.me links work identically for personal WhatsApp and WhatsApp Business accounts.' },
    { q: 'Can I generate a QR code for my WhatsApp link?', a: 'Yes — toggle "Show QR Code" after generating your link to get a scannable QR code you can download and print or share.' },
    { q: 'Will this work on both mobile and desktop?', a: 'Yes — clicking the link opens WhatsApp on mobile devices automatically, or WhatsApp Web on desktop if WhatsApp is not installed.' },
    { q: 'Is my phone number stored anywhere?', a: 'No — the link is generated entirely in your browser. Nothing is sent to or stored on any server.' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script
        id="howto-schema-wa-link"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Create a WhatsApp Click-to-Chat Link for Free',
            description: 'Generate a free wa.me WhatsApp link with a pre-filled message so anyone can message you without saving your number.',
            url: 'https://convertlinx.com/whatsapp-link-generator',
            totalTime: 'PT15S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'Phone number with country code' }],
            tool: [{ '@type': 'HowToTool', name: 'ConvertLinx WhatsApp Link Generator' }],
            step: [
              { '@type': 'HowToStep', name: 'Enter Phone Number', text: 'Type your WhatsApp number with country code, without + or leading zeros.' },
              { '@type': 'HowToStep', name: 'Add a Message (Optional)', text: 'Write a pre-filled greeting or question that will appear automatically in the chat.' },
              { '@type': 'HowToStep', name: 'Copy or Share Your Link', text: 'Copy the generated wa.me link, open it directly, or download the QR code.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: BreadcrumbList ── */}
      <Script
        id="breadcrumb-schema-wa-link"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convertlinx.com/' },
              { '@type': 'ListItem', position: 2, name: 'WhatsApp Link Generator', item: 'https://convertlinx.com/whatsapp-link-generator' },
            ],
          }),
        }}
      />

      <main className="wa-page">

        {/* ── HERO ── */}
        <section className="wa-hero">
          <div className="wa-blob-1" />
          <div className="wa-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-5">
              <a href="/" className="wa-breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#059669' }}>WhatsApp Link Generator</span>
            </div>
            <span className="wa-badge">Free Tool</span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 mt-2" style={{ color: '#1a1a2e' }}>
              WhatsApp <span className="wa-grad-text">Link Generator</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Create a free click-to-chat WhatsApp link (wa.me) with a pre-filled message —
              no app, no signup, no saving contacts. Perfect for business cards, Instagram bio,
              websites, and email signatures. QR code included.
            </p>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="wa-section-main py-10 px-6">
          <div className="max-w-2xl mx-auto wa-fade-up">
            <div className="wa-tool-card">

              {/* Phone Number */}
              <div className="mb-6">
                <label className="block mb-3" style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 923001234567"
                  className="wa-input"
                />
                <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                  Country code + number, no + sign, no spaces, no leading zero
                </p>
              </div>

              {/* Message */}
              <div className="mb-7">
                <label className="block mb-3" style={{ color: '#059669', fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                  Pre-filled Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'd like to know more about..."
                  rows={3}
                  className="wa-textarea"
                />
              </div>

              {/* Result */}
              {isValid ? (
                <div className="wa-result-card mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#059669' }}>
                    Your WhatsApp Link
                  </p>
                  <div className="wa-link-row">
                    <MessageCircle className="w-5 h-5 shrink-0" style={{ color: '#059669' }} />
                    <span className="wa-link-text">{generatedLink}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <button onClick={handleCopy} className="wa-btn wa-btn-primary">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="wa-btn wa-btn-secondary">
                      <ExternalLink className="w-4 h-4" />
                      Open in WhatsApp
                    </a>
                    <button onClick={() => setShowQR(!showQR)} className="wa-btn wa-btn-secondary">
                      <QrCode className="w-4 h-4" />
                      {showQR ? 'Hide QR Code' : 'Show QR Code'}
                    </button>
                  </div>

                  {showQR && (
                    <div className="wa-qr-box">
                      <img src={qrUrl} alt="WhatsApp link QR code" width="180" height="180" />
                      <a href={qrUrl} download="whatsapp-link-qr.png" className="wa-qr-download">
                        Download QR
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                phone.length > 0 && (
                  <p className="text-sm mb-6" style={{ color: '#DC2626' }}>
                    Enter a valid number with country code (8–15 digits).
                  </p>
                )
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-2">
                {['No signup', 'Unlimited links', 'Nothing stored', '100% free', 'Instant QR code'].map((t, i) => (
                  <span key={i} className="wa-trust-item">
                    <span className="wa-trust-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="wa-divider" />
        <section className="wa-section-alt py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Enter Your Number', desc: 'Type your WhatsApp number with country code — no + sign or spaces needed.' },
                { num: '2', title: 'Add a Message', desc: 'Optionally write a greeting that opens automatically when someone clicks your link.' },
                { num: '3', title: 'Copy, Share or Scan', desc: 'Copy your wa.me link, open it directly, or download the QR code for print use.' },
              ].map((s, i) => (
                <div key={i} className="wa-step-card">
                  <div className="wa-step-num">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="wa-divider" />
        <section className="wa-section-main py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <MessageCircle className="w-6 h-6" />,
                  color: '#059669',
                  bg: 'rgba(5,150,105,0.08)',
                  title: 'No Saved Contact Needed',
                  desc: 'Customers and leads can message you on WhatsApp instantly without adding your number to their phone first.',
                },
                {
                  icon: <QrCode className="w-6 h-6" />,
                  color: '#0284C7',
                  bg: 'rgba(2,132,199,0.08)',
                  title: 'Built-in QR Code',
                  desc: 'Every generated link comes with a downloadable QR code — perfect for flyers, packaging, business cards, and storefronts.',
                },
                {
                  icon: <Check className="w-6 h-6" />,
                  color: '#6366F1',
                  bg: 'rgba(99,102,241,0.08)',
                  title: 'Secure & Private',
                  desc: 'Your number and message stay in your browser — nothing is uploaded, logged, or stored on any server.',
                },
              ].map((b, i) => (
                <div key={i} className="wa-benefit-card">
                  <div className="wa-benefit-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="wa-divider" />
        <section className="wa-section-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                What Is a WhatsApp Click-to-Chat Link?
              </h2>
              <p className="leading-7 text-sm">
                A WhatsApp click-to-chat link (also called a wa.me link) is a direct URL that opens a
                chat with a specific number the moment someone clicks it — without them needing to save
                your number as a contact first. It is the standard way businesses add a "Chat on WhatsApp"
                button to their website, Instagram bio, Google Business Profile, or email signature.
              </p>
              <p className="leading-7 text-sm mt-3">
                Instead of asking customers to manually type your number and save it, a single tap opens
                WhatsApp with your number and an optional pre-filled message ready to send — removing
                friction and increasing the number of people who actually reach out.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                wa.me Link vs QR Code — Which Should You Use?
              </h3>
              <p className="leading-7 text-sm">
                Use the wa.me link for digital placements — website buttons, bio links, email signatures,
                and social media ads. Use the QR code version for anything physical — shop counters,
                product packaging, restaurant menus, business cards, and flyers — where customers can
                scan with their phone camera to open the chat instantly.
              </p>
            </div>

            <div className="wa-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Customers unsure how to start a WhatsApp chat with a business',
                  'No easy way to add a WhatsApp button to a website or bio',
                  'Manually typing numbers leads to lost or misdialed leads',
                  'Need a scannable link for print materials or packaging',
                  'Want a pre-filled greeting so replies stay on-topic',
                  'Need a link that works on both mobile and desktop',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="wa-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Small business owners — add a WhatsApp chat button to your site',
                  'Freelancers — share a direct contact link in proposals and invoices',
                  'Online sellers — let buyers ask questions before ordering',
                  'Restaurants & shops — print a QR code for tables and counters',
                  'Marketers — add click-to-chat links to ads and landing pages',
                  'Anyone — share your number without giving it away publicly',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#059669' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="wa-seo-box">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Free, unlimited link generation',
                  'Works for personal & WhatsApp Business numbers',
                  'Pre-filled message support',
                  'Instant downloadable QR code',
                  'One-click copy and open',
                  'No signup, no account required',
                  'Works on mobile & desktop',
                  'Nothing stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="wa-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Best Uses for a WhatsApp Link
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Add a "Chat on WhatsApp" button to your website',
                  'Share a direct link in your Instagram or TikTok bio',
                  'Print a QR code on business cards and packaging',
                  'Add click-to-chat links to Google Ads and Facebook Ads',
                  'Include in email signatures for faster replies',
                  'Set up automatic order-inquiry messages for your shop',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="wa-feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="wa-divider" />
        <section className="wa-section-main py-16 px-6">
          <Script
            id="faq-schema-wa-link"
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
                <details key={i} className="wa-faq-item">
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
        <hr className="wa-divider" />
        <section className="wa-section-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'QR Code Generator', href: '/qr-generator' },
                { name: 'Meta Tag Generator', href: '/metatag-generator' },
                { name: 'Signature Maker', href: '/signature-maker' },
                { name: 'Word Counter', href: '/word-counter' },
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
        <section className="wa-cta-section">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-white">
              Ready to create your WhatsApp link?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes 5 seconds. No signup. No ads.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="wa-cta-btn"
            >
              <MessageCircle className="w-5 h-5" />
              Generate Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}