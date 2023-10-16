import { configureStore } from '@reduxjs/toolkit';
import { coordInputSlice } from "./slice/coordInputSlice";
import { odbCtdSlice } from './slice/odbCtdSlice';
import { odbBioSlice } from './slice/odbBioSlice';
import { mapSlice } from './slice/mapSlice';

export const store = configureStore({
  reducer: {
    [mapSlice.name]: mapSlice.reducer,
    [coordInputSlice.name]: coordInputSlice.reducer,
    [odbCtdSlice.name]: odbCtdSlice.reducer,
    [odbBioSlice.name]: odbBioSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch