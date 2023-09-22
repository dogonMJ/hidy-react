import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScaleUnitType } from 'types'
import { unitSwitch, formatOrder } from "Utils/UtilsMap";

const d = new Date()

export interface inputstate {
  active: boolean
  inputLat: number
  inputLon: number
  markers: Array<Array<number | null>>//[(number | null)[]]
  latlonformat: string
  datetime: string
  animateIdent: string
  // depthMeterValue: number
  // elevations: number[]
  OdbSeasonSelection: string
  userInfo: { [key: string]: any }
  scaleUnit: ScaleUnitType
  enterPanel: boolean
  depthMeterValue: any
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
    animateIdent: "close",
    OdbSeasonSelection: 'avg',
    userInfo: {},
    scaleUnit: 'metric',
    enterPanel: false,
    depthMeterValue: {
      'odbCtd': 99,
      'odbCurrent': 49,
      'cmems': 49,
    },
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
    },
    animateIdentifier: (state, action: PayloadAction<string>) => {
      state.animateIdent = action.payload
    },
    OdbSeasonSelection: (state, action: PayloadAction<string>) => {
      state.OdbSeasonSelection = action.payload
    },
    userInfo: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.userInfo = action.payload
    },
    scaleUnitSwitch: (state, action: PayloadAction<ScaleUnitType>) => {
      state.scaleUnit = unitSwitch[action.payload]
    },
    enterPanel: (state, action: PayloadAction<boolean>) => {
      state.enterPanel = action.payload
    },
    DepthMeterValue: (state, action: PayloadAction<[string, number]>) => {
      const user = action.payload[0]
      const value = action.payload[1]
      state.depthMeterValue[user] = value
    },
  }
});
