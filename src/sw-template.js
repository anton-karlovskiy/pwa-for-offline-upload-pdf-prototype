
if ('function' === typeof importScripts) {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
  );

  // FYI: supports promise in IndexedDB methods so that it can be used in service worker
  importScripts('./idb.js');

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

const CACHE_VERSION = 3;

// shorthand identifier mapped to specific versioned cache.
const CURRENT_CACHES = {
  DYNAMIC_NAME: 'ect-dynamic-v' + CACHE_VERSION
};

const matchFunction = ({url, event}) => {
  return new RegExp('max-res|medium-res|min-res|4g-video');
};

// FYI: dynamic cache based on stable-with-revalidate strategy
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

// TODO: duplicated code snippets because of impossible to import outsourced methods in service worker
const dbPromise = idb.openDB('pdfs-store', 1, {
  upgrade(db) {
    db.createObjectStore('sync-pdfs', {
      keyPath: 'id'
    });
  }
});

const writeData = async (storeName, data) => {
  try {
    const tx = (await dbPromise).transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.add(data);
    await tx.done;
  } catch(error) {
    console.log('[sw writeData] error => ', error);
  }
};

const readAllData = async storeName => {
  const tx = (await dbPromise).transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return store.getAll();
};

const clearAllData = async storeName => {
  try {
    const tx = (await dbPromise).transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    await tx.done;
  } catch(error) {
    console.log('[sw clearAllData] error => ', error);
  }
};

const deleteItemFromData = async (storeName, id) => {
  try {
    const tx = (await dbPromise).transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(parseInt(id, 10));
    await tx.done;
  } catch(error) {
    console.log('[sw deleteItemFromData] error => ', error);
  }
};

self.addEventListener('sync', event => {
  console.log('[sw sync] background syncing event => ', event);
  if (event.tag === 'sync-new-pdfs') {
    console.log('[sw sync] syncing sync-new-pdfs');
    event.waitUntil(
      readAllData('sync-pdfs')
        .then(async data => {
          console.log('[sw sync] sending data => ', data);
          for (const entry of data) {
            try {
              const pdfData = new FormData();
              for (const file of entry.pdfFiles) {
                pdfData.append('file', file);
              }
              const url = `/upload-pdf?id=${entry.id}`;
              const { id: uploadId } = await fetch(url, {
                method: 'POST',
                body: pdfData
              }).then(res => res.json());
              console.log('[sw sync received upload id] uploadId => ', uploadId);
              deleteItemFromData('sync-pdfs', uploadId);
            } catch(error) {
              console.log('[sw sync] error while uploading error => ', error);
            }
          }
        })
    );
  }
});
