// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { touchApi } from './services/touchApi';
import { itinerarioApi } from './services/itinerarioApi';
import itinerariosReducer from './features/itinerarioSlice';

export const store = configureStore({
  reducer: {
    [touchApi.reducerPath]: touchApi.reducer,
    [itinerarioApi.reducerPath]: itinerarioApi.reducer,
    itinerarios: itinerariosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(touchApi.middleware, itinerarioApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;