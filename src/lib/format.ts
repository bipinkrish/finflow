export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumberWithUnits(value: number) {
  if (value >= 1_00_00_000) {
    const formattedValue = (value / 1_00_00_000).toFixed(2);
    return parseFloat(formattedValue) % 1 === 0
      ? parseInt(formattedValue) + "Cr"
      : formattedValue + "Cr";
  } else if (value >= 1_00_000) {
    const formattedValue = (value / 10_00_00).toFixed(2);
    return parseFloat(formattedValue) % 1 === 0
      ? parseInt(formattedValue) + "L"
      : formattedValue + "L";
  }
  const formattedValue = (value / 1_000).toFixed(2);
  return parseFloat(formattedValue) % 1 === 0
    ? parseInt(formattedValue) + "K"
    : formattedValue + "K";
}

export function parseFormattedValue(value: string) {
  // Remove commas, units, and whitespace for parsing back to a number
  return parseFloat(value.replace(/,/g, "").replace(/[a-zA-Z ]+/g, ""));
}

export function formatYearsFraction(yearFraction: number) {
  const years = Math.floor(yearFraction); // Extract whole years
  const months = Math.round((yearFraction - years) * 12); // Convert fractional part to months
  if (months === 0) {
    return `${years} years`;
  }
  if (years === 0) {
    return `${months} months`;
  }

  return `${years} years, ${months} months`;
}
