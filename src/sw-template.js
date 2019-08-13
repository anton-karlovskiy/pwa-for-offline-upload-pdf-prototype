
if ('function' === typeof importScripts) {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded!');

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

    /* custom cache rules*/
    workbox.routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    });

    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      })
    );
  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}

const CACHE_VERSION = 2;

// Shorthand identifier mapped to specific versioned cache.
const CURRENT_CACHES = {
  DYNAMIC_NAME: 'ect-dynamic-v' + CACHE_VERSION
};

const matchFunction = ({url, event}) => {
  return new RegExp('max-res|medium-res|min-res|4g-video');
};

// dynamic cache based on stable-with-revalidate strategy
workbox.routing.registerRoute(
  matchFunction,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CURRENT_CACHES.DYNAMIC_NAME,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 Day
      }),
    ],
  })
);
