/* TRIA service worker.
 *
 * The app is a fixed bundle with no server component, so the strategy is
 * simply: precache everything, serve cache-first, and swap the whole cache
 * atomically when the version changes.
 */

var VERSION = "tria-v1";

var ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/css/app.css",
  "assets/js/data.js",
  "assets/js/views.js",
  "assets/js/views-tools.js",
  "assets/js/views-docs.js",
  "assets/js/app.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/maskable-512.png",
  "assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === VERSION ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        // Cache same-origin successes so a deep link visited once stays offline-ready.
        if (res && res.ok && res.type === "basic") {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Navigations offline fall back to the shell; the router takes it from there.
        if (req.mode === "navigate") return caches.match("index.html");
        return Response.error();
      });
    })
  );
});
