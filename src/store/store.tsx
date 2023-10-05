import { configureStore } from '@reduxjs/toolkit';
import { coordInputSlice } from "./slice/mapSlice";
import { odbCtdSlice } from './slice/odbCtdSlice';
import { odbBioSlice } from './slice/odbBioSlice';

export const store = configureStore({
  reducer: {
    [coordInputSlice.name]: coordInputSlice.reducer,
    [odbCtdSlice.name]: odbCtdSlice.reducer,
    [odbBioSlice.name]: odbBioSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch