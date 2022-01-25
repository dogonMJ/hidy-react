import { configureStore } from '@reduxjs/toolkit';
import { inputActiveSlice } from "./slice/mapSlice";

export const store = configureStore({
  reducer: {
    [inputActiveSlice.name]: inputActiveSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch