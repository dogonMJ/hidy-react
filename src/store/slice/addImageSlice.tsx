import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { LatLngTuple } from "leaflet";


const query: any = readUrlQuery('addImage')
interface AddImageStates {
  url: string
  bbox: LatLngTuple[] | undefined
  opacity: number
}

const initBbox = (queryObject: any, par: string) => {
  if (queryObject && queryObject[par]) {
    return JSON.parse(queryObject[par])
  } else {
    return undefined
  }
}

export const addImageSlice = createSlice({
  name: "addImage",
  initialState: {
    url: initString(query, 'url', ''),
    bbox: initBbox(query, 'bbox'),
    opacity: initNumber(query, 'opacity', 100),
  } as AddImageStates,
  reducers: {
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload
    },
    setBbox: (state, action: PayloadAction<LatLngTuple[] | undefined>) => {
      state.bbox = action.payload
    },
    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
  }
});
