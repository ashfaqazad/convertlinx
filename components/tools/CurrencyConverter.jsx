"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, RefreshCw, Globe, ShieldCheck } from "lucide-react";
import { ToolHero, ToolSections, CopyButton, Block } from "@/components/ToolSections";
import { CURRENCIES, PAIR_AMOUNTS, convertCurrency, formatMoney } from "@/lib/currencies";

const PAIRS = [
  ["/usd-to-pkr", "USD to PKR"],
  ["/sar-to-pkr", "SAR to PKR"],
  ["/aed-to-pkr", "AED to PKR"],
];

const FAQS = [
  { q: "Where do the exchange rates come from?", a: "Rates come from Exchange Rate API. The provider updates them once a day, and this page shows when the rates were last updated." },
  { q: "Are these the rates I will get at a bank or exchange company?", a: "No. They are indicative reference rates. Banks, exchange companies and remittance services add their own margin and fees, so ask them for the rate you will actually receive." },
  { q: "Is the currency converter live?", a: "It is not a tick-by-tick trading feed. Rates refresh daily, which suits estimates and planning but not trading decisions." },
  { q: "Is it free?", a: "Yes. The converter is free and needs no signup." },
];

const dateTime = (ms) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(ms) + " UTC";

export default function CurrencyConverter({ seo, rates: data }) {
  const pair = Boolean(seo.fromCurrency);
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState(seo.fromCurrency || "USD");
  const [to, setTo] = useState(seo.toCurrency || "PKR");
  const [stale, setStale] = useState(false);

  useEffect(() => {
    setStale(Boolean(data) && Date.now() - data.updatedAt > 48 * 60 * 60 * 1000);
  }, [data]);

  const rates = data?.rates;
  const value = amount.trim() === "" ? NaN : Number(amount);
  const result = rates ? convertCurrency(value, from, to, rates) : null;
  const unit = rates ? convertCurrency(1, from, to, rates) : null;

  const select = (label, current, onChange) => (
    <label className="block min-w-0">
      <span className="uc-select-label">{label}</span>
      <select className="uc-select" value={current} onChange={(e) => onChange(e.target.value)}>
        {Object.keys(rates).map((code) => <option key={code} value={code}>{`${code} - ${CURRENCIES[code]}`}</option>)}
      </select>
    </label>
  );

  return (
    <main className="uc-page">
      <ToolHero
        crumb={seo.breadcrumb || "Currency Converter"}
        title={pair ? seo.h1 : "Currency"}
        accent={pair ? "" : "Converter"}
        intro={seo.intro || "Convert US dollars, Saudi riyals, UAE dirhams, Pakistani rupees and more with daily reference rates."}
      />

      <section className="uc-section-main py-10 px-6">
        <div className="max-w-2xl mx-auto uc-tool-card">
          {!rates ? (
            <div className="dc-error" role="alert">
              <p>Exchange rates are not available right now. No conversion is shown, so that you never see a wrong rate. Please try again later.</p>
              <button type="button" className="dc-tab mt-3" onClick={() => window.location.reload()}>Try again</button>
            </div>
          ) : (
            <>
              <label className="block mb-5">
                <span className="uc-select-label">Amount</span>
                <input type="number" inputMode="decimal" min="0" step="any" className="dc-field" value={amount}
                  onChange={(e) => setAmount(e.target.value)} />
              </label>
              <div className="dc-swap-row">
                {select("From", from, setFrom)}
                <button type="button" className="uc-swap-btn" aria-label="Swap currencies"
                  onClick={() => { setFrom(to); setTo(from); }}>
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
                {select("To", to, setTo)}
              </div>

              <div aria-live="polite">
                {result === null ? (
                  <p className="uc-result-empty">Enter an amount of 0 or more</p>
                ) : (
                  <div className="uc-result">
                    <div className="uc-result-number">{`${formatMoney(result)} ${to}`}</div>
                    <p className="uc-result-unit">{`${formatMoney(value)} ${from} = ${formatMoney(result)} ${to}`}</p>
                    <p className="uc-result-unit">{`1 ${from} = ${formatMoney(unit)} ${to}`}</p>
                    <CopyButton text={`${formatMoney(value)} ${from} = ${formatMoney(result)} ${to}`} />
                  </div>
                )}
              </div>

              <p className="dc-note">
                {`Indicative rates only, last updated ${dateTime(data.updatedAt)}. `}
                {stale && "These rates are more than two days old, so please check a current source. "}
                Your bank or exchange company will quote a different rate.{" "}
                <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener" className="dc-link">
                  Rates By Exchange Rate API
                </a>
              </p>
            </>
          )}
        </div>
      </section>

      <ToolSections
        benefits={[
          { icon: RefreshCw, color: "#6366F1", title: "Daily Rates", desc: "Reference rates with the last update time shown." },
          { icon: Globe, color: "#10B981", title: "Gulf and Major Currencies", desc: "PKR, SAR, AED, USD, GBP, EUR and more." },
          { icon: ShieldCheck, color: "#F59E0B", title: "No Made-Up Numbers", desc: "If rates cannot be loaded, the page says so." },
        ]}
        steps={seo.howItWorks}
        related={[
          ...(pair ? [["/currency-converter", "Currency Converter"]] : []),
          ...PAIRS.filter(([href]) => href !== seo.canonical),
          ["/unit-converter", "Unit Converter"],
        ]}
        faqs={seo.faqs || FAQS}
        ctaTitle="Convert another amount"
        ctaText="Free, no signup. Check the final rate with your provider before you send money."
      >
        {pair && rates && (
          <Block title={`${seo.fromCurrency} to ${seo.toCurrency} conversion table`}>
            <div className="dc-table-wrap">
              <table className="dc-table">
                <thead>
                  <tr><th>{CURRENCIES[seo.fromCurrency]}</th><th>{CURRENCIES[seo.toCurrency]}</th></tr>
                </thead>
                <tbody>
                  {PAIR_AMOUNTS.map((n) => (
                    <tr key={n}>
                      <td>{`${formatMoney(n)} ${seo.fromCurrency}`}</td>
                      <td>{`${formatMoney(convertCurrency(n, seo.fromCurrency, seo.toCurrency, rates))} ${seo.toCurrency}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs">Indicative values based on the rates shown above.</p>
          </Block>
        )}

        {pair ? (
          <>
            <Block title={seo.extraTitle}>
              <p>{seo.extra}</p>
            </Block>
            <Block title="Other conversions">
              <p>
                Change either currency in the box above, or open the main{" "}
                <Link href="/currency-converter" className="dc-link">currency converter</Link>. For length, weight or
                temperature, use the <Link href="/unit-converter" className="dc-link">unit converter</Link>.
              </p>
            </Block>
          </>
        ) : (
          <>
            <Block title="Free online currency converter">
              <p>
                This <strong>currency converter</strong> gives a quick estimate for budgeting, invoices, shopping and
                money sent home from abroad. Popular pages:{" "}
                {PAIRS.map(([href, label], i) => (
                  <span key={href}>{i > 0 && ", "}<Link href={href} className="dc-link">{label}</Link></span>
                ))}.
              </p>
            </Block>
            <Block title="Why your actual rate differs">
              <p>
                A reference rate sits between the buying and selling price. When you exchange cash or send money,
                the provider usually offers a less favourable rate and may charge a fee as well. Compare the final
                amount the receiver gets, not only the headline rate. For measurements rather than money, use the{" "}
                <Link href="/unit-converter" className="dc-link">unit converter</Link>.
              </p>
            </Block>
          </>
        )}
      </ToolSections>
    </main>
  );
}
