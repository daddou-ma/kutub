import { registerRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
  NetworkOnly
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

const hash = "0001";

// HTML
// https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing#registerRoute
registerRoute(
  /(index\.html|\/$|login|library|reader\/.*|settings|settings\/language|about)/,
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies
  new StaleWhileRevalidate({
    cacheName: "workbox:html",
  })
);

// JS
registerRoute(
  new RegExp(".*.js"),
  new NetworkFirst({
    cacheName: "workbox:js",
  })
);

// 
registerRoute(
  /.*\.hot-update\.(json|js)/,
  new NetworkOnly()
);

// CSS
registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  new StaleWhileRevalidate({
    // Use a custom cache name
    cacheName: "workbox:css",
  })
);

// IMAGES
registerRoute(
  // Cache image files
  /.*\.(?:webp|png|jpg|jpeg|svg|gif|ico)/,
  // Use the cache if it's available
  new CacheFirst({
    // Use a custom cache name
    cacheName: "workbox:image",
    plugins: [
      new ExpirationPlugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === "https://apis.google.com",
  new StaleWhileRevalidate({
    cacheName: "google-apis",
  })
);

registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// EPUB
registerRoute(
  /.*\.epub/,
  new CacheFirst({
    cacheName: "workbox:epub",
  })
);
