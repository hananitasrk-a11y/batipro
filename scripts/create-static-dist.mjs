import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(projectRoot, "dist");
const assetsDir = path.join(distDir, "assets");

const assets = await readdir(assetsDir);
const clientEntry = assets.find((file) => /^entry-static-[^/]+\.js$/.test(file));
const stylesheet = assets.find((file) => /^styles-[^/]+\.css$/.test(file));

if (!clientEntry || !stylesheet) {
  throw new Error("Unable to find the generated client entry or stylesheet in dist/assets.");
}

await mkdir(distDir, { recursive: true });

const indexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BatiPro — ERP BTP complet</title>
    <meta name="description" content="Logiciel de gestion intégrée pour entreprises de BTP." />
    <link rel="stylesheet" href="/assets/${stylesheet}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${clientEntry}"></script>
  </body>
</html>
`;

await writeFile(path.join(distDir, "index.html"), indexHtml, "utf8");
await cp(path.join(distDir, "index.html"), path.join(distDir, "404.html"));
for (const route of [
  "auth",
  "dashboard",
  "achats",
  "alertes",
  "caisses",
  "comptabilite",
  "donnees",
  "materiel",
  "personnel",
  "production",
  "stocks",
  "transport",
  "ventes",
]) {
  const routeDir = path.join(distDir, route);
  await mkdir(routeDir, { recursive: true });
  await cp(path.join(distDir, "index.html"), path.join(routeDir, "index.html"));
}
await writeFile(
  path.join(distDir, "_redirects"),
  "/*    /index.html   200\n",
  "utf8",
);
await writeFile(
  path.join(distDir, ".htaccess"),
  `RewriteEngine On
RewriteBase /
<IfModule mod_headers.c>
  <FilesMatch "^(index|404)\\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </FilesMatch>
</IfModule>
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
`,
  "utf8",
);
console.log(`Static distribution generated in ${path.relative(projectRoot, distDir)}.`);
