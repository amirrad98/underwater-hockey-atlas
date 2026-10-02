import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

function filesAt(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = `${prefix}${entry.name}`;
    return entry.isDirectory() ? filesAt(join(directory, entry.name), `${name}/`) : [name];
  });
}

export function offlinePlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'atlas-scoped-offline',
    apply: 'build',
    configResolved(value) { config = value; },
    closeBundle() {
      const directory = resolve(config.root, config.build.outDir);
      const paths = filesAt(directory).filter(path => path !== 'sw.js').sort();
      const hash = createHash('sha256');
      for (const path of paths) hash.update(path).update(readFileSync(join(directory, path)));
      const version = hash.digest('hex').slice(0, 16);
      const source = `// Generated from this build's local assets. Scope and cache cleanup are project-specific.
const BASE = new URL(${JSON.stringify(config.base)}, self.location.origin);
const PREFIX = 'uwh-atlas:' + BASE.pathname + ':';
const CACHE = PREFIX + ${JSON.stringify(version)};
const FILES = ${JSON.stringify(paths)}.map(path => new URL(path, BASE).href);
const SHELL = new URL('index.html', BASE).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  const isShell = request.mode === 'navigate' && (url.pathname === BASE.pathname || url.pathname === BASE.pathname + 'index.html');
  if (isShell) {
    event.respondWith(fetch(request).then(response => {
      if (!response.ok) throw new Error('Shell unavailable');
      return response;
    }).catch(() => caches.open(CACHE).then(cache => cache.match(SHELL))));
  } else if (FILES.includes(url.href)) {
    // These exact URLs are public static files from this build. Ignore header
    // variance (e.g. Vary: Origin on CORS script/style requests) so a prefetched
    // asset remains available offline when the browser requests it differently.
    event.respondWith(caches.open(CACHE).then(cache => cache.match(request, { ignoreVary: true })).then(cached => cached || fetch(request)));
  }
});
`;
      writeFileSync(join(directory, 'sw.js'), source);
    },
  };
}
