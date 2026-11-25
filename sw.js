// Offline cache. The page itself is fetched fresh when online, so updates arrive by themselves.
const V = "prokachka-202611252344";
const FILES = ["./", "index.html", "parts.js", "manifest.json", "icon-192.png", "icon-512.png", "icon-180.png", "portraits/base-sample.png", "portraits/c-boss.jpg", "portraits/c-coach.jpg", "portraits/c-mom.jpg", "portraits/c-nika.jpg", "portraits/c-prof.jpg", "portraits/c-shadow.jpg", "portraits/me1.jpg", "portraits/me2.jpg", "portraits/me3.jpg", "portraits/me4.jpg", "portraits/me5.jpg", "portraits/me6.jpg", "portraits/v0.jpg", "portraits/v1.jpg", "portraits/v2.jpg", "portraits/v3.jpg", "portraits/v4.jpg", "portraits/v5.jpg", "portraits/v6.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const page = r.mode === "navigate" || r.url.endsWith("/index.html");
  if (page) { e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match("index.html")))); return; }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === "opaque") { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); } return res; })));
});
