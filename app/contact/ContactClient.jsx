"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

const TOPICS = [
  { value: "General", label: "General", icon: MessageCircle },
  { value: "Bug report", label: "Bug report", icon: Bug },
  { value: "Feature request", label: "Feature request", icon: Lightbulb },
  { value: "Feedback", label: "Feedback", icon: Mail },
];

const MAX_MESSAGE = 5000;

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

export default function Contact() {
  const [topic, setTopic] = useState("General");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, topic, website }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        /* non-JSON response */
      }

      if (res.ok && data?.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTopic("General");
      } else {
        setErrorMsg(
          data?.error ||
            "Something went wrong. Please try again or email us directly."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <main className="bg-white text-slate-600">
      {/* ───────── Header ───────── */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgba(100,116,139,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.10)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 -z-10 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-300/30 blur-[110px]"
        />

        <div className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Support &amp; feedback
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            Get in touch with{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
              ConvertLinx
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Found a bug, want a new tool or have a question? Send us a message.
            Every message is read by the person who builds the tools.
          </p>
        </div>
      </section>

      {/* ───────── Form + side cards ───────── */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            {status === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Message sent
                </h2>
                <p className="mt-2 max-w-sm text-slate-600">
                  Thanks for reaching out. We&apos;ll read it and get back to you
                  at the email you provided.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Send us a message
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    All fields are required.
                  </p>
                </div>

                {/* Topic */}
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-slate-700">
                    What is this about?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map(({ value, label, icon: Icon }) => {
                      const active = topic === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setTopic(value)}
                          aria-pressed={active}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                            active
                              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Jane Doe"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={MAX_MESSAGE}
                    placeholder="Tell us what happened, or what you'd like to see. Include the tool name and browser if it's a bug."
                    className={`${inputCls} resize-none`}
                  />
                  <p className="mt-1.5 text-right text-xs text-slate-400">
                    {message.length}/{MAX_MESSAGE}
                  </p>
                </div>

                {/* Honeypot: hidden from people, visible to bots */}
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {status === "error" && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send message
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-relaxed text-slate-500">
                  By sending this form you agree that ConvertLinx may use your
                  name and email to reply to you. See our{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>

          {/* Side cards */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm sm:p-8">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Prefer email?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Write to us directly and we&apos;ll reply as soon as we can.
              </p>
              <a
                href="mailto:support@convertlinx.com"
                className="mt-4 inline-block break-all text-base font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                support@convertlinx.com
              </a>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Helpful details to include
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  "Which tool you were using",
                  "What you expected and what happened instead",
                  "Your device and browser (for bugs)",
                  "A screenshot or the file type, if relevant",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Please don&apos;t send sensitive data
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Never include passwords, ID numbers or private documents in
                your message. We will never ask for them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
