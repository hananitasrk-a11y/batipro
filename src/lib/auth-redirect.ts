/**
 * Redirections d'authentification indépendantes du domaine.
 * Toutes les URLs sont dérivées de l'origine courante (window.location.origin),
 * donc un changement de domaine (ex. InfinityFree) fonctionne sans modifier le code.
 */

export const APP_ORIGIN = (): string =>
  typeof window !== "undefined" ? window.location.origin : "";

/** URL de retour après connexion OAuth / lien magique. */
export const authRedirectUrl = (path = "/dashboard"): string =>
  `${APP_ORIGIN()}${path.startsWith("/") ? path : `/${path}`}`;

/** Liste des URLs à autoriser côté backend pour le domaine courant. */
export const allowedRedirectUrls = (): string[] => {
  const origin = APP_ORIGIN();
  if (!origin) return [];
  return [origin, `${origin}/`, `${origin}/dashboard`, `${origin}/auth`, `${origin}/*`];
};
