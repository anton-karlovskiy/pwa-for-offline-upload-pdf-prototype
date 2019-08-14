
import { openDB } from 'idb';

import { SYNC_PDFS, PDFS_STORE } from './constants';

const dbPromise = openDB(PDFS_STORE, 1, {
  upgrade(db) {
    db.createObjectStore(SYNC_PDFS, {
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
    console.log('[idb writeData] error => ', error);
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
    console.log('[idb clearAllData] error => ', error);
  }
};

const deleteItemFromData = async (storeName, id) => {
  try {
    const tx = (await dbPromise).transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(parseInt(id, 10));
    await tx.done;
  } catch(error) {
    console.log('[idb deleteItemFromData] error => ', error);
  }
};

export {
  writeData,
  readAllData,
  clearAllData,
  deleteItemFromData
};
