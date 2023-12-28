import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isScaleUnit, ScaleUnit } from 'types'
import { initString, readUrlQuery, } from "Utils/UtilsStates";
import { unitSwitch } from "Utils/UtilsMap";

const query = readUrlQuery('map')
const queryCur = readUrlQuery('odbCur')
const queryCtd = readUrlQuery('odbCtd')
const d = new Date()

export interface MapStates {
  userInfo: { [key: string]: any }
  datetime: string
  scaleUnit: ScaleUnit
  baseLayer: string | undefined
  wmsDepthIndex: number
  depthMeterValue: any
}

const isDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

export const mapSlice = createSlice({
  name: "map",
  initialState: {
    userInfo: {},
    datetime: initString(query, 'datetime', d.toISOString(), isDate),
    scaleUnit: initString(query, 'scaleUnit', 'metric', isScaleUnit),
    baseLayer: query && query.baseLayer ? query.baseLayer : 'bingmap',
    wmsDepthIndex: 49, //only for share function
    depthMeterValue: {
      'odbCtd': queryCtd && queryCtd.depthIndex ? Number(queryCtd.depthIndex) : 99,
      'odbCurrent': queryCur && queryCur.depthIndex ? Number(queryCur.depthIndex) : 49,
      'cmems': query && query.wmsDepthIndex ? Number(query.wmsDepthIndex) : 49,
    },

  } as MapStates,
  reducers: {
    setDatetime: (state, action: PayloadAction<string>) => {
      state.datetime = action.payload
    },
    userInfo: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.userInfo = action.payload
    },
    scaleUnitSwitch: (state, action: PayloadAction<ScaleUnit>) => {
      state.scaleUnit = unitSwitch[action.payload]
    },
    DepthMeterValue: (state, action: PayloadAction<[string, number]>) => {
      const user = action.payload[0]
      const value = action.payload[1]
      state.depthMeterValue[user] = value
    },
    setBaseLayerId: (state, action: PayloadAction<string | undefined>) => {
      state.baseLayer = action.payload
    },
    setWmsDepthIndex: (state, action: PayloadAction<number>) => {
      //only for share function
      state.wmsDepthIndex = action.payload
    },
  }
});
