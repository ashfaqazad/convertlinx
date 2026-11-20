import AboutClient from "./AboutClient";

export const metadata = {
  title: "About",
  description:
    "ConvertLinx is a growing set of free online tools for images, documents, audio, video and everyday tasks. No sign-ups, no watermarks, privacy-minded by design.",
  alternates: {
    canonical: "https://convertlinx.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
























// import AboutClient from "./AboutClient";

// export const metadata = {
//   metadataBase: new URL("https://convertlinx.com"),
//   alternates: {
//     canonical: "https://convertlinx.com/about",
//   },
// };

// export default function AboutPage() {
//   return <AboutClient />;
// }
