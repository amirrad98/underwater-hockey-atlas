/** Production builds cache only this GitHub Pages project's local assets. */
export function registerOffline() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const base = import.meta.env.BASE_URL;
  navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
    // Reading remains available online when the browser disallows storage.
  });
}
