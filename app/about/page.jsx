import AboutClient from "./AboutClient";

export const metadata = {
  metadataBase: new URL("https://convertlinx.com"),
  alternates: {
    canonical: "https://convertlinx.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
