const CACHE_PREFIX = "monteurmaatje-";
const APP_CACHE = `${CACHE_PREFIX}app-20260821-v8`;
const DATA_CACHE = `${CACHE_PREFIX}data-20260821-v8`;
const APP_ROOT = new URL("./", self.registration.scope).href;
const appUrl = (path = "") => new URL(path, self.registration.scope).href;

const CORE_SHELL = [
  APP_ROOT,
  appUrl("index.html"),
  appUrl("style.css?v=20260821-1"),
  appUrl("app.js?v=20260821-1"),
  appUrl("manifest.webmanifest"),
  appUrl("favicon.svg"),
  appUrl("icons/mm-app-v3-192.png?v=3"),
  appUrl("icons/mm-app-v3-512.png?v=3"),
  appUrl("icons/mm-app-v3-maskable-512.png?v=3"),
  appUrl("icons/mm-app-v3-180.png?v=3"),
  appUrl("assets/fonts/569ce4b8f30dc480-s.p.woff2"),
  appUrl("assets/fonts/93f479601ee12b01-s.p.woff2"),
  appUrl("assets/regulations/rogafa/kunststof.webp"),
  appUrl("assets/regulations/rogafa/metaal.webp"),
  appUrl("assets/regulations/rogafa/concentrisch.webp"),
  appUrl("assets/regulations/rogafa/luchttoevoer.webp"),
  appUrl("assets/regulations/rogafa/schacht.webp"),
  appUrl("assets/regulations/rogafa/clv-principe.webp"),
];

const CATALOG_URL = appUrl("data/catalog.json");

function freshRequest(request, extraHeaders) {
  const headers = new Headers(request instanceof Request ? request.headers : undefined);
  if (extraHeaders) {
    for (const [name, value] of Object.entries(extraHeaders)) {
      if (value) headers.set(name, value);
    }
  }
  return new Request(request, { cache: "no-store", headers });
}

async function precache() {
  const appCache = await caches.open(APP_CACHE);
  await Promise.all(CORE_SHELL.map(async (url) => {
    const response = await fetch(freshRequest(url));
    if (!response.ok) throw new Error(`Kon app-shellbestand niet laden: ${url}`);
    await appCache.put(url, response);
  }));

  // De catalogus is de minimale offline kennisbank. Toesteldata wordt daarna
  // automatisch gecachet zodra een toestel wordt geopend.
  const dataCache = await caches.open(DATA_CACHE);
  try {
    const response = await fetch(freshRequest(CATALOG_URL));
    if (response.ok) await dataCache.put(CATALOG_URL, response);
  } catch (_) {}
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== APP_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

/**
 * Altijd controleren of een statisch bestand op de server gewijzigd is, zonder
 * het bestand opnieuw te downloaden als het gelijk is.
 *
 * - Met ETag/Last-Modified: server antwoordt 304 -> alleen enkele headers.
 * - Zonder conditional-cache ondersteuning: server antwoordt 200 -> nog steeds
 *   altijd actuele informatie (correctheid gaat voor dataverbruik).
 * - Offline/netwerkfout: laatst geldige Cache Storage-response blijft bruikbaar.
 */
function validatorsFrom(cached) {
  const validators = {};
  if (!cached) return validators;
  const etag = cached.headers.get("etag");
  const modified = cached.headers.get("last-modified");
  if (etag) validators["If-None-Match"] = etag;
  if (modified) validators["If-Modified-Since"] = modified;
  return validators;
}

async function revalidate(cacheName, request, fallbackKey = request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(fallbackKey);

  try {
    const response = await fetch(freshRequest(request, validatorsFrom(cached)));
    if (response.status === 304 && cached) return cached;

    if (response.ok) {
      await cache.put(fallbackKey, response.clone());
      return response;
    }

    // Een expliciet ontbrekend/verwijderd bestand niet verbergen met oude data.
    if (response.status === 404 || response.status === 410) return response;
    return cached || response;
  } catch (_) {
    return cached || Response.error();
  }
}

function dataShapeIsValid(url, payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;

  if (url.pathname.endsWith("/data/catalog.json")) {
    return Array.isArray(payload.brands) && payload.brands.every(
      brand => brand && typeof brand === "object" && Array.isArray(brand.devices),
    );
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const fileName = parts.at(-1) || "";
  const expectedDeviceId = parts.at(-2) || "";
  const brandId = parts.at(-3) || "";
  const acceptedDeviceIds = new Set([
    expectedDeviceId,
    brandId && expectedDeviceId ? `${brandId}-${expectedDeviceId}` : "",
  ]);
  if (!expectedDeviceId || !acceptedDeviceIds.has(payload.deviceId)) return false;

  if (fileName === "faults.json") return Array.isArray(payload.faults);
  if (fileName === "parameters.json") return Array.isArray(payload.parameters);
  if (fileName === "diagnostics.json") return Array.isArray(payload.diagnostics);
  if (fileName === "combustion.json") {
    return Array.isArray(payload.measurements) || Array.isArray(payload.settings);
  }
  return true;
}

async function revalidateData(request) {
  const cache = await caches.open(DATA_CACHE);
  const cached = await cache.match(request);
  const url = new URL(request.url);

  try {
    const response = await fetch(freshRequest(request, validatorsFrom(cached)));
    if (response.status === 304 && cached) return cached;

    if (response.ok) {
      try {
        const payload = await response.clone().json();
        if (!dataShapeIsValid(url, payload)) throw new Error("ongeldige datastructuur");
      } catch (error) {
        console.error(`Nieuwe kennisbankdata geweigerd (${url.pathname})`, error);
        // Nooit een malformed/wrong-device JSON over de laatst geldige cache heen schrijven.
        return cached || new Response("Ongeldige kennisbankdata", {
          status: 502,
          statusText: "Invalid knowledge data",
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      await cache.put(request, response.clone());
      return response;
    }

    if (response.status === 404 || response.status === 410) return response;
    return cached || response;
  } catch (_) {
    return cached || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(revalidate(APP_CACHE, request, APP_ROOT));
    return;
  }

  const dataRoot = new URL("data/", self.registration.scope).pathname;
  if (url.pathname.startsWith(dataRoot) && url.pathname.endsWith(".json")) {
    event.respondWith(revalidateData(request));
    return;
  }

  // Ook frontend-assets worden conditioneel gevalideerd. Een gewijzigde app.js,
  // stylesheet of icoon is daardoor bij de volgende load direct actueel zonder
  // dat hiervoor een handmatige appRevision nodig is. Alleen een wijziging van
  // sw.js zelf doorloopt de normale serviceworker-updateflow.
  event.respondWith(revalidate(APP_CACHE, request));
});
