import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { LatLngTuple } from "leaflet";

const query: any = readUrlQuery('addImage')

interface AddImageStates {
  url: string
  bbox: LatLngTuple[] | undefined
  opacity: number
  layerList: any[]
  layerName: string
}

const initList = (queryObject: any, par: string) => {
  if (queryObject && queryObject[par]) {
    return JSON.parse(queryObject[par])
  } else {
    return []
  }
}

export const addImageSlice = createSlice({
  name: "addImage",
  initialState: {
    url: initString(query, 'url', ''),
    bbox: initList(query, 'bbox'),
    opacity: initNumber(query, 'opacity', 100),
    layerList: initList(query, 'layerList'),
    layerName: initString(query, 'layerName', 'image 1')
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
    setLayerList: (state, action: PayloadAction<any>) => {
      state.layerList = action.payload
    },
    setLayerName: (state, action: PayloadAction<string>) => {
      state.layerName = action.payload
    },
  }
});
