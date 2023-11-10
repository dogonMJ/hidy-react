import { configureStore } from '@reduxjs/toolkit';
import { coordInputSlice } from "./slice/coordInputSlice";
import { odbCtdSlice } from './slice/odbCtdSlice';
import { odbBioSlice } from './slice/odbBioSlice';
import { odbCurrentSlice } from './slice/odbCurrentSlice';
import { mapSlice } from './slice/mapSlice';
import { onoffsSlice } from './slice/onoffsSlice';

export const store = configureStore({
  reducer: {
    [mapSlice.name]: mapSlice.reducer,
    [coordInputSlice.name]: coordInputSlice.reducer,
    [odbCtdSlice.name]: odbCtdSlice.reducer,
    [odbCurrentSlice.name]: odbCurrentSlice.reducer,
    [odbBioSlice.name]: odbBioSlice.reducer,
    [onoffsSlice.name]: onoffsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch