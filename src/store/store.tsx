import { configureStore } from '@reduxjs/toolkit';
import { coordInputSlice } from "./slice/mapSlice";

export const store = configureStore({
  reducer: {
    [coordInputSlice.name]: coordInputSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch