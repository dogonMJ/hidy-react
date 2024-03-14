/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;
const expirationPlugin = new ExpirationPlugin({
  maxEntries: 50,
  maxAgeSeconds: 30,
})
clientsClaim();

// const filteredManifest: (string | PrecacheEntry)[] = self.__WB_MANIFEST.filter((entry: string | PrecacheEntry) => {
//   console.log(entry)
//   if (typeof entry === 'string') {
//     return true;
//   }
//   return !entry.url.includes('index.html');
// });
// precacheAndRoute(filteredManifest);
precacheAndRoute(self.__WB_MANIFEST);

// const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
// registerRoute(
//   // Return false to exempt requests from being fulfilled by index.html.
//   ({ request, url }: { request: Request; url: URL }) => {
//     // If this isn't a navigation, skip.
//     if (request.mode !== 'navigate') {
//       return false;
//     }

//     // If this is a URL that starts with /_, skip.
//     if (url.pathname.startsWith('/_')) {
//       return false;
//     }

//     // If this looks like a URL for a resource, because it contains
//     // a file extension, skip.
//     if (url.pathname.match(fileExtensionRegexp)) {
//       return false;
//     }

//     if (url.pathname === 'index.html') {
//       return false; // Exclude index.html from service worker handling
//     }
//     // Return true to signal that we want to use the handler.
//     return true;
//   },
//   new NetworkFirst()
//   // createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
//   // createHandlerBoundToURL('index.html')
// );

registerRoute(
  ({ url }) => {
    const format = url.searchParams.get('format')
    const isPNG = format ? format.toLowerCase() === 'image/png' : false
    return url.href.includes('marineheatwave:mhw') && isPNG ? true : false
  },
  new StaleWhileRevalidate({
    cacheName: 'mhw-cache',
    plugins: [
      expirationPlugin,
    ],
  })
);
// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

//重啟sw時(全部sw相關工作停止eg關閉chrome/skipwaiting sw)清除cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName); // Deleting the cache
        })
      );
    })
  );
});
