import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { formatOrder } from "Utils/UtilsMap";

export interface inputstate {
  active: boolean
  inputLat: number
  inputLon: number
  markers: Array<Array<number | null>>//[(number | null)[]]
  latlonformat: string
}
export const coordInputSlice = createSlice({
  name: "coordInput",
  initialState: {
    active: false,
    inputLat: 23.5,
    inputLon: 121,
    markers: [[null, null]],
    latlonformat: 'latlon-dd',
  } as inputstate,
  reducers: {
    switchActive: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload
    },
    changeLat: (state, action: PayloadAction<number>) => {
      state.inputLat = action.payload
    },
    changeLon: (state, action: PayloadAction<number>) => {
      state.inputLon = action.payload
    },
    changeMarkers: (state, action: PayloadAction<Array<Array<number | null>>>) => {
      state.markers = action.payload
    },
    switchFormat: (state, action: PayloadAction<string>) => {
      state.latlonformat = formatOrder[action.payload]
    },
  }
});
