import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Palette } from 'types'

interface OdbCtdStates {
  selection: string
  profileSecondPar: string
  palette: Palette
  mask: boolean
  reverse: boolean
  interval: number
  min: number
  max: number
  opacity: number
}
export const odbCtdSlice = createSlice({
  name: "odbCtdStates",
  initialState: {
    selection: 'temperature',
    profileSecondPar: 'salinity',
    palette: 'plasma',
    mask: false,
    reverse: false,
    interval: 20,
    min: 0,
    max: 30,
    opacity: 100,
  } as OdbCtdStates,
  reducers: {
    Selection: (state, action: PayloadAction<string>) => {
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
    Interval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload
    },
    Min: (state, action: PayloadAction<number>) => {
      state.min = action.payload
    },
    Max: (state, action: PayloadAction<number>) => {
      state.max = action.payload
    },
    Opacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload
    },
  }
});
