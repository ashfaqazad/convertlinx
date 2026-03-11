import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact ConvertLinx - Support and Feedback for Free Online Tools",
  description:
    "Questions, suggestions, bug reports or just saying hi? Use the form or email support@convertlinx.com. Fast replies from the solo dev behind ConvertLinx.",

  openGraph: {
    title: "Contact ConvertLinx",
    description:
      "Get in touch for help, ideas, or feedback on free online converter and utility tools.",
    url: "https://convertlinx.com/contact",
    siteName: "ConvertLinx",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  alternates: {
    canonical: "https://convertlinx.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}