"use client";

import { useState, useRef, useEffect, useMemo, Fragment } from "react";
import {
  Music,
  FileVideo,
  Upload,
  Download,
  Check,
  X,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import Script from "next/script";
import NextLink from "next/link";
import { loadFfmpegLibs } from "@/lib/loadFfmpeg";
import "@/styles/Mp4tomp3.css";

/* ───────────────────────── constants ───────────────────────── */

const LINK_CLS = "text-indigo-600 hover:underline font-medium";
const MAX_FILE_MB = 100;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const MAX_FILES = 10;

/* Single-thread core: no COOP/COEP headers needed. Loaded only after a file is added. */
const CORE_BASE = "/ffmpeg";

const ALLOWED_EXT = ["mp4", "m4v", "mov", "mkv", "webm", "avi", "3gp", "flv", "wmv", "mpeg", "mpg"];

const QUALITY = [
  { kbps: 64, label: "Smallest", note: "64 kbps" },
  { kbps: 128, label: "Speech", note: "128 kbps" },
  { kbps: 192, label: "Music", note: "192 kbps" },
  { kbps: 320, label: "Best", note: "320 kbps" },
];

const sectionLabelStyle = {
  color: "#6366F1",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
};

const inputCls = "mp-input w-full px-4 py-3 rounded-xl text-sm";

/* ───────────────────────── helpers ───────────────────────── */

const formatBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const getExt = (name) => (name.split(".").pop() || "").toLowerCase();

const baseName = (name) => name.replace(/\.[^.]+$/, "") || "audio";

let uid = 0;
const nextId = () => `v${Date.now().toString(36)}${uid++}`;

function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ── Rich text: strings + contextual internal links, one source for UI and schema ── */
const lk = (text, href) => ({ text, href });
const toPlain = (parts) =>
  parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
const Rich = ({ parts }) => (
  <>
    {parts.map((p, i) =>
      typeof p === "string" ? (
        <Fragment key={i}>{p}</Fragment>
      ) : (
        <NextLink key={i} href={p.href} className={LINK_CLS}>
          {p.text}
        </NextLink>
      ),
    )}
  </>
);

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-xs font-semibold" style={{ color: "#4B5563" }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="block mt-1 text-xs" style={{ color: "#9CA3AF" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

/* ───────────────────────── content ───────────────────────── */

const seoPrivate = [
  "This MP4 to MP3 converter extracts the audio from your video right in your browser. Your video is never uploaded to a server, so personal recordings, lectures, and meetings stay on your device. There is no signup, no watermark, and no daily limit. The first time you add a video, the converter engine (about 30 MB) is downloaded once and then cached by your browser, so later conversions start faster.",
];
const seoHow = [
  "To convert MP4 to MP3, add your video, choose a quality, and press Convert. The tool removes the video track and saves the sound as an MP3 file you can play on any phone, car stereo, or music app. It works the same way for other video formats such as MOV, MKV, WebM, AVI, and 3GP. Need a different audio format like WAV, OGG, or M4A? Use the ",
  lk("Audio Converter", "/audio-converter"),
  ".",
];
const seoQuality = [
  "Quality sets the MP3 bitrate, which balances file size and sound. 128 kbps is plenty for speech, lectures, and podcasts. 192 kbps suits most music, and 320 kbps is the closest to the original audio. A higher bitrate cannot add detail that was missing from the video, so a low-quality video will still sound the same at 320 kbps, only in a larger file. Choose Mono for voice recordings to make the file about half the size. If you want lossless audio for editing, convert to WAV with the ",
  lk("Audio Converter", "/audio-converter"),
  " instead.",
];
const seoUse = [
  "People use a video to MP3 converter to save a lecture or interview as an audio file, turn a recorded meeting into something easy to replay, pull the soundtrack out of their own video, or listen to a long video without using screen time or mobile data. Only convert videos you own or have permission to use. If you need a voiceover rather than a recording, you can create one from written text with our ",
  lk("Text to Speech", "/text-to-speech"),
  " tool, which saves MP3 files too.",
];
const seoLimit = [
  "Because everything happens inside your browser, large videos use a lot of memory. This tool accepts videos up to " + MAX_FILE_MB + " MB, and up to " + MAX_FILES + " videos at a time. For best results on phones, convert one video at a time and keep the tab open until it finishes.",
];

const faqs = [
  {
    q: "Is this MP4 to MP3 converter free?",
    a: ["Yes. It is completely free, with no signup, no watermark, and no daily limit."],
  },
  {
    q: "Is my video uploaded to a server?",
    a: [
      "No. The conversion runs in your browser, so your video never leaves your device. Only the converter engine itself (about 30 MB) is downloaded from our site the first time you use the tool.",
    ],
  },
  {
    q: "How do I convert MP4 to MP3?",
    a: [
      "Add your MP4 file, pick a quality, and press Convert. When the progress bar finishes, click Download to save the MP3.",
    ],
  },
  {
    q: "Which video formats are supported?",
    a: [
      "MP4, M4V, MOV, MKV, WebM, AVI, 3GP, FLV, WMV, and MPEG. The video part is removed and only the audio is saved.",
    ],
  },
  {
    q: "Which MP3 quality should I choose?",
    a: [
      "Use 128 kbps for speech, 192 kbps for most music, and 320 kbps for the best quality. Smallest (64 kbps) is fine for voice notes where file size matters most.",
    ],
  },
  {
    q: "Will converting reduce the audio quality?",
    a: [
      "MP3 is a compressed format, so there is always a small loss compared with the original track. At 192 kbps or higher most people cannot hear a difference.",
    ],
  },
  {
    q: "Why does the first conversion take longer?",
    a: [
      "The first time, your browser downloads the converter engine (about 30 MB). It starts downloading as soon as you add a video, so it is usually ready by the time you press Convert. After that it is cached.",
    ],
  },
  {
    q: "What is the maximum video size?",
    a: [
      "Each video can be up to " + MAX_FILE_MB + " MB, and you can add up to " + MAX_FILES + " videos at once. Larger files can run out of browser memory.",
    ],
  },
  {
    q: "Why did my video fail to convert?",
    a: [
      "The file may be damaged, or the video may have no audio track. Try playing it first. If it plays with sound, try a smaller file or a different browser.",
    ],
  },
  {
    q: "Does it work on iPhone and Android?",
    a: [
      "Yes, on modern mobile browsers. Large videos can be slow on older phones, so convert one at a time and keep the page open until it finishes.",
    ],
  },
  {
    q: "Can I turn text into an MP3 instead of a video?",
    a: [
      "Yes. Our ",
      lk("Text to Speech", "/text-to-speech"),
      " tool reads your text with a natural voice and lets you download it as an MP3, WAV, OGG, M4A, AAC, FLAC, or MP4 file.",
    ],
  },
  {
    q: "Can I convert to WAV, OGG, or M4A instead?",
    a: [
      "Yes. Use our ",
      lk("Audio Converter", "/audio-converter"),
      ", which also accepts video files and supports MP3, WAV, OGG, M4A, and AAC.",
    ],
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert MP4 to MP3 Online for Free",
  description:
    "Extract audio from an MP4 or other video and save it as MP3 in your browser. Free, private, no upload, no signup.",
  url: "https://convertlinx.com/mp4-to-mp3",
  totalTime: "PT1M",
  estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
  supply: [{ "@type": "HowToSupply", name: "A video file such as MP4" }],
  tool: [{ "@type": "HowToTool", name: "ConvertLinx MP4 to MP3 Converter" }],
  step: [
    { "@type": "HowToStep", name: "Add Your Video", text: "Drag and drop an MP4 or other video file, or click to choose it from your device." },
    { "@type": "HowToStep", name: "Choose Quality", text: "Pick a bitrate for the MP3 and choose stereo or mono." },
    { "@type": "HowToStep", name: "Convert and Download", text: "Press Convert, then download the MP3 file." },
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ConvertLinx MP4 to MP3 Converter",
  url: "https://convertlinx.com/mp4-to-mp3",
  description:
    "Free online MP4 to MP3 converter that works in your browser. Extract audio from video with no upload and no signup.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: toPlain(faq.a) },
  })),
};

