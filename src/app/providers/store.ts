import { configureStore } from "@reduxjs/toolkit"
import { extratoFilterReducer } from "@features/extrato/store"
import { pdfReducer } from "@features/extrato/store/pdfSlice"
import { authReducer } from "@features/auth/store"

export const store = configureStore({
  reducer: {
    extratoFilter: extratoFilterReducer,
    pdf: pdfReducer,
    auth: authReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
