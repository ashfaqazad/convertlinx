"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import {
  Film,
  Upload,
  Download,
  Check,
  X,
  RotateCcw,
  ChevronDown,
  Minimize2,
  TriangleAlert,
} from "lucide-react";
import NextLink from "next/link";
import { loadFfmpegLibs } from "@/lib/loadFfmpeg";
import "@/styles/VideoCompressor.css";

/* ───────────────────────── constants ───────────────────────── */

const LINK_CLS = "text-indigo-600 hover:underline font-medium";
const MAX_FILE_MB = 200;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const MOBILE_WARN_MB = 50;
const MOBILE_WARN_BYTES = MOBILE_WARN_MB * 1024 * 1024;

/* Single-thread core (no COOP/COEP headers needed), served from /public/ffmpeg.
   It is only fetched on this page, after a video is added or Compress is pressed. */
const CORE_BASE = "/ffmpeg";

const ALLOWED_EXT = ["mp4", "mov", "webm", "mkv"];
const ALLOWED_MIME = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"];

const PRESETS = [
  { id: "high", label: "High quality", crf: 23, audio: "128k", note: "Near-identical picture, moderate savings" },
  { id: "balanced", label: "Balanced", crf: 28, audio: "128k", note: "Best choice for most videos" },
  { id: "small", label: "Smallest size", crf: 32, audio: "96k", note: "Biggest savings, slightly softer picture" },
];

const RESOLUTIONS = [
  { id: "original", label: "Original resolution", height: 0 },
  { id: "1080", label: "1080p (Full HD)", height: 1080 },
  { id: "720", label: "720p (HD)", height: 720 },
  { id: "480", label: "480p (Standard)", height: 480 },
];

const sectionLabelStyle = {
  color: "#6366F1",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
};

/* ───────────────────────── helpers ───────────────────────── */

const formatBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const getExt = (name) => (name.split(".").pop() || "").toLowerCase();
const baseName = (name) => name.replace(/\.[^.]+$/, "") || "video";

const OOM_RE = /memory|oom|out of bounds|allocation|alloc/i;

/* ── Rich text: strings + contextual internal links, one source for UI and schema ── */
const lk = (text, href) => ({ text, href });
const toPlain = (parts) => parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
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

/* ───────────────────────── content ───────────────────────── */

const seoIntro = [
  "This video compressor makes a video file smaller without uploading it anywhere. Your video is processed by your own browser using WebAssembly, so private clips, family videos, and work recordings never leave your device. It re-encodes the video as an MP4 with H.264 video and AAC audio, which plays on practically every phone, laptop, TV, and social app. There is no signup, no watermark, and no daily limit. The first time you use it, the compression engine (about 30 MB) is downloaded once and cached by your browser.",
];

const seoHowItWorks = [
  "Most of a video file is the picture, and most of that picture is detail your eyes barely notice. The compressor re-encodes the video with a quality setting called CRF. A higher CRF throws away more fine detail and makes a smaller file, and a lower CRF keeps more detail and makes a larger one. The three presets map to sensible CRF values, so you do not need to know the numbers. Lowering the resolution, for example from 1080p to 720p, shrinks the file further because there are fewer pixels to store. If you only need the sound from a recording, the ",
  lk("MP4 to MP3 converter", "/mp4-to-mp3"),
  " produces a far smaller file than any video can.",
];

const seoSettings = [
  "For most videos, Balanced at the original resolution is a good start and often cuts the file size by half or more. Pick High quality when the video will be edited again or shown on a big screen. Pick Smallest size when you need to fit a size limit, such as an email attachment or a chat app. Choosing 720p or 480p on top of a preset makes the biggest difference for screen recordings and phone videos shot in 4K. The compressor never upscales, so a 720p video stays 720p even if you choose 1080p.",
];

const seoPrivacy = [
  "Because everything runs in your browser, this tool needs memory on your device. It accepts MP4, MOV, WebM, and MKV videos up to " +
    MAX_FILE_MB +
    " MB. Compression is slower than a desktop app, and a long Full HD video can take several minutes, so keep the tab open until it finishes. On phones, videos over " +
    MOBILE_WARN_MB +
    " MB may run out of memory; try a computer or lower the resolution if that happens. When the job finishes, the engine is shut down and its memory is released.",
];

