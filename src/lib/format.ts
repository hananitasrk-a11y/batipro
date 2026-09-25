export const fmtMoney = (n: number | null | undefined, currency = "MAD") => {
  if (n == null) return "—";
  const value = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n));
  return `${value} ${currency}`;
};

export const fmtDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("fr-FR");
};
