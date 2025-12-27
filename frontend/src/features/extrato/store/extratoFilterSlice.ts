import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FiltroData = 'hoje' | 'ontem' | 'ultimos7dias' | 'todos';

interface ExtratoFilterState {
  filtroData: FiltroData;
  filtroBusca: string;
}

const initialState: ExtratoFilterState = {
  filtroData: 'todos',
  filtroBusca: '',
};

export const extratoFilterSlice = createSlice({
  name: 'extratoFilter',
  initialState,
  reducers: {
    setFiltroData: (state, action: PayloadAction<FiltroData>) => {
      state.filtroData = action.payload;
    },
    setFiltroBusca: (state, action: PayloadAction<string>) => {
      state.filtroBusca = action.payload;
    },
  },
});

export const { setFiltroData, setFiltroBusca } = extratoFilterSlice.actions;
export default extratoFilterSlice.reducer;
