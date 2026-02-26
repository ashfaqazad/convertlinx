import { Metadata } from 'next';

export const metadata = {
  title: 'Terms and Conditions | PDF Linx',
  description: 'Read the terms and conditions for using PDF Linx tools and services. Free online PDF tools for everyone.',
  alternates: {
    canonical: 'https://pdflinx.com/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms and Conditions | PDF Linx',
    url: 'https://pdflinx.com/terms-and-conditions',
  },
};

export default function TermsAndConditions() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms and Conditions - PDF Linx',
    description: 'Read the terms and conditions for using PDF Linx tools and services.',
    url: 'https://pdflinx.com/terms-and-conditions',
    publisher: {
      '@type': 'Organization',
      name: 'PDF Linx',
      url: 'https://pdflinx.com',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data - safe rendering */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>

        <p className="mb-4">
          Welcome to PDF Linx. By accessing or using our website, you agree to be
          bound by the following Terms and Conditions. If you do not agree with any
          part of these terms, please discontinue using our website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Use of Our Service</h2>
        <p className="mb-4">
          Our online PDF tools are provided for personal and educational use. You
          may not use our service for any unlawful, harmful, or commercial purpose
          that violates local or international laws.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Intellectual Property</h2>
        <p className="mb-4">
          All website content, logos, and design elements are owned by PDF Linx
          unless otherwise stated. You may not reproduce or distribute any part of
          this website without written permission.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Uploaded Files and Data</h2>
        <p className="mb-4">
          All files uploaded for conversion are processed securely and are not
          stored permanently. PDF Linx does not review, share, or claim ownership
          of your uploaded files. You are responsible for ensuring that the files
          you upload comply with applicable copyright laws.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Disclaimer of Warranties</h2>
        <p className="mb-4">
          The services provided on this website are offered &quot;as is&quot; without
          warranties of any kind. PDF Linx makes no guarantees regarding accuracy,
          performance, or uninterrupted availability of the tools.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <p className="mb-4">
          PDF Linx shall not be held liable for any damages, data loss, or issues
          arising from the use or inability to use the website or its services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Google AdSense and Third-Party Ads</h2>
        <p className="mb-4">
          This website may display advertisements served by Google AdSense and
          other third-party partners. These services may use cookies to show
          personalized advertisements. By using PDF Linx, you consent to such ad
          practices as governed by Google&apos;s{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Advertising Policies
          </a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to These Terms</h2>
        <p className="mb-4">
          PDF Linx reserves the right to modify or update these Terms and Conditions
          at any time. Continued use of the website after such changes constitutes
          acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          For any questions regarding these Terms and Conditions, please contact
          us at:{' '}
          <span className="font-medium">support@pdflinx.com</span>
        </p>
      </div>
    </>
  );
}