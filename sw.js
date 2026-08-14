const APP_VERSION = new URL(self.location.href).searchParams.get("app") || "legacy";
const CACHE_PREFIX = "monteurmaatje-";
const CACHE_NAME = `${CACHE_PREFIX}app-${APP_VERSION.replace(/[^a-z0-9_-]/gi, "")}`;
const APP_ROOT = new URL("./", self.registration.scope).pathname;
const appUrl = (path = "") => new URL(path, self.registration.scope).pathname;
const CORE_SHELL = [
  APP_ROOT,
  appUrl("manifest.webmanifest"),
  appUrl("favicon.svg"),
  appUrl("icons/icon-192.png"),
  appUrl("icons/icon-512.png"),
  appUrl("icons/icon-maskable-512.png"),
  appUrl("icons/apple-touch-icon.png"),
  appUrl("data/catalog.json"),
];

async function precacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const rootRequest = new Request(APP_ROOT, { cache: "reload" });
  const rootResponse = await fetch(rootRequest);

  if (!rootResponse.ok) throw new Error(`Kon app-shell niet laden (${rootResponse.status})`);

  const html = await rootResponse.clone().text();
  const shellUrls = new Set(CORE_SHELL);

  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = new URL(match[1], self.registration.scope);
    if (url.origin === self.location.origin && url.pathname.startsWith(APP_ROOT)) {
      shellUrls.add(url.pathname + url.search);
    }
  }

  await cache.put(APP_ROOT, rootResponse);
  shellUrls.delete(APP_ROOT);

  await Promise.all([...shellUrls].map(async (url) => {
    const response = await fetch(new Request(url, { cache: "reload" }));
    if (!response.ok) throw new Error(`Kon app-shellbestand niet laden: ${url}`);
    await cache.put(url, response);
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheAppShell());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

async function networkFirst(request, fallbackKey = request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkRequest = new Request(request, { cache: "no-store" });
    const response = await fetch(networkRequest);
    if (response.ok) await cache.put(fallbackKey, response.clone());
    return response;
  } catch {
    const cached = await cache.match(fallbackKey);
    return cached || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, APP_ROOT));
    return;
  }

  if (url.pathname.startsWith(appUrl("data/")) && url.pathname.endsWith(".json")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.destination === "script" || request.destination === "style") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
      }
      return response;
    })),
  );
});