const faqs = [
  {
    q: "Is this video compressor free?",
    a: ["Yes. It is completely free, with no signup, no watermark, and no daily limit."],
  },
  {
    q: "Are my videos uploaded to a server?",
    a: [
      "No. Your video is compressed inside your browser and never leaves your device. Only the compression engine itself (about 30 MB) is downloaded from our site the first time you use the tool.",
    ],
  },
  {
    q: "What are the best settings for WhatsApp or email?",
    a: [
      "WhatsApp limits video messages to roughly 16 MB, and most email services cap attachments at about 20 to 25 MB. Choose Smallest size and 480p or 720p, then check the result size shown after compression. If it is still too big, try 480p, or trim the video to a shorter length first.",
    ],
  },
  {
    q: "Why is my compressed file still large?",
    a: [
      "A long video, 4K resolution, or a video that was already compressed will stay large. Choose Smallest size and a lower resolution such as 720p or 480p. If the result is not smaller than the original, the video was probably already well compressed, and there is little left to remove at that resolution.",
    ],
  },
  {
    q: "Which video formats are supported?",
    a: [
      "You can add MP4, MOV, WebM, and MKV videos. The result is always an MP4 file with H.264 video and AAC audio, which works on almost every device and platform.",
    ],
  },
  {
    q: "What is the maximum video size?",
    a: [
      "Each video can be up to " +
        MAX_FILE_MB +
        " MB, because compression runs in your browser's memory. On mobile devices, videos over " +
        MOBILE_WARN_MB +
        " MB may fail on older phones. The tool shows a friendly message if a file is too large.",
    ],
  },
  {
    q: "Will compressing reduce the video quality?",
    a: [
      "Yes, a little, because the video is re-encoded. At High quality most people cannot see the difference. Balanced is usually fine for phones and social media, and Smallest size shows softer detail on a big screen.",
    ],
  },
  {
    q: "Why does it take a while?",
    a: [
      "Everything happens on your own device, and this tool uses a single processing thread so it works in every browser without special settings. Short clips finish in under a minute, while long Full HD videos can take several minutes. The progress bar shows how far along it is, and you can cancel at any time.",
    ],
  },
  {
    q: "Can I get just the audio from a video?",
    a: [
      "Yes. Use our ",
      lk("MP4 to MP3 converter", "/mp4-to-mp3"),
      " to extract the sound, or the ",
      lk("Audio Converter", "/audio-converter"),
      " if you want WAV, OGG, M4A, or AAC instead.",
    ],
  },
];

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

