export const CURRENCIES = {
  USD: "US Dollar",
  PKR: "Pakistani Rupee",
  SAR: "Saudi Riyal",
  AED: "UAE Dirham",
  EUR: "Euro",
  GBP: "British Pound",
  INR: "Indian Rupee",
  BDT: "Bangladeshi Taka",
  QAR: "Qatari Riyal",
  KWD: "Kuwaiti Dinar",
  OMR: "Omani Rial",
  BHD: "Bahraini Dinar",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CNY: "Chinese Yuan",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  TRY: "Turkish Lira",
  MYR: "Malaysian Ringgit",
  SGD: "Singapore Dollar",
};

export const PAIR_AMOUNTS = [1, 5, 10, 100, 1000];

// rates are "units per 1 USD"
export function convertCurrency(amount, from, to, rates) {
  if (!Number.isFinite(amount) || amount < 0) return null;
  if (!rates?.[from] || !rates?.[to]) return null;
  return (amount / rates[from]) * rates[to];
}

export function formatMoney(value) {
  const digits = value !== 0 && Math.abs(value) < 1 ? 6 : 2;
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}
