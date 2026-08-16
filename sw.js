if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: false,
  });
}
importScripts("./riptide-sw-router.js");
importScripts("./sapphire-sw-router.js");
importScripts("./controller/controller.sw.js");

// Take over as soon as a new worker is available, and start controlling
// already-open pages immediately. Without this a rebuilt worker (e.g. a change
// to the Sapphire router) sits in "waiting" until every tab is closed, so
// fixes appear not to apply. None of the imported routers claim clients.
addEventListener("install", () => self.skipWaiting());
addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

addEventListener("fetch", (e) => {
  if ($riptideRouter.shouldRoute(e)) {
    e.respondWith($riptideRouter.route(e));
    return;
  }
  if ($sapphireRouter.shouldRoute(e)) {
    e.respondWith($sapphireRouter.route(e));
    return;
  }
  if ($scramjetController.shouldRoute(e)) {
    e.respondWith($scramjetController.route(e));
  }
});