export default function VideoCompressor() {
  const [file, setFile] = useState(null);
  const [presetId, setPresetId] = useState("balanced");
  const [resId, setResId] = useState("original");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | loading | compressing
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [loadState, setLoadState] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [result, setResult] = useState(null); // { url, name, size }
  const [drag, setDrag] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const ffmpegRef = useRef(null);
  const loadPromiseRef = useRef(null);
  const coreUrlsRef = useRef(null);
  const cancelRef = useRef(false);
  const logsRef = useRef([]);
  const resultUrlRef = useRef("");

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
  }, []);

  /* elapsed-time counter while working */
  useEffect(() => {
    if (!busy) return undefined;
    setElapsed(0);
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [busy]);

  /* free object URLs and stop ffmpeg when leaving the page */
  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (coreUrlsRef.current) {
        URL.revokeObjectURL(coreUrlsRef.current.coreURL);
        URL.revokeObjectURL(coreUrlsRef.current.wasmURL);
      }
      try {
        ffmpegRef.current && ffmpegRef.current.terminate();
      } catch (e) {}
    };
  }, []);

  const clearResult = () => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = "";
    setResult(null);
  };

  /* Stop the engine so its WebAssembly memory is released back to the browser. */
  const shutdownEngine = () => {
    try {
      ffmpegRef.current && ffmpegRef.current.terminate();
    } catch (e) {}
    ffmpegRef.current = null;
    loadPromiseRef.current = null;
    setLoadState("idle");
  };

  /* Lazy-load ffmpeg.wasm (single thread). Safe to call many times. */
  const ensureLoaded = () => {
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = (async () => {
      setLoadState("loading");
      const { FFmpeg, toBlobURL } = await loadFfmpegLibs();
      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.max(0, Math.min(1, Number.isFinite(p) ? p : 0)));
      });
      ffmpeg.on("log", ({ message }) => {
        logsRef.current.push(message);
        if (logsRef.current.length > 40) logsRef.current.shift();
      });
      if (!coreUrlsRef.current) {
        coreUrlsRef.current = {
          coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
        };
      }
      await ffmpeg.load(coreUrlsRef.current);
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

  const addFile = (fileList) => {
    const f = Array.from(fileList || [])[0];
    if (!f || busy) return;

    setError("");
    setWarning("");

    if (!ALLOWED_EXT.includes(getExt(f.name)) && !ALLOWED_MIME.includes(f.type)) {
      setError("This file type is not supported. Please choose an MP4, MOV, WebM, or MKV video.");
      return;
    }
    if (f.size === 0) {
      setError("This file is empty. Please choose a different video.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(
        `This video is ${formatBytes(f.size)}, which is over the ${MAX_FILE_MB} MB limit. Compression runs in your browser's memory, so very large files cannot be handled. Try a shorter clip or a smaller video.`,
      );
      return;
    }
    if (isMobile && f.size > MOBILE_WARN_BYTES) {
      setWarning(
        `This video is ${formatBytes(f.size)}. Videos over ${MOBILE_WARN_MB} MB can run out of memory on phones. If it fails, try a computer or choose a lower resolution.`,
      );
    }

    clearResult();
    setProgress(0);
    setFile(f);
    ensureLoaded().catch(() => {}); // start downloading the engine early
  };

  const handleReset = () => {
    if (busy) return;
    clearResult();
    setFile(null);
    setError("");
    setWarning("");
    setProgress(0);
  };

  const handleCancel = () => {
    cancelRef.current = true;
    shutdownEngine();
  };

  const handleCompress = async () => {
    if (busy || !file) return;
    setBusy(true);
    setError("");
    clearResult();
    setProgress(0);
    cancelRef.current = false;
    logsRef.current = [];
    setPhase(ffmpegRef.current ? "compressing" : "loading");

    const preset = PRESETS.find((p) => p.id === presetId);
    const res = RESOLUTIONS.find((r) => r.id === resId);
    const ext = getExt(file.name).replace(/[^a-z0-9]/g, "") || "mp4";
    const inName = `input.${ext}`;
    const outName = "output.mp4";

    let ffmpeg = null;
    try {
      try {
        ffmpeg = await ensureLoaded();
      } catch (e) {
        if (cancelRef.current) throw e;
        const err = new Error("engine");
        err.kind = "engine";
        throw err;
      }
      setPhase("compressing");

      let bytes;
      try {
        bytes = new Uint8Array(await file.arrayBuffer());
      } catch (e) {
        const err = new Error("memory");
        err.kind = "memory";
        throw err;
      }
      await ffmpeg.writeFile(inName, bytes);

      /* never upscale; keep width and height even for H.264 */
      const vf = res.height
        ? `scale=-2:min(${res.height}\\,ih)`
        : "scale=trunc(iw/2)*2:trunc(ih/2)*2";

      const code = await ffmpeg.exec([
        "-i", inName,
        "-map", "0:v:0",
        "-map", "0:a:0?",
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", String(preset.crf),
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", preset.audio,
        "-movflags", "+faststart",
        "-y", outName,
      ]);
      if (code !== 0) throw new Error("ffmpeg failed");

      const data = await ffmpeg.readFile(outName);
      const blob = new Blob([data], { type: "video/mp4" });
      if (!blob.size) throw new Error("empty output");

      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setProgress(1);
      setResult({ url, name: `${baseName(file.name)}-compressed.mp4`, size: blob.size });
    } catch (e) {
      if (!cancelRef.current) {
        const tail = logsRef.current.join(" ");
        const msg = String((e && e.message) || "");
        if (e && e.kind === "engine") {
          setError(
            "Could not load the compression engine. Check your internet connection and try again.",
          );
        } else if ((e && e.kind === "memory") || OOM_RE.test(msg) || OOM_RE.test(tail)) {
          setError(
            "Your browser ran out of memory while compressing this video. Try a smaller video, choose a lower resolution, close other tabs, or use a computer instead of a phone.",
          );
        } else if (/Invalid data|moov atom|could not find codec|Invalid argument|Unsupported/i.test(tail)) {
          setError(
            "This video could not be read. The file may be damaged or use a format this tool does not support. Try another MP4, MOV, WebM, or MKV file.",
          );
        } else {
          setError(
            "Compression failed. The file may be damaged or unsupported. Try another video or a different browser.",
          );
        }
      }
    } finally {
      /* free the video from ffmpeg's memory and shut the engine down after every run */
      if (ffmpeg && !cancelRef.current) {
        try {
          await ffmpeg.deleteFile(inName);
        } catch (e) {}
        try {
          await ffmpeg.deleteFile(outName);
        } catch (e) {}
      }
      shutdownEngine();
      setPhase("idle");
      setBusy(false);
    }
  };

  const saved = result && file ? Math.round((1 - result.size / file.size) * 100) : 0;
  const notSmaller = result && file && result.size >= file.size;

  const actionBtnStyle = (disabled) => ({
    color: "#4338CA",
    borderColor: "#C7D2FE",
    background: "#fff",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const showLoadingEngine = busy && phase === "loading";
  const pct = Math.round(progress * 100);

  return (
    <>
      {/* Breadcrumb, WebApplication and HowTo schemas come from seoData on the server page.
          Only the FAQ is added here. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

      <main className="vc-page">
        {/* ── HERO ── */}
        <section className="vc-hero py-16 px-6 text-center">
          <div className="vc-blob-1" />
          <div className="vc-blob-2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm mb-6">
              <a href="/" className="vc-breadcrumb-link">
                Home
              </a>
              <span aria-hidden="true" style={{ color: "#C4B5FD" }}>/</span>
              <span aria-current="page" style={{ color: "#6366F1" }}>Video Compressor</span>
            </nav>
            <span className="vc-badge inline-block px-4 py-1.5 rounded-full mb-5">Free Tool</span>
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
              style={{ color: "#1a1a2e" }}
            >
              Video <span className="vc-grad-text">Compressor</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Compress video online and reduce video size without losing the plot. Everything
              runs in your browser, so your video is never uploaded. No signup, no watermark.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {[
                "No upload",
                "MP4 · MOV · WebM · MKV",
                "MP4 output (H.264 + AAC)",
                "3 quality presets",
                "Up to " + MAX_FILE_MB + " MB",
                "100% private",
              ].map((t, i) => (
                <span key={i} className="vc-badge px-3 py-1 rounded-full text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOL WORKSPACE ── */}
        <section className="vc-main py-10 px-6">
          <div className="max-w-5xl mx-auto vc-fade-up">
            <div className="vc-card rounded-3xl p-6 md:p-10">
              <div className="grid md:grid-cols-5 gap-8">
                {/* ── LEFT: file and result ── */}
                <div className="md:col-span-3">
                  <p className="mb-3" style={sectionLabelStyle}>
                    1 · Add your video
                  </p>

                  <label
                    className={`vc-drop rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center ${drag ? "drag" : ""} ${busy ? "disabled" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!busy) setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      addFile(e.dataTransfer.files);
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.15)",
                      }}
                    >
                      <Upload className="w-8 h-8" style={{ color: "#6366F1" }} aria-hidden="true" />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#374151" }}>
                      {file ? "Choose a different video" : "Drop a video here, or click to choose"}
                    </span>
                    <span className="text-xs" style={{ color: "#6B7280" }}>
                      MP4, MOV, WebM or MKV. Up to {MAX_FILE_MB} MB.
                    </span>
                    <input
                      type="file"
                      accept=".mp4,.mov,.webm,.mkv,video/mp4,video/quicktime,video/webm,video/x-matroska"
                      className="sr-only"
                      disabled={busy}
                      aria-label="Choose a video to compress"
                      onChange={(e) => {
                        addFile(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {error && (
                    <p className="vc-alert vc-alert-error mt-4" role="alert">
                      <TriangleAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{error}</span>
                    </p>
                  )}
                  {warning && !error && (
                    <p className="vc-alert vc-alert-warn mt-4" role="status">
                      <TriangleAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{warning}</span>
                    </p>
                  )}

                  {file && (
                    <div className={`vc-file rounded-xl p-4 mt-5 ${result ? "done" : ""}`}>
                      <div className="flex items-center gap-3">
                        <Film className="w-5 h-5 shrink-0" style={{ color: "#6366F1" }} aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate" style={{ color: "#374151" }}>
                            {file.name}
                          </p>
                          <p className="text-xs" style={{ color: "#6B7280" }}>
                            {formatBytes(file.size)}
                            {result && ` → ${formatBytes(result.size)}`}
                          </p>
                        </div>
                        {!busy && (
                          <button
                            type="button"
                            onClick={handleReset}
                            aria-label={`Remove ${file.name}`}
                            className="vc-icon-btn p-2 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {busy && (
                        <div className="mt-3" aria-live="polite">
                          <div
                            className="vc-bar"
                            role="progressbar"
                            aria-label={showLoadingEngine ? "Loading engine" : "Compression progress"}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={showLoadingEngine ? undefined : pct}
                          >
                            <div
                              className={`vc-bar-fill ${showLoadingEngine || pct === 0 ? "indeterminate" : ""}`}
                              style={{ width: `${showLoadingEngine ? 40 : pct}%` }}
                            />
                          </div>
                          <p className="mt-1.5 text-xs" style={{ color: "#6366F1" }}>
                            {showLoadingEngine
                              ? "Loading engine... (one-time download, about 30 MB)"
                              : `Compressing ${pct}% · ${formatTime(elapsed)} elapsed`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {result && !busy && (
                    <div className="mt-5" aria-live="polite">
                      <p className="mb-3" style={sectionLabelStyle}>
                        Result
                      </p>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="vc-stat rounded-xl p-3 text-center">
                          <span className="vc-stat-label">Original</span>
                          <span className="vc-stat-value">{formatBytes(file.size)}</span>
                        </div>
                        <div className="vc-stat rounded-xl p-3 text-center">
                          <span className="vc-stat-label">Compressed</span>
                          <span className="vc-stat-value">{formatBytes(result.size)}</span>
                        </div>
                        <div className="vc-stat rounded-xl p-3 text-center">
                          <span className="vc-stat-label">{notSmaller ? "Change" : "Saved"}</span>
                          <span className="vc-stat-value vc-saved">
                            {notSmaller ? `+${Math.abs(saved)}%` : `${saved}%`}
                          </span>
                        </div>
                      </div>

                      {notSmaller && (
                        <p className="vc-alert vc-alert-warn mb-4" role="status">
                          <TriangleAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>
                            The result is not smaller than the original. The video may already be well
                            compressed, or full of fine detail. Try the Smallest size preset or a lower
                            resolution.
                          </span>
                        </p>
                      )}

                      <video
                        className="vc-video rounded-xl"
                        src={result.url}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label="Preview of the compressed video"
                      />

                      <a
                        href={result.url}
                        download={result.name}
                        className="vc-download w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base mt-4"
                      >
                        <Download className="w-5 h-5" aria-hidden="true" />
                        Download compressed MP4
                      </a>
                    </div>
                  )}
                </div>

                {/* ── RIGHT: settings and compress ── */}
                <div className="md:col-span-2 md:sticky md:top-6 self-start">
                  <p className="mb-3" style={sectionLabelStyle}>
                    2 · Choose compression
                  </p>
                  <div className="flex flex-col gap-2 mb-5" role="radiogroup" aria-label="Compression preset">
                    {PRESETS.map((p) => {
                      const active = presetId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={busy}
                          onClick={() => setPresetId(p.id)}
                          className={`vc-preset rounded-xl px-4 py-3 text-left ${active ? "active" : ""}`}
                        >
                          <span className="vc-preset-title">{p.label}</span>
                          <span className="vc-preset-note">{p.note}</span>
                        </button>
                      );
                    })}
                  </div>

                  <label className="block">
                    <span className="block mb-1.5 text-xs font-semibold" style={{ color: "#4B5563" }}>
                      Resolution (optional)
                    </span>
                    <select
                      className="vc-input w-full px-4 py-3 rounded-xl text-sm"
                      value={resId}
                      disabled={busy}
                      onChange={(e) => setResId(e.target.value)}
                    >
                      {RESOLUTIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <span className="block mt-1 text-xs" style={{ color: "#6B7280" }}>
                      Lower resolution makes a much smaller file. Videos are never upscaled.
                    </span>
                  </label>

                  {loadState === "loading" && !busy && (
                    <p className="mt-4 text-xs" style={{ color: "#6366F1" }} role="status">
                      Loading engine... (one-time download, about 30 MB)
                    </p>
                  )}
                  {loadState === "ready" && !busy && file && !result && (
                    <div className="vc-ready flex items-center gap-2 mt-4 px-4 py-2 rounded-full w-fit">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "#6366F1" }}
                      />
                      <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>
                        Engine ready
                      </span>
                    </div>
                  )}
                  {result && !busy && (
                    <div className="vc-ready flex items-center gap-2 mt-4 px-4 py-2 rounded-full w-fit">
                      <Check className="w-4 h-4" style={{ color: "#6366F1" }} aria-hidden="true" />
                      <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>
                        Compressed
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleCompress}
                    disabled={!file || busy}
                    className="vc-btn w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 text-base mt-5"
                  >
                    <Minimize2 className="w-5 h-5" aria-hidden="true" />
                    {busy ? "Compressing..." : result ? "Compress again" : "Compress video"}
                  </button>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={!busy}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                      style={actionBtnStyle(!busy)}
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={busy || !file}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                      style={actionBtnStyle(busy || !file)}
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                      Clear
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-center" style={{ color: "#6B7280" }}>
                    Your video stays on your device. Keep this tab open while compressing. Long
                    videos can take a few minutes.
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
                      style={{ color: "#6B7280" }}
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

        {/* ── HOW TO COMPRESS ── */}
        <hr className="vc-divider" />
        <section className="vc-main py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "#1a1a2e" }}>
              How to Compress a Video in 3 Steps
            </h2>
            <ol className="grid md:grid-cols-3 gap-6 list-none p-0">
              {[
                {
                  num: "1",
                  title: "Add Your Video",
                  desc: "Drag and drop an MP4, MOV, WebM, or MKV file, or click the box to choose it from your device.",
                },
                {
                  num: "2",
                  title: "Pick a Preset",
                  desc: "Choose High quality, Balanced, or Smallest size. Optionally lower the resolution to 1080p, 720p, or 480p.",
                },
                {
                  num: "3",
                  title: "Compress and Download",
                  desc: "Press Compress and watch the progress bar. Compare the sizes, preview the result, and download the MP4.",
                },
              ].map((s, i) => (
                <li key={i} className="vc-step rounded-2xl p-7 text-center">
                  <div className="vc-step-num w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg text-white">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: "#1a1a2e" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {s.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SEO CONTENT ── */}
        <hr className="vc-divider" />
        <section className="vc-alt py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8" style={{ color: "#4B5563" }}>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1a1a2e" }}>
                Free Video Compressor With No Upload
              </h2>
              <p className="leading-7 text-sm">
                <Rich parts={seoIntro} />
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "#1a1a2e" }}>
                How Video Compression Works
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoHowItWorks} />
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "#1a1a2e" }}>
                Which Settings Should You Choose?
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoSettings} />
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "#1a1a2e" }}>
                Privacy, Speed, and File Size Limits
              </h3>
              <p className="leading-7 text-sm">
                <Rich parts={seoPrivacy} />
              </p>
            </div>

            <div className="vc-box rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: "#1a1a2e" }}>
                Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Free to use, no signup",
                  "Videos are compressed in your browser, never uploaded",
                  "MP4, MOV, WebM, and MKV input",
                  "MP4 output with H.264 video and AAC audio",
                  "High quality, Balanced, and Smallest size presets",
                  "Optional 1080p, 720p, or 480p resolution",
                  "Live progress bar and cancel button",
                  "Before and after size, with a preview and download",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="vc-dot w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <hr className="vc-divider" />
        <section className="vc-main py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: "#1a1a2e" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="vc-faq rounded-xl p-5">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-sm" style={{ color: "#374151" }}>
                      {faq.q}
                    </span>
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "#6366F1" }} aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "#4B5563" }}>
                    <Rich parts={faq.a} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ── */}
        <hr className="vc-divider" />
        <section className="vc-alt py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-center" style={{ color: "#1a1a2e" }}>
              You may also find these free tools helpful
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "MP4 to MP3", href: "/mp4-to-mp3" },
                { name: "Audio Converter", href: "/audio-converter" },
                { name: "Image Compressor", href: "/image-compressor" },
                { name: "Image Converter", href: "/image-converter" },
                { name: "Image Resizer", href: "/image-resizer" },
                { name: "Text to Speech", href: "/text-to-speech" },
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
        <section className="vc-cta py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Ready to shrink your video?
            </h2>
            <p className="mb-8 text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
              Private, free, and no signup.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="vc-cta-btn text-white text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
            >
              <Minimize2 className="w-5 h-5" aria-hidden="true" /> Compress a Video
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
