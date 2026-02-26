import { Metadata } from 'next';

export const metadata = {
  title: 'Privacy Policy - PDF Linx',
  description: 'Learn how PDF Linx protects your privacy and handles your data.',
  alternates: {
    canonical: 'https://pdflinx.com/privacy-policy',
  },
};

export default function PrivacyPolicy() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - PDF Linx',
    description: 'Learn how PDF Linx protects your privacy and handles your data.',
    url: 'https://pdflinx.com/privacy-policy',
    publisher: {
      '@type': 'Organization',
      name: 'PDF Linx',
      url: 'https://pdflinx.com',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data - safe for server rendering */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

        <p className="mb-4">
          Welcome to PDF Linx. Your privacy is very important to us. This Privacy
          Policy explains how we collect, use, and protect your personal
          information when you use our website and services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <p className="mb-4">
          We may collect basic information such as browser type, device details,
          and anonymous usage statistics to improve our website. When you contact
          us through forms, we may collect your name and email address.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <p className="mb-4">
          The information collected is used to enhance user experience, analyze
          website performance, and improve our services. PDF Linx does not sell,
          rent, or share your personal information with third parties for
          marketing purposes.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
        <p className="mb-4">
          We use cookies to improve website performance and to display relevant
          advertisements through Google AdSense. You can disable cookies in your
          browser settings at any time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Google AdSense</h2>
        <p className="mb-4">
          PDF Linx uses Google AdSense, a service for displaying advertisements.
          Google may use cookies or web beacons to show ads based on your visits to
          this and other websites. You can learn more about how Google uses data by visiting{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s Advertising Policies
          </a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Links</h2>
        <p className="mb-4">
          Our website may contain links to third-party websites. PDF Linx is not
          responsible for the privacy practices or content of those external
          sites.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect your data. However, no method of
          transmission over the internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
        <p className="mb-4">
          PDF Linx may update this Privacy Policy from time to time. Any changes
          will be posted on this page with an updated revision date.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at: <span className="font-medium">support@pdflinx.com</span>
        </p>
      </div>
    </>
  );
}