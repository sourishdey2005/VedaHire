const DB_NAME = 'VedaHireDB';
const DB_VERSION = 1;
const STORE_NAME = 'user-data';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // Check if running in a browser environment
    if (typeof window === 'undefined' || !window.indexedDB) {
      // If not in a browser or IndexedDB is not supported, reject the promise.
      // This prevents errors during server-side rendering (SSR) in Next.js.
      console.warn('IndexedDB is not available in this environment.');
      // Resolve with null or a mock object if you want the app to continue without DB functionality.
      // Here, we reject to make it clear that the DB is unavailable.
      return reject('IndexedDB not supported');
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Stores a value in the IndexedDB.
 * @param key The key to store the value under.
 * @param value The value to store.
 */
export async function set(key: string, value: any): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to write to IndexedDB:', error);
  }
}

/**
 * Retrieves a value from the IndexedDB.
 * @param key The key of the value to retrieve.
 * @returns The stored value, or undefined if not found.
 */
export async function get<T>(key: string): Promise<T | undefined> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to read from IndexedDB:', error);
    return undefined;
  }
}

/**
 * Deletes a value from the IndexedDB.
 * @param key The key of the value to delete.
 */
export async function del(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to delete from IndexedDB:', error);
  }
}