/* ───────────────────────── component ───────────────────────── */

export default function Mp4ToMp3({ initialBitrate = 192 }) {
  const [items, setItems] = useState([]);
  const [bitrate, setBitrate] = useState(initialBitrate);
  const [mono, setMono] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadState, setLoadState] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  const ffmpegRef = useRef(null);
  const loadPromiseRef = useRef(null);
  const currentRef = useRef(null);
  const cancelRef = useRef(false);
  const itemsRef = useRef([]);
  itemsRef.current = items;

  const doneCount = useMemo(() => items.filter((i) => i.status === "done").length, [items]);

  /* free object URLs and stop ffmpeg when leaving the page */
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((i) => i.url && URL.revokeObjectURL(i.url));
      try {
        ffmpegRef.current && ffmpegRef.current.terminate();
      } catch (e) {}
    };
  }, []);

  const patch = (id, changes) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));

  /* Lazy-load ffmpeg.wasm (single thread). Safe to call many times. */
  const ensureLoaded = () => {
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = (async () => {
      setLoadState("loading");
      const { FFmpeg, toBlobURL } = await loadFfmpegLibs();
      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress }) => {
        const id = currentRef.current;
        if (!id) return;
        const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
        patch(id, { progress: p });
      });
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
      setLoadState("ready");
      return ffmpeg;
    })().catch((e) => {
      loadPromiseRef.current = null;
      setLoadState("error");
      throw e;
    });

    return loadPromiseRef.current;
  };

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    const problems = [];
    const accepted = [];
    let room = MAX_FILES - items.length;

    for (const file of incoming) {
      if (!ALLOWED_EXT.includes(getExt(file.name)) && !/^video\//.test(file.type)) {
        problems.push(`${file.name}: not a video file.`);
      } else if (file.size > MAX_FILE_BYTES) {
        problems.push(`${file.name}: larger than ${MAX_FILE_MB} MB.`);
      } else if (room <= 0) {
        problems.push(`${file.name}: limit of ${MAX_FILES} files reached.`);
      } else {
        accepted.push({
          id: nextId(),
          file,
          status: "pending",
          progress: 0,
          url: "",
          outName: "",
          outSize: 0,
          error: "",
        });
        room--;
      }
    }

    setError(problems.join(" "));
    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted]);
      ensureLoaded().catch(() => {}); // start downloading the engine early
    }
  };

  const removeItem = (id) => {
    const it = items.find((i) => i.id === id);
    if (it && it.url) URL.revokeObjectURL(it.url);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleReset = () => {
    if (busy) return;
    items.forEach((i) => i.url && URL.revokeObjectURL(i.url));
    setItems([]);
    setError("");
  };

  const handleCancel = () => {
    cancelRef.current = true;
    try {
      ffmpegRef.current && ffmpegRef.current.terminate();
    } catch (e) {}
    ffmpegRef.current = null;
    loadPromiseRef.current = null;
    setLoadState("idle");
  };

  const handleConvert = async () => {
    if (busy || !items.length) return;
    setBusy(true);
    setError("");
    cancelRef.current = false;

    let ffmpeg;
    try {
      ffmpeg = await ensureLoaded();
    } catch (e) {
      setError(
        "Could not load the converter engine. Check your internet connection and try again.",
      );
      setBusy(false);
      return;
    }

    const queue = [...itemsRef.current];
    for (const it of queue) {
      if (cancelRef.current) break;

      if (it.url) URL.revokeObjectURL(it.url);
      patch(it.id, { status: "converting", progress: 0, url: "", error: "" });
      currentRef.current = it.id;

      const inExt = getExt(it.file.name).replace(/[^a-z0-9]/g, "") || "mp4";
      const inName = `in-${it.id}.${inExt}`;
      const outName = `out-${it.id}.mp3`;

      try {
        await ffmpeg.writeFile(inName, new Uint8Array(await it.file.arrayBuffer()));
        const args = ["-i", inName, "-vn", "-c:a", "libmp3lame", "-b:a", `${bitrate}k`];
        if (mono) args.push("-ac", "1");
        args.push(outName);

        const code = await ffmpeg.exec(args);
        if (code !== 0) throw new Error("ffmpeg failed");

        const data = await ffmpeg.readFile(outName);
        const blob = new Blob([data], { type: "audio/mpeg" });
        patch(it.id, {
          status: "done",
          progress: 1,
          url: URL.createObjectURL(blob),
          outName: `${baseName(it.file.name)}.mp3`,
          outSize: blob.size,
        });
      } catch (e) {
        if (cancelRef.current) {
          patch(it.id, { status: "pending", progress: 0 });
        } else {
          patch(it.id, {
            status: "error",
            error: "This video could not be converted. It may be damaged or have no audio track.",
          });
        }
      } finally {
        try {
          await ffmpeg.deleteFile(inName);
          await ffmpeg.deleteFile(outName);
        } catch (e) {}
      }
    }

    currentRef.current = null;
    setBusy(false);
  };

  const actionBtnStyle = (disabled) => ({
    color: "#4338CA",
    borderColor: "#C7D2FE",
    background: "#fff",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const convertLabel = busy
    ? "Converting..."
    : doneCount > 0
      ? "Convert again to MP3"
      : "Convert to MP3";

  return (
    <>
      {/* ── SCHEMA: HowTo + WebApplication + FAQPage ── */}
      <Script
        id="howto-schema-mp4mp3"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="app-schema-mp4mp3"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <Script
        id="faq-schema-mp4mp3"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="mp-page">
        {/* ── HERO ── */}
        <section className="hero-bg py-16 px-6 text-center">
          <div className="hero-blob-1" />
          <div className="hero-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="breadcrumb-link">
                Home
              </a>
              <span style={{ color: "#C4B5FD" }}>/</span>
              <span style={{ color: "#6366F1" }}>MP4 to MP3</span>
            </div>
            <span className="badge-pill inline-block px-4 py-1.5 rounded-full mb-5">
              Free Tool
            </span>
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
              style={{ color: "#1a1a2e" }}
            >
              MP4 to MP3 <span className="grad-text">Converter</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Extract audio from any video and save it as MP3, right in your
              browser. Your video is never uploaded, so it stays private. No
              signup, no watermark, no limits on how often you use it.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                "No upload",
                "MP4 · MOV · MKV · WebM",
                "Up to 320 kbps",
                "Stereo or mono",
                "No signup needed",
                "100% private",
              ].map((t, i) => (
                <span key={i} className="badge-pill px-3 py-1 rounded-full text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="main-section py-10 px-6">
          <div className="max-w-5xl mx-auto fade-up">
            <div className="tool-card rounded-3xl p-6 md:p-10">
              <div className="grid md:grid-cols-5 gap-8">
                {/* ── LEFT: files ── */}
                <div className="md:col-span-3">
                  <p className="mb-3" style={sectionLabelStyle}>
                    1 · Add your videos
                  </p>

                  <label
                    className={`mp-drop rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center ${drag ? "drag" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      addFiles(e.dataTransfer.files);
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.15)",
                      }}
                    >
                      <Upload className="w-8 h-8" style={{ color: "#6366F1" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#374151" }}>
                      Drop videos here, or click to choose
                    </span>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      MP4, MOV, MKV, WebM, AVI, 3GP and more. Up to {MAX_FILE_MB} MB each,{" "}
                      {MAX_FILES} files at a time.
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="video/*,.mkv,.flv,.wmv,.3gp,.m4v"
                      className="sr-only"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {error && (
                    <p className="mt-3 text-xs" style={{ color: "#B91C1C" }} role="alert">
                      {error}
                    </p>
                  )}

                  {items.length > 0 && (
                    <ul className="mt-5 space-y-3" aria-label="Videos to convert">
                      {items.map((it) => (
                        <li key={it.id} className={`mp-file rounded-xl p-4 ${it.status}`}>
                          <div className="flex items-center gap-3">
                            <FileVideo
                              className="w-5 h-5 shrink-0"
                              style={{ color: "#6366F1" }}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-sm font-semibold truncate"
                                style={{ color: "#374151" }}
                              >
                                {it.file.name}
                              </p>
                              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                                {formatBytes(it.file.size)}
                                {it.status === "done" && ` → ${formatBytes(it.outSize)} MP3`}
                              </p>
                            </div>

                            {it.status === "done" && (
                              <button
                                type="button"
                                onClick={() => triggerDownload(it.url, it.outName)}
                                className="px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5"
                                style={actionBtnStyle(false)}
                              >
                                <Download className="w-4 h-4" />
                                Download MP3
                              </button>
                            )}
                            {it.status !== "converting" && (
                              <button
                                type="button"
                                onClick={() => removeItem(it.id)}
                                disabled={busy}
                                aria-label={`Remove ${it.file.name}`}
                                className="p-2 rounded-lg"
                                style={{
                                  color: "#9CA3AF",
                                  opacity: busy ? 0.4 : 1,
                                  cursor: busy ? "not-allowed" : "pointer",
                                }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {it.status === "converting" && (
                            <div className="mt-3">
                              <div
                                className="mp-bar"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(it.progress * 100)}
                              >
                                <div
                                  className={`mp-bar-fill ${it.progress === 0 ? "indeterminate" : ""}`}
                                  style={{ width: `${Math.round(it.progress * 100)}%` }}
                                />
                              </div>
                              <p className="mt-1.5 text-xs" style={{ color: "#6366F1" }}>
                                Extracting audio {Math.round(it.progress * 100)}%
                              </p>
                            </div>
                          )}

                          {it.status === "error" && (
                            <p className="mt-2 text-xs" style={{ color: "#B91C1C" }} role="alert">
                              {it.error}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ── RIGHT: settings and convert ── */}
                <div className="md:col-span-2 md:sticky md:top-6 self-start">
                  <p className="mb-3" style={sectionLabelStyle}>
                    2 · Choose MP3 quality
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5" role="radiogroup" aria-label="MP3 quality">
                    {QUALITY.map((q) => {
                      const active = bitrate === q.kbps;
                      return (
                        <button
                          key={q.kbps}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={busy}
                          onClick={() => setBitrate(q.kbps)}
                          className="px-3.5 py-2 rounded-full text-xs font-semibold border transition"
                          style={
                            active
                              ? { background: "#6366F1", color: "#fff", borderColor: "#6366F1" }
                              : { background: "#fff", color: "#4338CA", borderColor: "#C7D2FE" }
                          }
                        >
                          {q.label} · {q.note}
                        </button>
                      );
                    })}
                  </div>

                  <Field
                    label="Channels"
                    hint="Mono makes voice recordings about half the size."
                  >
                    <select
                      className={inputCls}
                      value={mono ? "mono" : "stereo"}
                      disabled={busy}
                      onChange={(e) => setMono(e.target.value === "mono")}
                    >
                      <option value="stereo">Stereo (original)</option>
                      <option value="mono">Mono</option>
                    </select>
                  </Field>

                  {loadState === "loading" && (
                    <p className="mt-4 text-xs" style={{ color: "#6366F1" }}>
                      Preparing the converter (one-time download, about 30 MB)...
                    </p>
                  )}
                  {loadState === "ready" && !busy && items.length > 0 && doneCount === 0 && (
                    <div className="ready-pill flex items-center gap-2 mt-4 px-4 py-2 rounded-full w-fit">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "#6366F1" }}
                      />
                      <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>
                        Converter ready
                      </span>
                    </div>
                  )}
                  {doneCount > 0 && !busy && (
                    <div className="ready-pill flex items-center gap-2 mt-4 px-4 py-2 rounded-full w-fit">
                      <Check className="w-4 h-4" style={{ color: "#6366F1" }} />
                      <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>
                        {doneCount} of {items.length} converted
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleConvert}
                    disabled={!items.length || busy}
                    className="download-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base mt-5"
                  >
                    <Music className="w-5 h-5" />
                    {convertLabel}
                  </button>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={!busy}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                      style={actionBtnStyle(!busy)}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={busy || !items.length}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                      style={actionBtnStyle(busy || !items.length)}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear all
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-center" style={{ color: "#9CA3AF" }}>
                    Videos stay on your device. Keep this tab open while converting.
                  </p>
                </div>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-5 mt-8">
                {["No upload", "No signup", "Unlimited use", "No tracking", "100% free"].map(
                  (t, i) => (
                    <span
                      key={i}
                      className="text-xs flex items-center gap-1.5"
                      style={{ color: "#9CA3AF" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: "#A5B4FC" }}
                      />
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-12"
              style={{ color: "#1a1a2e" }}
            >
              3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Add Your Video",
                  desc: "Drag and drop an MP4 or other video file, or click the box to choose it from your device.",
                },
                {
                  num: "2",
                  title: "Choose Quality",
                  desc: "Pick a bitrate for the MP3 and choose stereo or mono depending on your audio.",
                },
                {
                  num: "3",
                  title: "Convert and Download",
                  desc: "Press Convert and watch the progress. Download the MP3 when it is done.",
                },
              ].map((s, i) => (
                <div key={i} className="step-card rounded-2xl p-7 text-center">
                  <div className="step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: "#1a1a2e" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: "#6B7280" }}>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1a1a2e" }}>
                Free MP4 to MP3 Converter With No Upload
              </h2>
              <p className="leading-7 text-sm">
                <Rich parts={seoPrivate} />
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "#1a1a2e" }}>
                How to Extract Audio From a Video
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoHow} />
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "#1a1a2e" }}>
                Which MP3 Quality Should You Choose?
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoQuality} />
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "#1a1a2e" }}>
                What People Use a Video to MP3 Converter For
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoUse} />
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "#1a1a2e" }}>
                File Size Limits
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoLimit} />
              </p>
            </div>

            <div className="seo-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: "#1a1a2e" }}>
                Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Free to use, no signup",
                  "Videos are processed in your browser, never uploaded",
                  "MP4, MOV, MKV, WebM, AVI, and more",
                  "MP3 from 64 to 320 kbps",
                  "Stereo or mono output",
                  "Convert up to " + MAX_FILES + " videos in one go",
                  "Live progress bar and cancel button",
                  "No watermarks",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="feature-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="mid-divider" />
        <section className="main-section py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-10"
              style={{ color: "#1a1a2e" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="faq-item rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: "#374151" }}>
                      {faq.q}
                    </span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "#6366F1" }} />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    <Rich parts={faq.a} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="mid-divider" />
        <section className="alt-section py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: "#1a1a2e" }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Audio Converter", href: "/audio-converter" },
                { name: "Text to Speech", href: "/text-to-speech" },
                { name: "Image Converter", href: "/image-converter" },
                { name: "Image Compressor", href: "/image-compressor" },
                { name: "Text to PDF", href: "/text-to-pdf" },
                { name: "Word Counter", href: "/word-counter" },
              ].map((tool, i) => (
                <NextLink
                  key={i}
                  href={tool.href}
                  className="px-4 py-2 rounded-full text-sm font-medium border hover:border-rose-400 transition"
                  style={{ color: "#9f1239", borderColor: "#FDA4AF", background: "#fff" }}
                >
                  {tool.name}
                </NextLink>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to turn your video into MP3?
            </h2>
            <p className="mb-8 text-base" style={{ color: "rgba(255,255,255,0.7)" }}>
              Private, free, and no signup.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="cta-main-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
            >
              <Music className="w-5 h-5" /> Convert Video to MP3
            </button>
          </div>
        </section>
      </main>
    </>
  );
}