import { configureStore } from '@reduxjs/toolkit';
import { coordInputSlice } from "./slice/coordInputSlice";
import { odbCtdSlice } from './slice/odbCtdSlice';
import { odbBioSlice } from './slice/odbBioSlice';
import { odbCurrentSlice } from './slice/odbCurrentSlice';
import { mapSlice } from './slice/mapSlice';
import { onoffsSlice } from './slice/onoffsSlice';
import { odbPlasticSlice } from './slice/odbPlasticSlice';
import { odbChemSlice } from './slice/odbChemSlice';
import { layerSelectorSlice } from './slice/layerSelectorSlice';
import { addWmsLayerSlice } from './slice/addWmsLayerSlice';
import { addImageSlice } from './slice/addImageSlice';
import { cplanSlice } from './slice/cplanSlice';
import { longtermSlice } from './slice/longtermSlice';

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
    [layerSelectorSlice.name]: layerSelectorSlice.reducer,
    [addWmsLayerSlice.name]: addWmsLayerSlice.reducer,
    [addImageSlice.name]: addImageSlice.reducer,
    [cplanSlice.name]: cplanSlice.reducer,
    [longtermSlice.name]: longtermSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch