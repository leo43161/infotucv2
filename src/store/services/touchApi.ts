// src/store/services/touchApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { EventosDestacadosApiResponse, Evento } from '@/types/api';

export const touchApi = createApi({
  reducerPath: 'touchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.tucumanturismo.gob.ar/api/v1/api/',
  }),
  endpoints: (builder) => ({
    getEventosDestacados: builder.query<EventosDestacadosApiResponse, void>({
      query: () => 'eventos_destacados',
      transformResponse: (response: { result: Evento[] }) => {
        return {
          status: 200,
          result: response.result,
          total: String(response.result.length)
        };
      },
    }),
  }),
});

export const { useGetEventosDestacadosQuery } = touchApi;