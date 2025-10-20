import { useEffect, useState } from 'react';
import { getData, saveData } from '@/utils/indexedDB';

export function useOfflineQuery<T>(
  queryHook: any,
  queryArgs: any,
  cacheKey: string,
  options?: object
) {
  const [offlineData, setOfflineData] = useState<T | null>(null);
  const [isLoadingOffline, setIsLoadingOffline] = useState(true);

  const { data, isLoading, isFetching, isError, error } = queryHook(queryArgs, options);

  // 1. Cargar datos de IndexedDB al montar
  useEffect(() => {

    async function loadOfflineData() {
      const cached = await getData(cacheKey);
      if (cached) {
        console.log('Cargando datos de IndexedDB... ' + cacheKey);
        setOfflineData(cached);
      }
      setIsLoadingOffline(false);
    }
    loadOfflineData();
  }, [cacheKey]);

  // 2. Actualizar IndexedDB cuando lleguen datos frescos
  useEffect(() => {
    if (data) {
      saveData(cacheKey, data, 5000 * 60 * 60); // 1 hora
      setOfflineData(data);
    }
  }, [data, cacheKey]);

  return {
    data: offlineData || data,
    isLoading: isLoadingOffline || isLoading,
    isFetching,
    isError,
    error
  };
}