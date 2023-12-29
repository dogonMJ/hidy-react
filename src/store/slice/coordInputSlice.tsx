import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readUrlQuery, str2List } from "Utils/UtilsStates";
import { LatLngTuple } from "leaflet";

const query: any = readUrlQuery('coordInput')

export interface inputState {
  current: LatLngTuple
  markers: number[][]//Array<Array<number | null>>
}

export const coordInputSlice = createSlice({
  name: "coordInput",
  initialState: {
    current: query && query.current && str2List(query.current).every((str) => !isNaN(Number(str))) ? str2List(query.current).map(Number) : [23.5, 121],
    markers: query && query.markers ? JSON.parse(query.markers) : [],
  } as inputState,
  reducers: {
    setCurrent: (state, action: PayloadAction<LatLngTuple>) => {
      state.current = action.payload
    },
    setMarkers: (state, action: PayloadAction<number[][]>) => {
      state.markers = action.payload
    },
  }
});
