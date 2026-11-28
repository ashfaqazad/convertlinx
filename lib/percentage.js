// Percentage maths for the percentage calculator.
// Each function returns { value } or { error }. Blank input returns null.

const INVALID = "Please enter valid numbers.";

function read(...inputs) {
  if (inputs.some((v) => String(v).trim() === "")) return null;
  const numbers = inputs.map(Number);
  return numbers.every(Number.isFinite) ? { numbers } : { error: INVALID };
}

function solve(inputs, calculate) {
  const input = read(...inputs);
  if (!input) return null;
  if (input.error) return input;
  const result = calculate(...input.numbers);
  if (result.error) return result;
  return Number.isFinite(result.value) ? result : { error: "These numbers are too large to calculate." };
}

// What is percent% of total?
export const percentOf = (percent, total) =>
  solve([percent, total], (p, t) => ({ value: (t * p) / 100 }));

// part is what percent of total?
export const whatPercent = (part, total) =>
  solve([part, total], (p, t) =>
    t === 0
      ? { error: "The second number cannot be zero, because nothing can be a percentage of zero." }
      : { value: (p / t) * 100 });

// Percentage change from one value to another
export const percentChange = (from, to) =>
  solve([from, to], (a, b) =>
    a === 0
      ? { error: "A percentage change from zero is not defined. Enter a starting value other than zero." }
      : { value: ((b - a) / Math.abs(a)) * 100, difference: b - a });

// Add percent% to a number, or subtract it
export const adjustByPercent = (number, percent, direction) =>
  solve([number, percent], (n, p) => {
    const amount = (n * p) / 100;
    return { value: direction === "subtract" ? n - amount : n + amount, amount };
  });

export function formatNumber(value) {
  // Hides floating point noise such as 0.1 + 0.2 = 0.30000000000000004
  const clean = Number(value.toPrecision(12)) || 0;
  const options = clean !== 0 && Math.abs(clean) < 0.000001
    ? { maximumSignificantDigits: 6 }
    : { maximumFractionDigits: 6 };
  return new Intl.NumberFormat("en-US", options).format(clean);
}
