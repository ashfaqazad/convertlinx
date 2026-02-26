'use client';

import { useState } from 'react';
import generatePassword from 'generate-password';
import { Copy, Shield, Zap, CheckCircle } from 'lucide-react';
import Script from 'next/script';
import RelatedToolsSection from "@/components/RelatedTools";


export default function PasswordGenerator() {
  const [options, setOptions] = useState({
    length: 16,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    excludeSimilar: true,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePass = () => {
    const newPass = generatePassword.generate({
      length: options.length,
      numbers: options.numbers,
      symbols: options.symbols,
      uppercase: options.uppercase,
      lowercase: options.lowercase,
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

  return (
    <>
      {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
      <Script
        id="howto-schema-password"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Generate Strong Password Online for Free",
            description: "Create secure random passwords with custom settings in seconds.",
            url: "https://pdflinx.com/password-gen",
            step: [
              { "@type": "HowToStep", name: "Choose Options", text: "Select length, include symbols, numbers, uppercase." },
              { "@type": "HowToStep", name: "Generate", text: "Click generate to get multiple strong passwords." },
              { "@type": "HowToStep", name: "Copy", text: "Copy and use securely in your accounts." }
            ],
            totalTime: "PT20S",
            estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            image: "https://pdflinx.com/og-image.png"
          }, null, 2),
        }}
      />

      <Script
        id="breadcrumb-schema-password"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
              { "@type": "ListItem", position: 2, name: "Password Generator", item: "https://pdflinx.com/password-gen" }
            ]
          }, null, 2),
        }}
      />

      {/* ==================== MAIN TOOL SECTION ==================== */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Password Generator Online (Free)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate strong, random passwords instantly. Customize length, symbols, numbers — 100% free, secure, no signup.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Length Slider */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">Password Length</span>
                <span className="text-lg font-bold text-indigo-600">{options.length}</span>
              </div>
              <input
                type="range"
                min={8}
                max={50}
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span>Symbols (!@#$%)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm col-span-2">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span>Exclude similar characters (l,1,I,0,O)</span>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePass}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <Shield size={20} />
              Generate Strong Password
            </button>

            {/* Generated Password */}
            {password && (
              <div className="mt-6 p-4 bg-gray-50 border-2 border-indigo-200 rounded-xl text-center">
                <p className="text-xl font-mono break-all text-gray-800 mb-3">{password}</p>
                <button
                  onClick={copyToClipboard}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2 mx-auto text-sm"
                >
                  <Copy size={18} />
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              </div>
            )}
          </div>

          <p className="text-center mt-6 text-gray-600 text-base">
            No signup • Unlimited passwords • Nothing stored • 100% free
          </p>
        </div>
      </main>

      {/* ==================== SEO CONTENT SECTION ==================== */}
      <section className="mt-16 max-w-4xl mx-auto px-6 pb-16">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Strong Password Generator Online Free - Create Secure Passwords Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate highly secure random passwords with custom length, symbols, numbers, and uppercase letters. Protect your accounts with unbreakable passwords — completely free with PDF Linx.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-lg border border-indigo-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Military-Grade Security</h3>
            <p className="text-gray-600 text-sm">
              Random passwords with symbols, numbers, and mixed case — impossible to crack.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fully Customizable</h3>
            <p className="text-gray-600 text-sm">
              Choose length (8-50), include/exclude symbols, numbers, uppercase, and similar characters.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border border-green-100 text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast, Private & Free</h3>
            <p className="text-gray-600 text-sm">
              Generate unlimited passwords instantly. No signup, no data stored, completely private.
            </p>
          </div>
        </div>

        {/* How To Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            How to Generate Strong Password in 3 Simple Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Customize Options</h4>
              <p className="text-gray-600 text-sm">Set length and choose characters (numbers, symbols, uppercase).</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Generate Password</h4>
              <p className="text-gray-600 text-sm">Click generate to create a strong, random password instantly.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Copy & Use</h4>
              <p className="text-gray-600 text-sm">Copy the password and use it securely for your accounts.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <p className="text-center mt-12 text-base text-gray-600 italic max-w-3xl mx-auto">
          Generate strong passwords every day with PDF Linx — trusted by thousands for secure, fast, and free password creation.
        </p>
      </section>


      <section className="max-w-4xl mx-auto px-4 py-14 text-slate-700">
  {/* Heading */}
  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
    Password Generator Online (Free) – Create Strong Passwords with PDFLinx
  </h2>

  {/* Intro */}
  <p className="text-base leading-7 mb-6">
    Let’s be honest — coming up with a “strong” password is annoying.
    And reusing the same password everywhere is even worse (and risky).
    That’s why we built the <span className="font-medium text-slate-900">PDFLinx Password Generator</span> —
    a free online tool that creates secure, random passwords instantly.
    You can control the password length, include symbols and numbers, and even exclude confusing characters.
    No signup, no tracking, and nothing stored.
  </p>

  {/* What is */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    What Is a Password Generator?
  </h3>
  <p className="leading-7 mb-6">
    A password generator is a tool that creates random passwords that are hard to guess and
    far more secure than passwords humans typically invent. Instead of using common words,
    predictable patterns, or personal info, it generates stronger combinations of uppercase letters,
    lowercase letters, numbers, and symbols — helping you protect accounts from hacks and brute-force attacks.
  </p>

  {/* Why use */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Why Use a Strong Password Generator?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li>Generate truly random passwords (not “easy-to-guess” ones)</li>
    <li>Reduce the risk of account takeovers and password cracking</li>
    <li>Create unique passwords for every site or app</li>
    <li>Customize your password length based on security needs</li>
    <li>Include symbols, numbers, and mixed case for stronger protection</li>
  </ul>

  {/* Steps */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    How to Generate a Strong Password Online
  </h3>
  <ol className="space-y-2 mb-6 list-decimal pl-6">
    <li>Choose your password length using the slider</li>
    <li>Select what to include: uppercase, lowercase, numbers, and symbols</li>
    <li>Optionally enable “Exclude similar characters” (like 1, l, I, 0, O)</li>
    <li>Click “Generate Strong Password”</li>
    <li>Hit “Copy to Clipboard” and use it anywhere</li>
  </ol>

  <p className="mb-6">
    No sign-up, unlimited passwords, nothing stored — 100% free and privacy-friendly.
  </p>

  {/* Features box */}
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
    <h3 className="text-xl font-semibold text-slate-900 mb-4">
      Features of PDFLinx Password Generator
    </h3>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc pl-5">
      <li>100% free password generator</li>
      <li>Adjustable password length slider</li>
      <li>Include/exclude uppercase, lowercase, numbers, and symbols</li>
      <li>Exclude similar characters for easier reading</li>
      <li>One-click “Copy to Clipboard”</li>
      <li>Unlimited password generation</li>
      <li>No storage — your passwords stay private</li>
    </ul>
  </div>

  {/* Audience */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Who Should Use This Tool?
  </h3>
  <ul className="space-y-2 mb-6 list-disc pl-6">
    <li><strong>Everyone:</strong> Anyone who wants safer online accounts</li>
    <li><strong>Remote workers:</strong> Secure logins for tools, dashboards, and email</li>
    <li><strong>Students:</strong> Strong passwords for school portals and apps</li>
    <li><strong>Businesses:</strong> Better password hygiene for teams and internal systems</li>
    <li><strong>Developers:</strong> Quick password generation for testing and accounts</li>
  </ul>

  {/* Safety */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Is PDFLinx Password Generator Safe to Use?
  </h3>
  <p className="leading-7 mb-6">
    Yes — safety and privacy come first. The password is generated instantly and you can copy it right away.
    We do not store generated passwords, and there’s no sign-up required.
    It’s a simple tool built for quick, secure password creation without complications.
  </p>

  {/* Closing */}
  <h3 className="text-xl font-semibold text-slate-900 mb-3">
    Generate Secure Passwords Anytime, Anywhere
  </h3>
  <p className="leading-7">
    PDFLinx Password Generator works smoothly on Windows, macOS, Linux, Android, and iOS.
    Whether you’re on a phone or desktop, you can generate strong passwords instantly using just your browser.
  </p>
</section>


<section className="py-16 bg-gray-50">
  <div className="max-w-4xl mx-auto px-4">

    <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">
      Frequently Asked Questions
    </h2>

    <div className="space-y-4">

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Is the password generator free to use?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — it’s completely free with unlimited password generation and no hidden charges.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Can I customize the password length?
        </summary>
        <p className="mt-2 text-gray-600">
          Absolutely. Use the length slider to create short or long passwords depending on your needs.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          What options can I include in the password?
        </summary>
        <p className="mt-2 text-gray-600">
          You can include uppercase letters, lowercase letters, numbers, and symbols — or turn any of them off.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          What does “Exclude similar characters” mean?
        </summary>
        <p className="mt-2 text-gray-600">
          It removes look-alike characters such as 1, l, I, 0, and O — making the password easier to read and type.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Are generated passwords stored anywhere?
        </summary>
        <p className="mt-2 text-gray-600">
          No. We do not store your generated passwords — they remain private to you.
        </p>
      </details>

      <details className="bg-white rounded-lg shadow-sm p-5">
        <summary className="font-semibold cursor-pointer">
          Can I use this on mobile?
        </summary>
        <p className="mt-2 text-gray-600">
          Yes — the password generator works perfectly on phones, tablets, and desktops.
        </p>
      </details>

    </div>
  </div>
</section>


      <RelatedToolsSection currentPage="password-gen" />
    </>
  );
}




















// 'use client';

// import { useState } from 'react';
// import generatePassword from 'generate-password';
// import { Copy, Shield, Zap, CheckCircle } from 'lucide-react';
// import Script from 'next/script';
// import RelatedToolsSection from "@/components/RelatedTools";


// export default function PasswordGenerator() {
//   const [options, setOptions] = useState({
//     length: 16,
//     numbers: true,
//     symbols: true,
//     uppercase: true,
//     lowercase: true,
//     excludeSimilar: true,
//   });
//   const [password, setPassword] = useState('');
//   const [copied, setCopied] = useState(false);

//   const generatePass = () => {
//     const newPass = generatePassword.generate({
//       length: options.length,
//       numbers: options.numbers,
//       symbols: options.symbols,
//       uppercase: options.uppercase,
//       lowercase: options.lowercase,
//       excludeSimilarCharacters: options.excludeSimilar,
//     });
//     setPassword(newPass);
//     setCopied(false);
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(password);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <>
//       {/* ==================== PAGE-SPECIFIC SEO SCHEMAS ==================== */}
//       <Script
//         id="howto-schema-password"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "HowTo",
//             name: "How to Generate Strong Password Online for Free",
//             description: "Create secure random passwords with custom settings in seconds.",
//             url: "https://pdflinx.com/password-gen",
//             step: [
//               { "@type": "HowToStep", name: "Choose Options", text: "Select length, include symbols, numbers, uppercase." },
//               { "@type": "HowToStep", name: "Generate", text: "Click generate to get multiple strong passwords." },
//               { "@type": "HowToStep", name: "Copy", text: "Copy and use securely in your accounts." }
//             ],
//             totalTime: "PT20S",
//             estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
//             image: "https://pdflinx.com/og-image.png"
//           }, null, 2),
//         }}
//       />

//       <Script
//         id="breadcrumb-schema-password"
//         type="application/ld+json"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               { "@type": "ListItem", position: 1, name: "Home", item: "https://pdflinx.com" },
//               { "@type": "ListItem", position: 2, name: "Password Generator", item: "https://pdflinx.com/password-gen" }
//             ]
//           }, null, 2),
//         }}
//       />

//       {/* ==================== MAIN TOOL SECTION ==================== */}
//       <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
//         <div className="max-w-3xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
//               Password Generator <br /> Online (Free)
//             </h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Generate strong, random passwords instantly. Customize length, symbols, numbers — 100% free, secure, no signup.
//             </p>
//           </div>

//           {/* Tool Card */}
//           <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
//             {/* Length Slider */}
//             <div className="mb-8">
//               <div className="flex justify-between mb-2">
//                 <span className="text-lg font-semibold">Password Length</span>
//                 <span className="text-xl font-bold text-indigo-600">{options.length}</span>
//               </div>
//               <input
//                 type="range"
//                 min={8}
//                 max={50}
//                 value={options.length}
//                 onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
//                 className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
//               />
//             </div>

//             {/* Checkboxes */}
//             <div className="grid grid-cols-2 gap-4 mb-8">
//               <label className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={options.uppercase}
//                   onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
//                   className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span>Uppercase (A-Z)</span>
//               </label>
//               <label className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={options.lowercase}
//                   onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
//                   className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span>Lowercase (a-z)</span>
//               </label>
//               <label className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={options.numbers}
//                   onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
//                   className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span>Numbers (0-9)</span>
//               </label>
//               <label className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={options.symbols}
//                   onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
//                   className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span>Symbols (!@#$%)</span>
//               </label>
//               <label className="flex items-center space-x-3 col-span-2">
//                 <input
//                   type="checkbox"
//                   checked={options.excludeSimilar}
//                   onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
//                   className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
//                 />
//                 <span>Exclude similar characters (l,1,I,0,O)</span>
//               </label>
//             </div>

//             {/* Generate Button */}
//             <button
//               onClick={generatePass}
//               className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-3"
//             >
//               <Shield size={28} />
//               Generate Strong Password
//             </button>

//             {/* Generated Password */}
//             {password && (
//               <div className="mt-8 p-6 bg-gray-50 border-2 border-indigo-200 rounded-2xl text-center">
//                 <p className="text-2xl font-mono break-all text-gray-800 mb-4">{password}</p>
//                 <button
//                   onClick={copyToClipboard}
//                   className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-3 mx-auto"
//                 >
//                   <Copy size={24} />
//                   {copied ? "Copied!" : "Copy to Clipboard"}
//                 </button>
//               </div>
//             )}
//           </div>

//           <p className="text-center mt-6 text-gray-600">
//             No signup • Unlimited passwords • Nothing stored • 100% free
//           </p>
//         </div>
//       </main>

//       {/* ==================== SEO CONTENT SECTION ==================== */}
//       <section className="mt-20 max-w-6xl mx-auto px-6 pb-20">
//         {/* Main Heading */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
//             Strong Password Generator Online Free - Create Secure Passwords Instantly
//           </h2>
//           <p className="text-xl text-gray-600 max-w-4xl mx-auto">
//             Generate highly secure random passwords with custom length, symbols, numbers, and uppercase letters. Protect your accounts with unbreakable passwords — completely free with PDF Linx.
//           </p>
//         </div>

//         {/* Benefits Grid */}
//         <div className="grid md:grid-cols-3 gap-10 mb-20">
//           <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl shadow-xl border border-indigo-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Shield className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Military-Grade Security</h3>
//             <p className="text-gray-600">
//               Random passwords with symbols, numbers, and mixed case — impossible to crack.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl shadow-xl border border-purple-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Zap className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fully Customizable</h3>
//             <p className="text-gray-600">
//               Choose length (8-50), include/exclude symbols, numbers, uppercase, and similar characters.
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl shadow-xl border border-green-100 text-center hover:shadow-2xl transition">
//             <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-10 h-10 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast, Private & Free</h3>
//             <p className="text-gray-600">
//               Generate unlimited passwords instantly. No signup, no data stored, completely private.
//             </p>
//           </div>
//         </div>

//         {/* How To Steps */}
//         <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-20 border border-gray-100">
//           <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
//             How to Generate Strong Password in 3 Simple Steps
//           </h3>
//           <div className="grid md:grid-cols-3 gap-12">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 1
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Customize Options</h4>
//               <p className="text-gray-600 text-lg">Set length and choose characters (numbers, symbols, uppercase).</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 2
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Generate Password</h4>
//               <p className="text-gray-600 text-lg">Click generate to create a strong, random password instantly.</p>
//             </div>

//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold text-white shadow-2xl">
//                 3
//               </div>
//               <h4 className="text-2xl font-semibold mb-4">Copy & Use</h4>
//               <p className="text-gray-600 text-lg">Copy the password and use it securely for your accounts.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <p className="text-center mt-16 text-xl text-gray-600 italic max-w-4xl mx-auto">
//           Generate strong passwords every day with PDF Linx — trusted by thousands for secure, fast, and free password creation.
//         </p>
//       </section>
        
//         <RelatedToolsSection currentPage="password-gen" />
      
//     </>
//   );
// }
















// // 'use client';
// // import { useState } from 'react';
// // import generatePassword from 'generate-password';  // npm install generate-password

// // export default function PasswordGenerator() {
// //   const [options, setOptions] = useState({
// //     length: 12,
// //     numbers: true,
// //     symbols: true,
// //     uppercase: true,
// //     lowercase: true,
// //   });
// //   const [password, setPassword] = useState('');

// //   const generatePass = () => {
// //     const newPass = generatePassword.generate({
// //       length: options.length,
// //       numbers: options.numbers,
// //       symbols: options.symbols,
// //       uppercase: options.uppercase,
// //       lowercase: options.lowercase,
// //       excludeSimilarCharacters: true,
// //     });
// //     setPassword(newPass);
// //   };

// //   return (
// //     <div className="p-8 max-w-md mx-auto">
// //       <h1 className="text-2xl font-bold mb-4">Secure Password Generator</h1>
// //       <div className="space-y-2 mb-4">
// //         <label>Length: {options.length}</label>
// //         <input
// //           type="range"
// //           min={8}
// //           max={50}
// //           value={options.length}
// //           onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
// //           className="w-full"
// //         />
// //       </div>
// //       {/* Add checkboxes for numbers/symbols etc. – simple bool toggle */}
// //       <button onClick={generatePass} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
// //         Generate Password
// //       </button>
// //       {password && (
// //         <div className="bg-gray-100 p-4 rounded">
// //           <p className="font-mono text-lg">{password}</p>
// //           <button
// //             onClick={() => navigator.clipboard.writeText(password)}
// //             className="mt-2 text-sm text-blue-500"
// //           >
// //             Copy to Clipboard
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
