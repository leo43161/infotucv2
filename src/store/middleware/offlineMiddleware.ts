import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { saveData, getData, getNameCacheKeyWithArgs } from '@/utils/indexedDB';

export const offlineMiddleware: Middleware = () => (next) => async (action: any) => {
  // Interceptar acciones de RTK Query
  if (action.type?.endsWith('/fulfilled')) {
    // Guardar respuestas exitosas en IndexedDB
    console.log(action.meta?.arg);
    const endName = action.meta?.arg?.endpointName;
    const cacheKey = `${endName}?${getNameCacheKeyWithArgs(action.meta?.arg?.originalArgs || {})}`;
    console.log(cacheKey);
    if (endName) {
      await saveData(cacheKey, action.payload, 6000 * 60 * 60); // 1 hora
    }
  }

  return next(action);
};