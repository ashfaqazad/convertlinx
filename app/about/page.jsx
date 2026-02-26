import AboutClient from "./AboutClient";

export const metadata = {
  metadataBase: new URL("https://pdflinx.com"),
  alternates: {
    canonical: "https://pdflinx.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
