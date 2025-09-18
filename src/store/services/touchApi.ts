// src/store/services/touchApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { EventosDestacadosApiResponse, Evento, Colectivo, ColectivosApiResponse, HotelesApiResponse, Hotel, HotelesQueryArgs, HotelesFilterResponse, CategoriaHotel } from '@/types/api';

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
    getColectivos: builder.query<ColectivosApiResponse, void>({
      query: () => 'colectivos',
      transformResponse: (response: { result: Colectivo[] }) => {
        return {
          status: 200,
          result: response.result,
        };
      },
    }),
    getHoteles: builder.query<HotelesApiResponse, HotelesQueryArgs>({
      query: ({
        search,
        categoria,
        estrellas,
        localidad,
        offset,
        limit
      }) => ({
        url: 'hoteles',
        params: { search, categoria, estrellas, localidad, offset, limit }
      }),
      transformResponse: (response: { result: Hotel[] }) => {
        return {
          status: 200,
          result: response.result,
          total: response.result.length ? parseInt(response.result[0].total) : 0
        };
      },
    }),
    getHotelesFilters: builder.query<HotelesFilterResponse, void>({

      query: () => 'alojamientos_filters',
    }),
  }),
});

export const { useGetEventosDestacadosQuery, useGetColectivosQuery, useGetHotelesQuery, useGetHotelesFiltersQuery } = touchApi;