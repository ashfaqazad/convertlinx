// Contact form endpoint.
//
// Sends the message to your inbox through Resend's REST API (no extra npm
// package needed). Configure these environment variables on your host
// (and in .env.local for local testing):
//
//   RESEND_API_KEY        required  – your Resend API key (keep it secret)
//   CONTACT_TO_EMAIL      optional  – where messages go (default: support@convertlinx.com)
//   CONTACT_FROM_EMAIL    optional  – verified sender, e.g. "ConvertLinx <contact@convertlinx.com>"
//                                     (default: Resend's test sender, which can only
//                                     deliver to the email address of your Resend account)

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "support@convertlinx.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "ConvertLinx <onboarding@resend.dev>";

const LIMITS = { name: 100, email: 254, message: 5000 };
const TOPICS = ["General", "Bug report", "Feature request", "Feedback"];

// Very small in-memory rate limit (per server instance). It stops casual
// spamming; use a shared store if you ever need strict limits.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  const name = String(data?.name ?? "").trim();
  const email = String(data?.email ?? "").trim();
  const message = String(data?.message ?? "").trim();
  const topic = TOPICS.includes(data?.topic) ? data.topic : "General";

  // Honeypot: real users never fill this hidden field. Pretend success.
  if (data?.website) {
    return json({ success: true });
  }

  if (!name || !email || !message) {
    return json({ success: false, error: "Please fill in all fields." }, 400);
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return json({ success: false, error: "Your message is too long." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, error: "Please enter a valid email." }, 400);
  }
  // Header-injection guard for fields used in the subject / reply-to.
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email)) {
    return json({ success: false, error: "Invalid input." }, 400);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return json(
      { success: false, error: "Too many messages. Please try again later." },
      429
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set; message not sent.");
    return json(
      {
        success: false,
        error:
          "Messages are temporarily unavailable. Please email support@convertlinx.com.",
      },
      503
    );
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 12px">New message from ConvertLinx</h2>
      <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[ConvertLinx] ${topic} from ${name}`,
        html,
        text: `Topic: ${topic}\nName: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend error", res.status, detail);
      return json(
        { success: false, error: "Could not send your message. Please try again." },
        502
      );
    }

    return json({ success: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return json(
      { success: false, error: "Could not send your message. Please try again." },
      502
    );
  }
}
