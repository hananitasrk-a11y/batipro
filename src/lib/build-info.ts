// Identifiant de build injecté à la compilation (voir export-static/vite.config.ts).
// En développement, aucune valeur n'est injectée → "dev".
declare const __BUILD_ID__: string | undefined;

function readInjected(): string | undefined {
  try {
    return typeof __BUILD_ID__ === "string" ? __BUILD_ID__ : undefined;
  } catch {
    return undefined;
  }
}

export const BUILD_ID: string = readInjected() ?? "dev";

/** Hash du fichier JS principal réellement chargé par le navigateur. */
export function loadedBundleName(): string {
  if (typeof document === "undefined") return "ssr";
  const scripts = Array.from(document.querySelectorAll("script[src]")) as HTMLScriptElement[];
  const main = scripts.map((s) => s.src).find((src) => /assets\/.*\.js/.test(src));
  return main ? main.split("/").pop()! : "—";
}
