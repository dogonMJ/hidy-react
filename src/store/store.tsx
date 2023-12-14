import { configureStore } from '@reduxjs/toolkit';
import { coordInputSlice } from "./slice/coordInputSlice";
import { odbCtdSlice } from './slice/odbCtdSlice';
import { odbBioSlice } from './slice/odbBioSlice';
import { odbCurrentSlice } from './slice/odbCurrentSlice';
import { mapSlice } from './slice/mapSlice';
import { onoffsSlice } from './slice/onoffsSlice';
import { odbPlasticSlice } from './slice/odbPlasticSlice';
import { odbChemSlice } from './slice/odbChemSlice';
import { wmsSelectorSlice } from './slice/wmsSelectorSlice';

export const store = configureStore({
  reducer: {
    [mapSlice.name]: mapSlice.reducer,
    [coordInputSlice.name]: coordInputSlice.reducer,
    [odbCtdSlice.name]: odbCtdSlice.reducer,
    [odbCurrentSlice.name]: odbCurrentSlice.reducer,
    [odbBioSlice.name]: odbBioSlice.reducer,
    [onoffsSlice.name]: onoffsSlice.reducer,
    [odbPlasticSlice.name]: odbPlasticSlice.reducer,
    [odbChemSlice.name]: odbChemSlice.reducer,
    [wmsSelectorSlice.name]: wmsSelectorSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch