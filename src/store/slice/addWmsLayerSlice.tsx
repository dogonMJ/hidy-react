import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { ServiceType, isServiceType } from "types";

const query: any = readUrlQuery('addWmsLayer')
interface AddWmsLayerStates {
  serviceType: ServiceType
  url: string
  opacity: number
  layerName: string
  layerList: any[]
}
const initList = (queryObject: any, par: string) => {
  if (queryObject && queryObject[par]) {
    return JSON.parse(queryObject[par])
  } else {
    return []
  }
}
export const addWmsLayerSlice = createSlice({
  name: "addWmsLayer",
  initialState: {
    serviceType: initString(query, 'serviceType', 'WMTS', isServiceType),
    url: initString(query, 'url', '').replaceAll('%26', '&'),
    opacity: initNumber(query, 'opacity', 100),
    layerName: initString(query, 'layerName', 'layer 1'),
    layerList: initList(query, 'layerList'),
  } as AddWmsLayerStates,
  reducers: {
    setServiceType: (state, action: PayloadAction<ServiceType>) => {
      state.serviceType = action.payload
    },
    setWmsUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload.replace(/&/g, '%26')
    },
    setWmsOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
    setLayerName: (state, action: PayloadAction<string>) => {
      state.layerName = action.payload
    },
    setLayerList: (state, action: PayloadAction<any>) => {
      const result = action.payload.map((obj: any) => {
        const mutableObj = { ...obj };
        mutableObj.url = mutableObj.url.replace(/&/g, '%26') //需要以%26取代&避免讀網址時出錯
        return mutableObj
      })
      state.layerList = result
    },
  }
});
