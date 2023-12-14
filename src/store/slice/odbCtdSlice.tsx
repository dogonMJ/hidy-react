import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CtdParameters, CtdPeriods, Palette, isCtdParameter, isCtdPeriod, isPalette } from 'types'
import { defaultCtdRange } from "Utils/UtilsODB";
import { initBoolean, initNumber, initString, readUrlQuery } from "Utils/UtilsStates";

const query: any = readUrlQuery('odbCtd')

const initCtdRange = (query: any, defaultCtdRange: any) => {
  if (query && query.range) {
    const modifiedRange = JSON.parse(query.range)
    const mergedObject = { ...defaultCtdRange };
    for (const key in modifiedRange) {
      if (modifiedRange.hasOwnProperty(key) && mergedObject.hasOwnProperty(key)) {
        mergedObject[key] = { ...mergedObject[key], ...modifiedRange[key] };
      }
    }
    return mergedObject
  } else {
    return defaultCtdRange
  }
}

interface OdbCtdStates {
  par: CtdParameters
  pX2: CtdParameters | 'close'
  pY: CtdParameters | 'depth'
  period: CtdPeriods
  palette: Palette
  mask: boolean
  reverse: boolean
  fixRange: boolean
  interval: number
  opacity: number
  range: { [key: string]: { min: number, max: number } }
}

export const odbCtdSlice = createSlice({
  name: "odbCtd",
  initialState: {
    par: initString(query, 'par', 'temperature', isCtdParameter),
    pX2: initString(query, 'pX2', 'salinity', isCtdParameter),
    pY: initString(query, 'pY', 'depth', isCtdParameter),
    period: initString(query, 'period', 'avg', isCtdPeriod),
    palette: initString(query, 'palette', 'plasma', isPalette),
    mask: initBoolean(query, 'mask'),
    reverse: initBoolean(query, 'reverse'),
    fixRange: initBoolean(query, 'fixRange'),
    interval: initNumber(query, 'interval', 20, [0, 30]),
    opacity: initNumber(query, 'opacity', 100),
    range: initCtdRange(query, defaultCtdRange),
  } as OdbCtdStates,
  reducers: {
    setSelection: (state, action: PayloadAction<CtdParameters>) => {
      state.par = action.payload
    },
    setPeriod: (state, action: PayloadAction<CtdPeriods>) => {
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
      state.fixRange = action.payload
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
