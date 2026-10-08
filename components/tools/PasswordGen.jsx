'use client';

import { useState } from 'react';
import generatePassword from 'generate-password';
import { Copy, Shield, Zap, CheckCircle, ChevronDown, RefreshCw } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import '@/styles/PasswordGenerator.css';
import PDFLinxEmbedWrapper from "@/components/embeds/PDFLinxEmbedWrapper";

/* ── Password strength helper ── */
function getStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 20) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score: 20,  label: 'Weak',       color: '#EF4444' };
  if (score === 2) return { score: 40,  label: 'Fair',       color: '#F59E0B' };
  if (score === 3) return { score: 60,  label: 'Good',       color: '#3B82F6' };
  if (score === 4) return { score: 80,  label: 'Strong',     color: '#8B5CF6' };
  return             { score: 100, label: 'Very Strong', color: '#10B981' };
}

/* ── FAQ data ── */
const faqs = [
  { q: 'Is the password generator free?',
    a: 'Yes — completely free with unlimited password generation and no hidden charges or signup required.' },
  { q: 'Can I customize the password length?',
    a: 'Absolutely. Use the slider to create passwords from 8 to 50 characters — any length you need.' },
  { q: 'What character options can I include?',
    a: 'Uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#$%) — turn any combination on or off as needed.' },
  { q: 'What does "Exclude similar characters" mean?',
    a: 'It removes look-alike characters like 1, l, I, 0, and O — making passwords easier to read and type without mistakes.' },
  { q: 'Are generated passwords stored anywhere?',
    a: 'No. Passwords are generated entirely in your browser and are never sent to or stored on any server. They remain completely private.' },
  { q: 'Does it work on mobile?',
    a: 'Yes — fully optimized for phones, tablets, and desktop computers. Works in any modern browser without installing anything.' },
  { q: 'How strong should my password be?',
    a: 'A strong password should be at least 12 characters long and include uppercase, lowercase, numbers, and symbols. For critical accounts like banking or email, 16+ characters is recommended.' },
  { q: 'Can I use this for Wi-Fi or router passwords?',
    a: 'Yes — the generator works great for Wi-Fi passwords, router admin passwords, and any other account. Use 12–20 characters with symbols for best security.' },
  { q: 'Should I use a different password for every account?',
    a: 'Yes — using unique passwords for every account is the most important security habit. If one account is breached, your other accounts stay safe. A password manager can help you store them all.' },
];

