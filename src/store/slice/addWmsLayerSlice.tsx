import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initBoolean, initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { ServiceType, isServiceType } from "types";

const query: any = readUrlQuery('addWmsLayer')

interface AddWmsLayerStates {
  serviceType: ServiceType
  url: string
  opacity: number
  showLayer: boolean
}

export const addWmsLayerSlice = createSlice({
  name: "addWmsLayer",
  initialState: {
    serviceType: initString(query, 'serviceType', 'WMTS', isServiceType),
    url: initString(query, 'url', ''),
    opacity: initNumber(query, 'opacity', 100),
    showLayer: initBoolean(query, 'showLayer'),
  } as AddWmsLayerStates,
  reducers: {
    setServiceType: (state, action: PayloadAction<ServiceType>) => {
      state.serviceType = action.payload
    },
    setWmsUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload
    },
    setWmsOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
    setWmsShowLayer: (state, action: PayloadAction<boolean>) => {
      state.showLayer = action.payload
    },
  }
});
