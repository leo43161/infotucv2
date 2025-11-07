// src/store/features/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

// Definimos el estado inicial
interface UiState {
  isWaykiOpenLayout: boolean;
  isWaykiOpenItinerario: boolean;
}

const initialState: UiState = {
  isWaykiOpenLayout: false,
  isWaykiOpenItinerario: false,
};

// Creamos el slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  // Reducers: son las "acciones" que modifican el estado
  reducers: {
    openWaykiLayout: (state) => {
      state.isWaykiOpenLayout = true;
    },
    closeWaykiLayout: (state) => {
      state.isWaykiOpenLayout = false;
    },
    openWaykiItinerario: (state) => {
      state.isWaykiOpenItinerario = true;
    },
    closeWaykiItinerario: (state) => {
      state.isWaykiOpenItinerario = false;
    },
  },
});

// Exportamos las acciones para usarlas en los componentes
export const {
  openWaykiLayout,
  closeWaykiLayout,
  openWaykiItinerario,
  closeWaykiItinerario
} = uiSlice.actions;

// Exportamos el reducer para el store
export default uiSlice.reducer;