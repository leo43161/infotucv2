// src/store/services/itinerarioApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    DestinosApiResponse,
    LocalidadesApiResponse,
    DestinoGaleyApiResponse,
    Destino,
    ImagenDestino,
    Subseccion,
    Localidad,
    DestinosQueryArgs,
    LocalidadesQueryArgs,
    DestinoGaleryQueryArgs
} from '@/types/itinerario';

export const itinerarioApi = createApi({
    reducerPath: 'itinerarioApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://www.tucumanturismo.gob.ar/api/v1/api/',
    }),
    endpoints: (builder) => ({
        getDestinos: builder.query<DestinosApiResponse, DestinosQueryArgs>({
            query: ({ id }) => 'subseccion/' + id,
            transformResponse: (response: { result: { articulos: Destino[], subseccion: Subseccion } }) => {
                return {
                    status: 200,
                    result: response.result,
                    total: String(response.result.articulos.length)
                };
            },
        }),
        getGaleryDestino: builder.query<DestinoGaleyApiResponse, DestinoGaleryQueryArgs>({
            query: ({ id }) => ({
                url: `galeria_art/${id}`,
            }),
            transformResponse: (response: { result: ImagenDestino[] }) => {
                return {
                    status: 200,
                    result: response.result,
                };
            },
        }),
        getLocalidades: builder.query<LocalidadesApiResponse, LocalidadesQueryArgs>({
            query: ({ idioma }) => ({
                url: 'subseccion_circuito_all',
                params: { idioma }
            }),
            transformResponse: (response: { result: Localidad[] }) => {
                return {
                    status: 200,
                    result: response.result,
                    total: String(response.result.length)
                };
            },
        }),
    }),
});

export const { useGetDestinosQuery, useGetLocalidadesQuery, useGetGaleryDestinoQuery } = itinerarioApi;