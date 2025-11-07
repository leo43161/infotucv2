// src/store/services/touchApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { EventosDestacadosApiResponse, EventosApiResponse, Evento, Colectivo, ColectivosApiResponse, HotelesApiResponse, Hotel, HotelesQueryArgs, HotelesFilterResponse, CategoriaHotel, PrestadorApiResponse, PrestadorQueryArgs, Prestador, ActividadesResponse, RestaurantesApiResponse, RestaurantesQueryArgs, Restaurante, LocalidadResponse, AgenciasApiResponse, AgenciasQueryArgs, Agencia, AutosApiResponse, AutosQueryArgs, Auto, EventosQueryArgs } from '@/types/api';

export const touchApi = createApi({
  reducerPath: 'touchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.tucumanturismo.gob.ar/api/v1/api/',
  }),
  endpoints: (builder) => ({
    /* EVENTOS */
    getEventos: builder.query<EventosApiResponse, EventosQueryArgs>({

      query: ({
        Dia,
        offset,
        limit
      }) => ({
        url: 'eventos',
        params: { Dia, offset, limit }
      }),

      transformResponse: (response: { result: Evento[], total: number }) => {
        return {
          status: 200,
          result: response.result,
          total: String(response.total)
        };
      },
    }),
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
    /* COLECTIVOS */
    getColectivos: builder.query<ColectivosApiResponse, void>({
      query: () => 'colectivos',
      transformResponse: (response: { result: Colectivo[] }) => {
        return {
          status: 200,
          result: response.result,
        };
      },
    }),
    /* HOTELES */
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
    /* PRESTADORES */
    getPrestador: builder.query<PrestadorApiResponse, PrestadorQueryArgs>({
      query: ({
        search,
        offset,
        limit
      }) => ({
        url: 'prestadores',
        params: { offset, limit, busqueda: search }
      }),
      transformResponse: (response: { result: Prestador[] }) => {
        return {
          status: 200,
          result: response.result,
          total: response.result.length ? parseInt(response.result[0].total) : 0
        };
      },
    }),
    /* RESTAURANTES */
    getRestaurantes: builder.query<RestaurantesApiResponse, RestaurantesQueryArgs>({
      query: ({
        localidad,
        categoria,
        offset,
        limit
      }) => ({
        url: 'restaurantes',
        params: { offset, limit, localidad, categoria }
      })
    }),
    /* AGENCIAS */
    getAgencias: builder.query<AgenciasApiResponse, AgenciasQueryArgs>({
      query: ({
        offset,
        limit
      }) => ({
        url: 'agencias',
        params: { offset, limit }
      }),
      transformResponse: (response: { result: Agencia[] }) => {
        return {
          status: 200,
          result: response.result,
          total: response.result.length > 0 ? parseInt(response.result[0].total) : 0
        };
      },
    }),
    /* AUTOS */
    getAutos: builder.query<AutosApiResponse, AutosQueryArgs>({
      query: ({
        offset,
        limit
      }) => ({
        url: 'autos',
        params: { offset, limit }
      }),

      transformResponse: (response: { result: Auto[] }) => {
        return {
          status: 200,
          result: response.result,
          total: response.result.length > 0 ? parseInt(response.result[0].total) : 0
        };
      },
    }),
    /* FILTROS */
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
  useGetEventosQuery,
  useGetEventosDestacadosQuery,
  useGetColectivosQuery,
  useGetHotelesQuery,
  useGetHotelesFiltersQuery,
  useGetPrestadorQuery,
  useGetActividadesQuery,
  useGetLocalidadesQuery,
  useGetRestaurantesQuery,
  useGetAgenciasQuery,
  useGetAutosQuery
} = touchApi;