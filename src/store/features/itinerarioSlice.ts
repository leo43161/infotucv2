// src/store/features/itinerariosSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { circuitos, circuitosEN, circuitosEN_ES, favoritosStart } from '@/data/circuitos';
import type { ItinerariosState, Circuito } from '@/types/itinerarioState';

// Define el estado inicial con el tipo que creamos
const initialState: { value: ItinerariosState } = {
  value: {
    circuitos,
    circuitosEN,
    circuitosEN_ES,
    circuitoSelected: circuitos[0],
    activeComponent: 'destinos',
    favoritos: favoritosStart,
    total: 0,
    progress: 0,
  }
};

const itinerariosSlice = createSlice({
  name: 'itinerarios',
  initialState,
  reducers: {
    // Usamos PayloadAction para tipar el contenido de la acción
    setActiveComponent: (state, action: PayloadAction<'destinos' | 'alojamientos' | 'prestadores' | 'guias'>) => {
      state.value.activeComponent = action.payload;
    },
    setFavorito: (state, action: PayloadAction<{ type: string; item: any; idCircuito?: number }>) => {

      const { type, item, idCircuito } = action.payload;
      const nameCircuito = idCircuito
        ? [...circuitos, ...circuitosEN].find((c) => c.id === idCircuito)!.name
        : state.value.circuitoSelected.name;

      const favoritosCircuito = state.value.favoritos[nameCircuito] as any;
      const existe = favoritosCircuito[type].find((favorito: any) => favorito.id === item.id);

      if (existe) {
        favoritosCircuito[type] = favoritosCircuito[type].filter((favorito: any) => favorito.id !== item.id);
        state.value.total -= 1;
      } else {
        favoritosCircuito[type].push(item);
        state.value.total += 1;
      }

      const allDestinos = Object.values(state.value.favoritos).flatMap(category => category.destinos || []);
      state.value.progress = (allDestinos.length / 6) * 100;
    },
    setCircuitoSelected: (state, action: PayloadAction<number>) => {
      const selectedCircuit = [...circuitos, ...circuitosEN].find((c) => c.id === action.payload);
      if (selectedCircuit) {
        state.value.circuitoSelected = selectedCircuit;
      }
    },
    setFavReset: (state) => {
      state.value.favoritos = favoritosStart;
      state.value.progress = 0;
      state.value.total = 0;
    },
  },
});

export const { setActiveComponent, setFavorito, setCircuitoSelected, setFavReset } = itinerariosSlice.actions;

// Selector para acceder al estado en los componentes
export const selectItinerarios = (state: RootState) => state.itinerarios.value;

export default itinerariosSlice.reducer;