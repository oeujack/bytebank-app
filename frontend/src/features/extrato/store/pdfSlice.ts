import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PdfState {
  [extratoId: string]: string;
}

const initialState: PdfState = JSON.parse(localStorage.getItem('pdfs') || '{}');

export const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    uploadPdf: (state, action: PayloadAction<{ extratoId: string; pdfData: string }>) => {
      state[action.payload.extratoId] = action.payload.pdfData;
      localStorage.setItem('pdfs', JSON.stringify(state));
    },
    removePdf: (state, action: PayloadAction<{ extratoId: string }>) => {
      delete state[action.payload.extratoId];
      localStorage.setItem('pdfs', JSON.stringify(state));
    },
  },
});

export const { uploadPdf, removePdf } = pdfSlice.actions;
export const pdfReducer = pdfSlice.reducer;
export default pdfSlice.reducer;
