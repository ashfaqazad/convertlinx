"use client";

/**
 * "Create audio file" panel for the Text to Speech tool.
 *
 * Text is turned into speech fully inside the browser with a Piper (VITS) neural voice
 * (@diffusionstudio/vits-web + onnxruntime-web). The result is a WAV that is then converted
 * to MP3 / WAV / OGG / M4A / AAC / FLAC / MP4 with ffmpeg.wasm, so the user can download it.
 * The text never leaves the device; only the voice model (~15-110 MB, cached after first use)
 * is downloaded.
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { Download, FileAudio, Loader2, ChevronDown } from "lucide-react";
import { loadFfmpegLibs } from "@/lib/loadFfmpeg";

const CORE_BASE = "/ffmpeg";
const CHUNK_CHARS = 280;
const GAP_SECONDS = 0.25;

const FORMATS = {
  mp3: { label: "MP3", ext: "mp3", mime: "audio/mpeg", args: ["-c:a", "libmp3lame", "-b:a", "192k"] },
  wav: { label: "WAV", ext: "wav", mime: "audio/wav", args: ["-c:a", "pcm_s16le"] },
  ogg: { label: "OGG", ext: "ogg", mime: "audio/ogg", args: ["-ar", "44100", "-c:a", "libvorbis", "-b:a", "128k"] },
  m4a: { label: "M4A", ext: "m4a", mime: "audio/mp4", args: ["-c:a", "aac", "-b:a", "160k"] },
  aac: { label: "AAC", ext: "aac", mime: "audio/aac", args: ["-c:a", "aac", "-b:a", "160k"] },
  flac: { label: "FLAC", ext: "flac", mime: "audio/flac", args: ["-c:a", "flac"] },
  mp4: { label: "MP4 (video)", ext: "mp4", mime: "video/mp4", video: true },
};

/* ── text → short chunks so long text does not freeze the page ── */
function splitText(text) {
  const sentences = text
    .replace(/\r/g, "")
    .split(/(?<=[.!?۔؟。！？])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pieces = [];
  for (const s of sentences) {
    if (s.length <= CHUNK_CHARS) {
      pieces.push(s);
      continue;
    }
    let rest = s;
    while (rest.length > CHUNK_CHARS) {
      let cut = Math.max(rest.lastIndexOf(", ", CHUNK_CHARS), rest.lastIndexOf(" ", CHUNK_CHARS));
      if (cut < CHUNK_CHARS / 3) cut = CHUNK_CHARS;
      pieces.push(rest.slice(0, cut + 1).trim());
      rest = rest.slice(cut + 1).trim();
    }
    if (rest) pieces.push(rest);
  }

  const chunks = [];
  let cur = "";
  for (const p of pieces) {
    if (cur && cur.length + p.length + 1 > CHUNK_CHARS) {
      chunks.push(cur);
      cur = p;
    } else {
      cur = cur ? `${cur} ${p}` : p;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

/* ── tiny WAV helpers (mono 16-bit PCM, the format Piper returns) ── */
async function readWav(blob) {
  const buf = await blob.arrayBuffer();
  const view = new DataView(buf);
  const sampleRate = view.getUint32(24, true);
  const samples = new Int16Array(buf.slice(44));
  return { sampleRate, samples };
}

function writeWav(samples, sampleRate) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + samples.length * 2, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, "data");
  v.setUint32(40, samples.length * 2, true);
  new Int16Array(buf, 44).set(samples);
  return new Uint8Array(buf);
}

const nextTick = () => new Promise((r) => setTimeout(r, 0));
const mb = (n) => (n / (1024 * 1024)).toFixed(1);

function formatBytes(n) {
  return n > 1024 * 1024 ? `${mb(n)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

export default function TtsFileExport({ text, speed = 1, volume = 1 }) {
  const [voiceList, setVoiceList] = useState([]);
  const [voiceState, setVoiceState] = useState("loading"); // loading | ready | error
  const [voiceKey, setVoiceKey] = useState("en_US-lessac-medium");
  const [format, setFormat] = useState("mp3");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { url, name, size, label }

  const wavCacheRef = useRef(null); // { key, bytes, sampleRate }
  const ffmpegRef = useRef(null);
  const ffmpegPromiseRef = useRef(null);
  const resultUrlRef = useRef(null);

  /* load the list of available voices once */
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const { voices } = await import("@diffusionstudio/vits-web");
        const list = await voices();
        if (dead) return;
        setVoiceList(list);
        setVoiceState("ready");
      } catch (e) {
        if (!dead) setVoiceState("error");
      }
    })();
    return () => {
      dead = true;
    };
  }, []);

  useEffect(
    () => () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      try {
        ffmpegRef.current && ffmpegRef.current.terminate();
      } catch (e) {}
    },
    []
  );

  const groups = useMemo(() => {
    const g = {};
    voiceList.forEach((v) => {
      const name = `${v.language.name_english} (${v.language.country_english})`;
      (g[name] = g[name] || []).push(v);
    });
    return Object.entries(g).sort(([a], [b]) => a.localeCompare(b));
  }, [voiceList]);

  const currentVoice = voiceList.find((v) => v.key === voiceKey);
  const modelMb = currentVoice
    ? Object.entries(currentVoice.files).find(([k]) => k.endsWith(".onnx"))?.[1]?.size_bytes
    : 0;

  const ensureFfmpeg = () => {
    if (ffmpegPromiseRef.current) return ffmpegPromiseRef.current;
    ffmpegPromiseRef.current = (async () => {
      const { FFmpeg, toBlobURL } = await loadFfmpegLibs();
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
      return ffmpeg;
    })().catch((e) => {
      ffmpegPromiseRef.current = null;
      throw e;
    });
    return ffmpegPromiseRef.current;
  };

  const setOutput = (bytes, fmt) => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    const f = FORMATS[fmt];
    const url = URL.createObjectURL(new Blob([bytes], { type: f.mime }));
    resultUrlRef.current = url;
    setResult({ url, name: `text-to-speech.${f.ext}`, size: bytes.length, label: f.label, fmt });
  };

  /* WAV (speech) → chosen format */
  const encode = async (wav, fmt) => {
    const f = FORMATS[fmt];
    const needsFilter = Math.abs(speed - 1) > 0.01 || Math.abs(volume - 1) > 0.01;
    if (fmt === "wav" && !needsFilter) return wav.bytes.slice();

    setStatus(`Converting to ${f.label}…`);
    setProgress(0);
    const ffmpeg = await ensureFfmpeg();
    const onProgress = ({ progress: p }) =>
      setProgress(Math.max(0, Math.min(1, Number.isFinite(p) ? p : 0)));
    ffmpeg.on("progress", onProgress);

    const filters = [];
    if (Math.abs(speed - 1) > 0.01) filters.push(`atempo=${speed.toFixed(2)}`);
    if (Math.abs(volume - 1) > 0.01) filters.push(`volume=${volume.toFixed(2)}`);
    const af = filters.length ? ["-af", filters.join(",")] : [];

    const out = `out.${f.ext}`;
    try {
      /* writeFile transfers the buffer to the worker, so give it a copy and keep the cache intact */
      await ffmpeg.writeFile("in.wav", wav.bytes.slice());
      const args = f.video
        ? [
            "-f", "lavfi", "-i", "color=c=0x1e1b4b:s=1280x720:r=5",
            "-i", "in.wav",
            ...af,
            "-shortest",
            "-c:v", "libx264", "-preset", "ultrafast", "-tune", "stillimage", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "160k",
            "-movflags", "+faststart",
            out,
          ]
        : ["-i", "in.wav", ...af, ...f.args, out];
      const code = await ffmpeg.exec(args);
      if (code !== 0) throw new Error("ffmpeg failed");
      const data = await ffmpeg.readFile(out);
      return data;
    } finally {
      ffmpeg.off("progress", onProgress);
      try { await ffmpeg.deleteFile("in.wav"); } catch (e) {}
      try { await ffmpeg.deleteFile(out); } catch (e) {}
    }
  };

  /* text → WAV with the neural voice */
  const synthesize = async () => {
    const cacheKey = `${voiceKey}|${text}`;
    if (wavCacheRef.current && wavCacheRef.current.key === cacheKey) return wavCacheRef.current;

    const { predict } = await import("@diffusionstudio/vits-web");
    const chunks = splitText(text);
    const parts = [];
    let sampleRate = 22050;

    for (let i = 0; i < chunks.length; i++) {
      setStatus(
        chunks.length > 1 ? `Creating voice… part ${i + 1} of ${chunks.length}` : "Creating voice…"
      );
      setProgress(i / chunks.length);
      await nextTick();

      const blob = await predict({ text: chunks[i], voiceId: voiceKey }, (p) => {
        if (i === 0 && p.total && p.url.endsWith(".onnx")) {
          setStatus(`Downloading voice model (one time)… ${mb(p.loaded)} / ${mb(p.total)} MB`);
          setProgress(p.loaded / p.total);
        }
      });
      const w = await readWav(blob);
      sampleRate = w.sampleRate;
      parts.push(w.samples);
    }

    const gap = new Int16Array(Math.round(sampleRate * GAP_SECONDS));
    const total = parts.reduce((n, p) => n + p.length, 0) + gap.length * (parts.length - 1);
    const all = new Int16Array(total);
    let o = 0;
    parts.forEach((p, i) => {
      all.set(p, o);
      o += p.length;
      if (i < parts.length - 1) o += gap.length;
    });

    const entry = { key: cacheKey, bytes: writeWav(all, sampleRate), sampleRate };
    wavCacheRef.current = entry;
    return entry;
  };

  const run = async (fmt = format) => {
    if (busy || !text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const wav = await synthesize();
      const bytes = await encode(wav, fmt);
      setOutput(bytes, fmt);
      setStatus("");
    } catch (e) {
      console.error(e);
      setError(
        "Could not create the audio file. Check your internet connection (the voice model downloads once), then try again or pick a smaller voice."
      );
      setStatus("");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const chooseFormat = (fmt) => {
    setFormat(fmt);
    /* if speech is already generated, convert straight away */
    if (wavCacheRef.current?.key === `${voiceKey}|${text}` && result && !busy) run(fmt);
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="tts-export">
      <div className="tts-export-head">
        <FileAudio className="w-5 h-5" />
        <div>
          <h2 className="tts-export-title">Create &amp; download audio file</h2>
          <p className="tts-export-sub">
            Turn your text into a voice file — MP3, WAV, OGG, M4A, AAC, FLAC or MP4. Made in your
            browser, your text is never uploaded.
          </p>
        </div>
      </div>

      {/* voice */}
      <div className="tts-control-group">
        <label className="tts-control-label">Voice (language)</label>
        {voiceState === "loading" && <div className="tts-voice-loading">Loading voices…</div>}
        {voiceState === "error" && (
          <div className="tts-export-error">
            Could not load the voice list. Check your internet connection and reload the page.
          </div>
        )}
        {voiceState === "ready" && (
          <div className="tts-select-wrap">
            <select
              className="tts-select"
              value={voiceKey}
              onChange={(e) => setVoiceKey(e.target.value)}
              disabled={busy}
            >
              {groups.map(([lang, list]) => (
                <optgroup key={lang} label={lang}>
                  {list.map((v) => (
                    <option key={v.key} value={v.key}>
                      {v.name} · {v.quality.replace("_", " ")}
                      {v.num_speakers > 1 ? "" : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="tts-select-arrow w-4 h-4" />
          </div>
        )}
        <p className="tts-export-hint">
          {modelMb
            ? `This voice downloads once (${formatBytes(modelMb)}) and is then saved in your browser. `
            : ""}
          Urdu and Hindi voices are not available for file export yet; use Speak above for those.
          Speed and volume sliders apply to the file.
        </p>
      </div>

      {/* format */}
      <div className="tts-control-group">
        <label className="tts-control-label">File format</label>
        <div className="tts-format-row">
          {Object.entries(FORMATS).map(([k, f]) => (
            <button
              key={k}
              type="button"
              className={`tts-format-chip ${format === k ? "active" : ""}`}
              onClick={() => chooseFormat(k)}
              disabled={busy}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tts-toolbar">
        <button
          className="tts-btn tts-btn-primary"
          onClick={() => run()}
          disabled={!hasText || busy || voiceState !== "ready"}
        >
          {busy ? <Loader2 className="w-4 h-4 tts-spin" /> : <FileAudio className="w-4 h-4" />}
          {busy ? "Working…" : `Create ${FORMATS[format].label} file`}
        </button>
      </div>

      {busy && (
        <div className="tts-export-status">
          <div className="tts-export-status-text">{status || "Working…"}</div>
          <div className="tts-export-bar">
            <div className="tts-export-bar-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="tts-export-hint">Keep this tab open. Long text can take a minute.</div>
        </div>
      )}

      {error && <div className="tts-export-error">{error}</div>}

      {result && !busy && (
        <div className="tts-export-result">
          <audio controls src={result.url} className="tts-export-audio" />
          <a className="tts-btn tts-btn-primary" href={result.url} download={result.name}>
            <Download className="w-4 h-4" />
            Download {result.label} ({formatBytes(result.size)})
          </a>
          <p className="tts-export-hint">
            Want another format? Pick it above and it converts instantly, no need to wait again.
          </p>
        </div>
      )}
    </div>
  );
}
