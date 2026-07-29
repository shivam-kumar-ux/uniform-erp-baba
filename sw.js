// UniformERP - minimal service worker
// Purpose: satisfies "Add to Home Screen" installability requirements and provides
// an offline fallback shell. Uses NETWORK-FIRST for everything: always tries to fetch
// the latest version online, and only falls back to a cached copy if there's no
// internet connection. This ensures updates to the site are always picked up immediately
// instead of getting stuck on old cached files.
// It never touches the Apps Script backend (script.google.com) — that's always live data.

const CACHE_NAME = 'uniformerp-shell-v4';
const SHELL_FILES = ['login.html', 'dashboard.html', 'theme.css?v=4', 'app.js?v=4', 'manifest.json'];

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
  // Never intercept calls to the Apps Script backend — always live data
  if (url.indexOf('script.google.com') !== -1 || url.indexOf('script.googleusercontent.com') !== -1) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function (networkResponse) {
        // Got a fresh copy — update the cache with it for offline fallback later
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(function () {
        // No internet — fall back to whatever we have cached
        return caches.match(event.request);
      })
  );
});
