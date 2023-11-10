import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScaleUnitType } from 'types'
import { readUrlQuery, } from "Utils/UtilsStates";
import { unitSwitch } from "Utils/UtilsMap";

const query = readUrlQuery('map')
const d = new Date()
type Lang = 'zh-TW' | 'en'

export interface inputstate {
  datetime: string
  userInfo: { [key: string]: any }
  scaleUnit: ScaleUnitType
  depthMeterValue: any
}
export const mapSlice = createSlice({
  name: "map",
  initialState: {
    datetime: query && query.datetime ? query.datetime : d.toISOString(),
    userInfo: {},
    scaleUnit: 'metric',
    depthMeterValue: {
      'odbCtd': 99,
      'odbCurrent': 49,
      'cmems': 49,
    },
  } as inputstate,
  reducers: {
    setDatetime: (state, action: PayloadAction<string>) => {
      state.datetime = action.payload
    },
    setLang: (state, action: PayloadAction<Lang>) => {
      state.datetime = action.payload
    },
    userInfo: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.userInfo = action.payload
    },
    scaleUnitSwitch: (state, action: PayloadAction<ScaleUnitType>) => {
      state.scaleUnit = unitSwitch[action.payload]
    },
    DepthMeterValue: (state, action: PayloadAction<[string, number]>) => {
      const user = action.payload[0]
      const value = action.payload[1]
      state.depthMeterValue[user] = value
    },
  }
});
