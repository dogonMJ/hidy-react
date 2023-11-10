import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CtdParameters, Palette, isCtdParameter, isPalette } from 'types'
import { defaultCtdRange } from "Utils/UtilsODB";
import { readUrlQuery } from "Utils/UtilsStates";

const query: any = readUrlQuery('odbCtd')

interface OdbCtdStates {
  par: CtdParameters
  pX2: CtdParameters | 'close'
  pY: CtdParameters | 'depth'
  period: string
  palette: Palette
  mask: boolean
  reverse: boolean
  fix: boolean
  interval: number
  opacity: number
  range: { [key: string]: { min: number, max: number } }
}

export const odbCtdSlice = createSlice({
  name: "odbCtd",
  initialState: {
    par: query && query.par && isCtdParameter(query.par) ? query.par : 'temperature',
    pX2: query && query.pX2 && isCtdParameter(query.pX2) ? query.pX2 : 'salinity',
    pY: query && query.pY && isCtdParameter(query.pY) ? query.pY : 'depth',
    period: query && query.period ? query.period : 'avg',
    palette: query && query.palette && isPalette(query.palette) ? query.palette : 'plasma',
    mask: query && query.mask === 'true' ? true : false,
    reverse: query && query.reverse === 'true' ? true : false,
    fix: query && query.fixRange === 'true' ? true : false,
    interval: query && Number(query.interval) >= 0 && Number(query.interval) <= 30 ? Number(query.interval) : 20,
    opacity: query && query.opacity ? Number(query.opacity) : 100,
    range: defaultCtdRange,
  } as OdbCtdStates,
  reducers: {
    setSelection: (state, action: PayloadAction<CtdParameters>) => {
      state.par = action.payload
    },
    setPeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload
    },
    setProfileX2Par: (state, action: PayloadAction<CtdParameters | 'close'>) => {
      state.pX2 = action.payload
    },
    setProfileYPar: (state, action: PayloadAction<CtdParameters | 'depth'>) => {
      state.pY = action.payload
    },
    setPalette: (state, action: PayloadAction<Palette>) => {
      state.palette = action.payload
    },
    setMask: (state, action: PayloadAction<boolean>) => {
      state.mask = action.payload
    },
    setReverse: (state, action: PayloadAction<boolean>) => {
      state.reverse = action.payload
    },
    setFixRange: (state, action: PayloadAction<boolean>) => {
      state.fix = action.payload
    },
    setInterval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload
    },
    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
    setRange: (state, action: PayloadAction<{ par: string, min?: number, max?: number }>) => {
      if (action.payload.min || action.payload.min === 0) {
        state.range[action.payload.par].min = action.payload.min
      }
      if (action.payload.max || action.payload.max === 0) {
        state.range[action.payload.par].max = action.payload.max
      }
    }
  }
});
