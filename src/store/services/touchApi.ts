// src/store/services/touchApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { EventosDestacadosApiResponse, Evento, Colectivo, ColectivosApiResponse, HotelesApiResponse, Hotel, HotelesQueryArgs, HotelesFilterResponse, CategoriaHotel, PrestadorApiResponse, PrestadorQueryArgs, Prestador, ActividadesResponse, RestaurantesApiResponse, RestaurantesQueryArgs, Restaurante, LocalidadResponse } from '@/types/api';

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
    getPrestador: builder.query<PrestadorApiResponse, PrestadorQueryArgs>({
      query: ({
        search,
        offset,
        limit
      }) => ({
        url: 'prestadores',
        params: { offset, limit, busqueda: search}
      }),
      transformResponse: (response: { result: Prestador[] }) => {
        return {
          status: 200,
          result: response.result,
          total: response.result.length ? parseInt(response.result[0].total) : 0
        };
      },
    }),
    getRestaurantes: builder.query<RestaurantesApiResponse, RestaurantesQueryArgs>({
      query: ({
        localidad,
        categoria,
        offset,
        limit
      }) => ({
        url: 'restaurantes',
        params: { offset, limit, localidad,categoria}
      })
    }),
    getLocalidades: builder.query<LocalidadResponse, void>({
      query: () => 'localidades',
    }),
    getHotelesFilters: builder.query<HotelesFilterResponse, void>({
      query: () => 'alojamientos_filters',
    }),
    getActividades: builder.query<ActividadesResponse, void>({
      query: () => 'actividades',
    }),
  }),
});

export const {
  useGetEventosDestacadosQuery,
  useGetColectivosQuery,
  useGetHotelesQuery,
  useGetHotelesFiltersQuery,
  useGetPrestadorQuery,
  useGetActividadesQuery,
  useGetLocalidadesQuery,
  useGetRestaurantesQuery
} = touchApi;