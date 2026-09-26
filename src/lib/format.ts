const parseMoneyValue = (input: number | string | null | undefined) => {
  if (input == null) return null;

  const text = String(input).trim();
  if (text === "") return null;

  const negative = text.startsWith("-");
  const cleaned = text
    .replace(/\s+/g, "")
    .replace(/\//g, "")
    .replace(/[^\d,.-]/g, "");

  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === ",") return null;

  const normalized = cleaned.replace(/\.(?=.*\.)/g, "").replace(/,(?=.*[,])/g, "");
  const lastDot = normalized.lastIndexOf(".");
  const lastComma = normalized.lastIndexOf(",");

  let numeric = normalized;
  if (lastDot > lastComma) {
    numeric = normalized.replace(/\./g, "").replace(",", ".");
  } else if (lastComma > lastDot) {
    numeric = normalized.replace(/\./g, "").replace(",", ".");
  } else if (normalized.includes(",")) {
    numeric = normalized.replace(",", ".");
  }

  const value = Number(numeric);
  if (!Number.isFinite(value)) return null;
  return negative ? -value : value;
};

export const fmtMoney = (n: number | null | undefined, currency = "MAD") => {
  const value = parseMoneyValue(n);
  if (value == null) return "—";

  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absolute);

  return `${sign}${formatted} ${currency}`;
};

export const fmtDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("fr-FR");
};
