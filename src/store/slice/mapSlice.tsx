import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isLatLonFormat, isScaleUnit, LatLonFormat, ScaleUnit } from 'types'
import { initString, readUrlQuery, } from "Utils/UtilsStates";
import { unitSwitch, formatSwitch } from "Utils/UtilsMap";
//depthMeterValue不加入share網址列。新state要加入share網址需在share function內手動新增。

const query = readUrlQuery('map')
const queryCur = readUrlQuery('odbCur')
const queryCtd = readUrlQuery('odbCtd')
const d = new Date()

export interface MapStates {
  userInfo: { [key: string]: any }
  datetime: string
  scaleUnit: ScaleUnit
  baseLayer: string | undefined
  latlonformat: LatLonFormat
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
    baseLayer: initString(query, 'baseLayer', 'bingmap'),
    latlonformat: initString(query, 'latlonformat', 'dd', isLatLonFormat),
    wmsDepthIndex: 49, //only for share function
    depthMeterValue: {
      //本區塊實際深度值state。key值修改需對應DepthMeterSlider內之switch
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
    switchScaleUnit: (state, action: PayloadAction<ScaleUnit>) => {
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
    switchFormat: (state, action: PayloadAction<LatLonFormat>) => {
      state.latlonformat = formatSwitch[action.payload]
    },
    setWmsDepthIndex: (state, action: PayloadAction<number>) => {
      //only for share function
      state.wmsDepthIndex = action.payload
    },
  }
});
