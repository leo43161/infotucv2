// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { touchApi } from './services/touchApi';

export const store = configureStore({
  reducer: {
    [touchApi.reducerPath]: touchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(touchApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;