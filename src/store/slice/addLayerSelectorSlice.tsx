import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initBoolean, initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { ServiceType, isServiceType } from "types";

const query: any = readUrlQuery('addLayerSelector')

interface LayerSelectorStates {
  selectedUrl: string
  serviceType: ServiceType
  keyword: string
  showLayer: boolean
  selectedLayer: string
  opacity: number
}

export const addLayerSelectorSlice = createSlice({
  name: "addLayerSelector",
  initialState: {
    selectedUrl: initString(query, 'selectedUrl', ''),
    serviceType: initString(query, 'serviceType', 'WMTS', isServiceType),
    keyword: initString(query, 'keyword', '*'),
    showLayer: initBoolean(query, 'showLayer'),
    selectedLayer: initString(query, 'selectedLayer', ''),
    opacity: initNumber(query, 'opacity', 100),
  } as LayerSelectorStates,
  reducers: {
    setSelectedUrl: (state, action: PayloadAction<string>) => {
      state.selectedUrl = action.payload
    },
    setServiceType: (state, action: PayloadAction<ServiceType>) => {
      state.serviceType = action.payload
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload
    },
    setShowLayer: (state, action: PayloadAction<boolean>) => {
      state.showLayer = action.payload
    },
    setSelectedLayer: (state, action: PayloadAction<string>) => {
      state.selectedLayer = action.payload
    },
    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
  }
});
