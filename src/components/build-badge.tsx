import { useEffect, useState } from "react";
import { BUILD_ID, loadedBundleName } from "@/lib/build-info";
import { X, Copy, Check } from "lucide-react";

export function BuildBadge() {
  const [bundle, setBundle] = useState("—");
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    setBundle(loadedBundleName());
  }, []);

  if (!import.meta.env.DEV) return null;
  if (hidden) return null;

  const text = `build ${BUILD_ID} · ${bundle}`;

  return (
    <div className="pointer-events-auto fixed bottom-3 right-3 z-[60] flex items-center gap-2 rounded-full border bg-card/90 px-3 py-1.5 text-[11px] font-mono text-muted-foreground shadow-[var(--shadow-card)] backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <span title={text}>{text}</span>
      <button
        aria-label="Copier la version du build"
        className="rounded p-0.5 hover:text-foreground"
        onClick={() => {
          navigator.clipboard?.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>
      <button aria-label="Masquer le bandeau de version" className="rounded p-0.5 hover:text-foreground" onClick={() => setHidden(true)}>
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
