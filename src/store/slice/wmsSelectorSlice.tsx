import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initString, readUrlQuery } from "Utils/UtilsStates";
import { ServiceType, isServiceType } from "types";

const query: any = readUrlQuery('selector')

interface WmsSelectorStates {
  urlOptions: { value: string, label: string }[]
  selectedUrl: string
  serviceType: ServiceType
}

export const wmsSelectorSlice = createSlice({
  name: "wmsSelector",
  initialState: {
    urlOptions: query && query.urlOptions ? query.urlOptions : [],
    selectedUrl: query && query.selectedUrl ? query.selectedUrl : '',
    serviceType: initString(query, 'serviceType', 'WMTS', isServiceType),
  } as WmsSelectorStates,
  reducers: {
    setUrlOptions: (state, action: PayloadAction<{ value: string, label: string }[]>) => {
      state.urlOptions = action.payload
    },
    setSelectedUrl: (state, action: PayloadAction<string>) => {
      state.selectedUrl = action.payload
    },
    setServiceType: (state, action: PayloadAction<ServiceType>) => {
      state.serviceType = action.payload
    },
  }
});
