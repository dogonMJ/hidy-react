import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CtdParameters, Palette, isCtdParameter, isPalette } from 'types'
import { defaultCtdRange } from "Utils/UtilsODB";
import { readUrlQuery } from "Utils/UtilsMap";

const query = readUrlQuery('odbCtd')

interface OdbCtdStates {
  selection: CtdParameters
  profileSecondPar: string
  palette: Palette
  mask: boolean
  reverse: boolean
  fixRange: boolean
  interval: number
  opacity: number
  range: { [key: string]: { min: number, max: number } }
}
export const odbCtdSlice = createSlice({
  name: "odbCtdStates",
  initialState: {
    selection: query && query.par && isCtdParameter(query.par) ? query.par : 'temperature',
    profileSecondPar: query && query.par2 && isCtdParameter(query.par2) ? query.par2 : 'salinity',
    palette: query && query.p && isPalette(query.p) ? query.p : 'plasma',
    mask: query && query.m === 'true' ? true : false,
    reverse: query && query.r === 'true' ? true : false,
    fixRange: query && query.f === 'true' ? true : false,
    interval: query && Number(query.i) >= 0 && Number(query.i) <= 30 ? Number(query.i) : 20,
    opacity: query && query.o ? Number(query.o) : 100,
    range: defaultCtdRange,
  } as OdbCtdStates,
  reducers: {
    Selection: (state, action: PayloadAction<CtdParameters>) => {
      state.selection = action.payload
    },
    ProfileSecondPar: (state, action: PayloadAction<string>) => {
      state.profileSecondPar = action.payload
    },
    Palette: (state, action: PayloadAction<Palette>) => {
      state.palette = action.payload
    },
    Mask: (state, action: PayloadAction<boolean>) => {
      state.mask = action.payload
    },
    Reverse: (state, action: PayloadAction<boolean>) => {
      state.reverse = action.payload
    },
    FixRange: (state, action: PayloadAction<boolean>) => {
      state.fixRange = action.payload
    },
    Interval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload
    },
    Opacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
    Range: (state, action: PayloadAction<{ par: string, min?: number, max?: number }>) => {
      if (action.payload.min || action.payload.min === 0) {
        state.range[action.payload.par].min = action.payload.min
      }
      if (action.payload.max || action.payload.max === 0) {
        state.range[action.payload.par].max = action.payload.max
      }
    }
  }
});
