import { openDB } from 'idb';

export const dbPromise = openDB('holdem6', 1, {
  upgrade(db) {
    db.createObjectStore('settings');
    db.createObjectStore('sessions');
  }
});

export async function saveSetting(key: string, value: unknown) {
  const db = await dbPromise;
  return db.put('settings', value, key);
}

export async function getSetting<T>(key: string) {
  const db = await dbPromise;
  return db.get('settings', key) as Promise<T | undefined>;
}