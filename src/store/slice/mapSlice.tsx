import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Format {
  [key: string]: string
}
const formatOrder: Format = {
  'latlon-dd': 'latlon-dm',
  'latlon-dm': 'latlon-dms',
  'latlon-dms': 'latlon-dd',
};
const d = new Date()
export interface inputstate {
  active: boolean
  inputLat: number
  inputLon: number
  markers: Array<Array<number | null>>//[(number | null)[]]
  latlonformat: string
  datetime: string
}
export const coordInputSlice = createSlice({
  name: "coordInput",
  initialState: {
    active: false,
    inputLat: 23.5,
    inputLon: 121,
    markers: [[null, null]],
    latlonformat: 'latlon-dd',
    datetime: d.toISOString(),
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
    changeDatetime: (state, action: PayloadAction<string>) => {
      state.datetime = action.payload
    }
  },
});
