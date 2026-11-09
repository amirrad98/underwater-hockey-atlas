import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

// Package the existing production build as an offline-openable review artifact.
// Source catalogs and production hosting configuration are not changed.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
let html = await readFile(resolve(dist, "index.html"), "utf8");
const scripts = [
  ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g),
];
if (scripts.length !== 1)
  throw new Error(
    "Expected one bundled script; review the preview packager before adding split chunks.",
  );
const assetPrefix = scripts[0][1].slice(0, scripts[0][1].lastIndexOf("/") + 1);
const embeddedAssets = [];
const mimeTypes = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf" };
for (const name of await readdir(resolve(dist, "assets"))) {
  const extension = name.slice(name.lastIndexOf("."));
  const mime = mimeTypes[extension];
  if (!mime) continue;
  const data = await readFile(resolve(dist, "assets", name));
  embeddedAssets.push([`${assetPrefix}${name}`, `data:${mime};base64,${data.toString("base64")}`]);
}
function inlineAssets(source) {
  for (const [path, data] of embeddedAssets) source = source.replaceAll(path, data);
  return source;
}
for (const [tag, source] of scripts) {
  const script = await readFile(
    resolve(dist, "assets", basename(source)),
    "utf8",
  );
  html = html.replace(
    tag,
    () =>
      `<script type="module">${inlineAssets(script).replaceAll("</script", "<\\/script")}</script>`,
  );
}
for (const [tag, source] of [
  ...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g),
]) {
  const style = await readFile(
    resolve(dist, "assets", basename(source)),
    "utf8",
  );
  html = html.replace(
    tag,
    () => `<style>${inlineAssets(style).replaceAll("</style", "<\\/style")}</style>`,
  );
}
const favicon = await readFile(resolve(dist, "favicon.svg"), "utf8");
html = html.replace(
  /href="[^"]*favicon\.svg"/,
  `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`,
);
html = html.replace(
  "<head>",
  "<head>\n<!-- Standalone review preview. Generated from the production build. -->",
);
const output = resolve(root, "docs/review/preview.html");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`Saved standalone review preview: ${output}`);