export default function PasswordGenerator() {
  const [options, setOptions] = useState({
    length:         16,
    numbers:        true,
    symbols:        true,
    uppercase:      true,
    lowercase:      true,
    excludeSimilar: true,
  });
  const [password, setPassword] = useState('');
  const [copied,   setCopied]   = useState(false);

  const generatePass = () => {
    const newPass = generatePassword.generate({
      length:                   options.length,
      numbers:                  options.numbers,
      symbols:                  options.symbols,
      uppercase:                options.uppercase,
      lowercase:                options.lowercase,
      excludeSimilarCharacters: options.excludeSimilar,
    });
    setPassword(newPass);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password);

  const checkboxOptions = [
    { key: 'uppercase', label: 'Uppercase (A-Z)' },
    { key: 'lowercase', label: 'Lowercase (a-z)' },
    { key: 'numbers',   label: 'Numbers (0-9)'   },
    { key: 'symbols',   label: 'Symbols (!@#$%)' },
  ];

  return (
    <>
      {/* ── SCHEMA: HowTo ── */}
      <Script id="howto-schema-password" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'HowTo',
            name: 'How to Generate a Strong Password Online for Free',
            description: 'Create secure, random passwords with custom length, symbols, and numbers in seconds — free, private, no signup.',
            url: 'https://convertlinx.com/password-gen',
            totalTime: 'PT20S',
            estimatedCost: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
            supply: [{ '@type': 'HowToSupply', name: 'No files needed — works in browser' }],
            tool:  [{ '@type': 'HowToTool',   name: 'ConvertLinx Password Generator'     }],
            step: [
              { '@type': 'HowToStep', name: 'Customize Options', text: 'Set password length using the slider and choose which characters to include — uppercase, lowercase, numbers, and symbols.' },
              { '@type': 'HowToStep', name: 'Generate Password', text: 'Click Generate Strong Password to instantly create a secure random password.' },
              { '@type': 'HowToStep', name: 'Copy & Use',        text: 'Click Copy to Clipboard and use the password securely for your account.' },
            ],
          }),
        }}
      />

      {/* ── SCHEMA: FAQPage ── */}
      <Script id="faq-schema-password" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />

      <main className="pg-page">

        {/* ── HERO ── */}
        <section className="hero-bg py-16 px-6 text-center">
          <div className="hero-blob-1" />
          <div className="hero-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="breadcrumb-link">Home</a>
              <span style={{ color: '#C4B5FD' }}>/</span>
              <span style={{ color: '#6366F1' }}>Password Generator</span>
            </div>
            <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">Free Tool</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1a1a2e' }}>
              Password <span className="grad-text">Generator</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
              Generate strong, random passwords instantly for Gmail, banking, social media, and
              work accounts. Customize length, symbols, numbers, and uppercase letters —
              100% private, nothing stored, no signup required.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['No upload needed', 'Unlimited passwords', 'Nothing stored', 'Strength indicator', '100% private'].map((t, i) => (
                <span key={i} className="badge-pill px-3 py-1 rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="main-section py-10 px-6">
          <div className="max-w-2xl mx-auto fade-up">
            <div className="tool-card rounded-3xl p-8 md:p-10">

              {/* Length Slider */}
              <div className="mb-7">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: '#6366F1', fontSize: '11px', letterSpacing: '0.09em' }}>
                    Password Length
                  </label>
                  <span className="text-2xl font-extrabold grad-text">{options.length}</span>
                </div>
                <input type="range" min={8} max={50} value={options.length}
                  onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                  className="length-slider" />
                <div className="flex justify-between text-xs mt-1" style={{ color: '#A5B4FC' }}>
                  <span>8</span><span>50</span>
                </div>
              </div>

              {/* Options Grid */}
              <div className="mb-7">
                <label className="block mb-3 text-sm font-bold uppercase tracking-widest"
                  style={{ color: '#6366F1', fontSize: '11px', letterSpacing: '0.09em' }}>
                  Include Characters
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {checkboxOptions.map(({ key, label }) => (
                    <label key={key} className={`option-row ${options[key] ? 'checked' : ''}`}>
                      <input type="checkbox" checked={options[key]}
                        onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                        className="pg-checkbox" />
                      <span className="text-sm font-medium" style={{ color: '#374151' }}>{label}</span>
                    </label>
                  ))}
                </div>
                <label className={`option-row mt-3 ${options.excludeSimilar ? 'checked' : ''}`}>
                  <input type="checkbox" checked={options.excludeSimilar}
                    onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
                    className="pg-checkbox" />
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>
                    Exclude similar characters
                    <span className="ml-1 text-xs" style={{ color: '#9CA3AF' }}>(l, 1, I, 0, O)</span>
                  </span>
                </label>
              </div>

              {/* Generate Button */}
              <button onClick={generatePass}
                className="generate-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base mb-6">
                <RefreshCw className="w-5 h-5" />
                Generate Strong Password
              </button>

              {/* Password Output */}
              {password && (
                <div className={`password-output p-5 ${password ? 'active' : ''}`}>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Strength</span>
                      <span className="text-xs font-bold" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="strength-bar-wrap">
                      <div className="strength-bar" style={{ width: `${strength.score}%`, background: strength.color }} />
                    </div>
                  </div>
                  <p className="text-lg font-mono break-all text-center mb-4 select-all"
                    style={{ color: '#1a1a2e', letterSpacing: '0.04em' }}>
                    {password}
                  </p>
                  <button onClick={copyToClipboard}
                    className={`copy-btn w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm ${copied ? 'copied' : ''}`}>
                    {copied
                      ? <><CheckCircle className="w-4 h-4" /> Copied!</>
                      : <><Copy className="w-4 h-4" /> Copy to Clipboard</>
                    }
                  </button>
                </div>
              )}

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-5">
                {['No signup', 'Unlimited passwords', 'Nothing stored', '100% free'].map((t, i) => (
                  <span key={i} className="text-xs flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#A5B4FC' }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Why Use ConvertLinx?
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <Shield className="w-6 h-6" />,      color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  title: 'Military-Grade Security', desc: 'Random passwords with symbols, numbers, and mixed case — impossible to guess or brute-force by attackers.' },
                { icon: <Zap className="w-6 h-6" />,         color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  title: 'Fully Customizable',      desc: 'Choose length (8–50 characters), include or exclude symbols, numbers, uppercase, and confusable characters.' },
                { icon: <CheckCircle className="w-6 h-6" />, color: '#10B981', bg: 'rgba(16,185,129,0.08)',  title: 'Fast, Private & Free',    desc: 'Unlimited passwords instantly. No signup, no data stored, completely private — runs entirely in your browser.' },
              ].map((b, i) => (
                <div key={i} className="benefit-card rounded-2xl p-7">
                  <div className="p-3 rounded-xl inline-flex mb-5" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1a1a2e' }}>3 Simple Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Customize Options', desc: 'Set length using the slider and choose characters — numbers, symbols, uppercase, or all of them together.' },
                { num: '2', title: 'Generate Password', desc: 'Click Generate to create a strong, random password instantly. Regenerate as many times as you need.' },
                { num: '3', title: 'Copy & Use',        desc: 'Click Copy to Clipboard and paste it directly into your account signup or settings page.' },
              ].map((s, i) => (
                <div key={i} className="step-card rounded-2xl p-7 text-center">
                  <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">{s.num}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: '#6B7280' }}>

            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>
                Why You Need a Strong Password Generator
              </h2>
              <p className="leading-7 text-sm">
                Passwords that humans create tend to follow predictable patterns — names, dates,
                keyboard sequences. Hackers exploit these patterns using dictionary attacks and
                brute-force tools that can crack weak passwords in seconds. A random password
                generator creates combinations that are mathematically impossible to guess,
                giving your Gmail, banking, social media, and work accounts real protection.
              </p>
              <p className="leading-7 text-sm mt-3">
                This free online password generator runs entirely in your browser — nothing is
                sent to any server, and no passwords are ever logged or stored. Generate as many
                passwords as you need, instantly and privately.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1a1a2e' }}>
                How Long Should a Password Be?
              </h3>
              <p className="leading-7 text-sm">
                Security experts recommend at least 12 characters for regular accounts and 16 or
                more for sensitive ones like email, banking, and work systems. The longer the
                password, the exponentially harder it is to crack. This tool lets you go up to
                50 characters — use the slider to find the right balance of length and usability
                for each account.
              </p>
            </div>

            <div className="seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>
                Common Problems This Tool Solves
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Reusing the same password across multiple accounts',
                  'Using weak passwords like names or dates',
                  'Need a strong Wi-Fi or router admin password',
                  'Creating secure passwords for new account signups',
                  'Generating passwords that meet strict site requirements',
                  'Avoiding look-alike characters that cause login errors',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Who Should Use This?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Everyone — stronger passwords for every online account',
                  'Remote workers — secure logins for company systems',
                  'Students — protect school portals and learning apps',
                  'Businesses — enforce good password hygiene across teams',
                  'Developers — generate test credentials and API keys',
                  'Anyone — avoid reusing old weak passwords',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold mt-0.5" style={{ color: '#6366F1' }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1a1a2e' }}>Features</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  '100% free, no hidden costs',
                  'Adjustable length (8–50 characters)',
                  'Uppercase, lowercase, numbers, symbols',
                  'Exclude similar characters option',
                  'Password strength indicator',
                  'One-click copy to clipboard',
                  'Works on mobile & desktop',
                  'No passwords stored — full privacy',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── PDF EMBED ── */}
        <div className="text-center">
          <h2>Free PDF Tool</h2>
          <PDFLinxEmbedWrapper tool="word-to-pdf" />
        </div>

        {/* ── FAQ ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#6366F1' }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: '#1a1a2e' }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Image to Text',    href: '/image-to-text'    },
                { name: 'Image Compressor', href: '/image-compressor' },
                { name: 'Image Converter',  href: '/image-converter'  },
                { name: 'QR Generator',     href: '/qr-generator'     },
                { name: 'Image Cropper',    href: '/image-cropper'    },
                { name: 'Image Resizer',    href: '/image-resizer'    },
              ].map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ color: '#9f1239', borderColor: '#FDA4AF', background: '#fff' }}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to generate your password?
            </h2>
            <p className="mb-8 text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Takes less than 5 seconds. No signup. No ads.
            </p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cta-main-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2">
              <Shield className="w-5 h-5" /> Generate Password Now
            </button>
          </div>
        </section>

      </main>
    </>
  );
}

