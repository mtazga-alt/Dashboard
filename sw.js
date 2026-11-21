// قضايتي — Service Worker (يعمل بدون اتصال)
// لتحديث التطبيق بعد رفع ملفات جديدة: غيّر رقم الإصدار هنا (v1 -> v2)
const CACHE = 'qadayti-v1';
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/app.js",
  "./assets/app.css",
  "./assets/local-store.js",
  "./splash-icon.webp",
  "./icon-192.png",
  "./icon-512.png",
  "./maskable-192.png",
  "./maskable-512.png",
  "./apple-touch-icon.png",
  "./favicon-32.png",
  "./fonts/fonts.css",
  "./fonts/f0.woff2",
  "./fonts/f1.woff2",
  "./fonts/f2.woff2",
  "./fonts/f3.woff2",
  "./fonts/f4.woff2",
  "./fonts/f5.woff2",
  "./fonts/f6.woff2",
  "./fonts/f7.woff2",
  "./fonts/f8.woff2"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(hit => hit || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
