import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initBoolean, initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { CWAArrowColor, iscwaArrowColors } from "types";
const query: any = readUrlQuery('cwaForecastDir')

interface CWADirStates {
  arrow: CWAArrowColor
  scale: boolean
  level: number
}

export const cwaForecastDirSlice = createSlice({
  name: "cwaForecastDir",
  initialState: {
    arrow: initString(query, 'arrow', 'grey', iscwaArrowColors),
    scale: initBoolean(query, 'scale'),
    level: initNumber(query, 'level', 2)
  } as CWADirStates,
  reducers: {
    setArrow: (state, action: PayloadAction<CWAArrowColor>) => {
      state.arrow = action.payload
    },
    setScale: (state, action: PayloadAction<boolean>) => {
      state.scale = action.payload
    },
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload
    },
  }
});