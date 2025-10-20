const DB_NAME = 'InfoTucDB';
const DB_VERSION = 1;

export interface StoredData {
  key: string;
  data: any;
  timestamp: number;
  expiresIn?: number; // en milisegundos
}

// Abrir/crear la base de datos
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('apiData')) {
        db.createObjectStore('apiData', { keyPath: 'key' });
      }
    };
  });
}

// Guardar datos
export async function saveData(key: string, data: any, expiresIn?: number): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(['apiData'], 'readwrite');
  const store = transaction.objectStore('apiData');

  const storedData: StoredData = {
    key,
    data,
    timestamp: Date.now(),
    expiresIn,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(storedData);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Obtener datos
export async function getData(key: string): Promise<any | null> {
  const db = await openDB();
  const transaction = db.transaction(['apiData'], 'readonly');
  const store = transaction.objectStore('apiData');

  return new Promise((resolve, reject) => {
    const request = store.get(key);
    
    request.onsuccess = () => {
      const result = request.result as StoredData | undefined;
      
      if (!result) {
        resolve(null);
        return;
      }

      // Verificar expiración
      if (result.expiresIn) {
        const isExpired = Date.now() - result.timestamp > result.expiresIn;
        if (isExpired) {
          deleteData(key); // Limpiar datos expirados
          resolve(null);
          return;
        }
      }

      resolve(result.data);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Eliminar datos
export async function deleteData(key: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(['apiData'], 'readwrite');
  const store = transaction.objectStore('apiData');

  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Limpiar toda la base de datos
export async function clearAllData(): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(['apiData'], 'readwrite');
  const store = transaction.objectStore('apiData');

  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function getNameCacheKeyWithArgs(queryArgs: object) : string {
  const keys = Object.keys(queryArgs);
  const values = Object.values(queryArgs);
  return keys.map((key, index) => `${key}=${values[index] || ''}`).join('&');
}