// Service worker MiConseil : fonctionne hors ligne dès la première visite.
// La liste PRECACHE et la version sont injectées au build par le plugin de vite.config.ts (assets hachés compris).
const VERSION = "__VERSION__";
const PRECACHE = ["__PRECACHE__"];
const CACHE = "miconseil-" + VERSION;

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(PRECACHE.filter((u) => u !== "__PRECACHE__").map((u) => c.add(u).catch(() => {})))));
});
self.addEventListener("activate", (e) =>
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));

const HORS_LIGNE = "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>MiConseil hors ligne</title><body style='font-family:system-ui;padding:24px'><h1>Vous êtes hors ligne</h1><p>MiConseil n'a pas encore pu se charger complètement. Reconnectez-vous une fois : ensuite l'application fonctionnera sans connexion.</p>";

// Stale-while-revalidate : on répond tout de suite avec la copie en cache et on la rafraîchit en arrière-plan.
async function swr(req) {
  const c = await caches.open(CACHE);
  const cached = await c.match(req);
  const reseau = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
  return cached || (await reseau) || Response.error();
}

self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    // Pages : réseau d'abord (contenu à jour), sinon l'application en cache, sinon page hors ligne.
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put("/", copy)); return r; })
      .catch(() => caches.match("/").then((m) => m || new Response(HORS_LIGNE, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }))));
    return;
  }
  e.respondWith(swr(req));
});
