// UniformERP - minimal service worker
// Purpose: satisfies "Add to Home Screen" installability requirements and provides
// a light app-shell cache so the site opens instantly even on a slow connection.
// It does NOT cache API calls (script.google.com) — those always go to the network,
// so billing/inventory data is always fresh.

const CACHE_NAME = 'uniformerp-shell-v1';
const SHELL_FILES = ['login.html', 'dashboard.html', 'theme.css', 'app.js', 'manifest.json'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_FILES).catch(function () { /* ignore individual failures */ });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  const url = event.request.url;
  // Never cache calls to the Apps Script backend — always live data
  if (url.indexOf('script.google.com') !== -1 || url.indexOf('script.googleusercontent.com') !== -1) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).catch(function () { return cached; });
    })
  );
});
