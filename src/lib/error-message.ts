type ErrorLike = {
  message?: unknown;
  details?: unknown;
  hint?: unknown;
  code?: unknown;
};

export function getErrorMessage(error: unknown, fallback = "Une erreur est survenue") {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;

  if (error && typeof error === "object") {
    const value = error as ErrorLike;
    const message = typeof value.message === "string" ? value.message : "";
    const details = typeof value.details === "string" ? value.details : "";
    const hint = typeof value.hint === "string" ? value.hint : "";
    const code = typeof value.code === "string" ? ` [${value.code}]` : "";
    const parts = [message, details, hint].filter(Boolean);
    if (parts.length > 0) return `${parts.join(" — ")}${code}`;
  }

  return fallback;
}
