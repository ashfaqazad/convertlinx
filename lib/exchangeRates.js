// Server-side only: imported by app/[tool]/page.js. There is deliberately no public
// API route, because the provider's terms do not allow re-distributing its data.
// Docs: https://www.exchangerate-api.com/docs/free (updates once a day, attribution required)
import { CURRENCIES } from "./currencies";

// The env var is only for testing the failure case
const API_URL = process.env.EXCHANGE_RATE_API_URL || "https://open.er-api.com/v6/latest/USD";
const REVALIDATE_SECONDS = 6 * 60 * 60;

export async function getExchangeRates() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.result !== "success" || !data.rates?.PKR) throw new Error("unexpected response");

    const rates = {};
    for (const code of Object.keys(CURRENCIES)) {
      const rate = data.rates[code];
      if (typeof rate === "number" && rate > 0) rates[code] = rate;
    }
    return { rates, updatedAt: data.time_last_update_unix * 1000 };
  } catch (error) {
    console.error("Exchange rate fetch failed:", error.message);
    // While a live page is being refreshed, throwing keeps the last good page online.
    // At build time and in dev there is no earlier page, so show the error state.
    const refreshingLivePage =
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PHASE !== "phase-production-build";
    if (refreshingLivePage) throw error;
    return null;
  }
}
