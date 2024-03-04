import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initString, readUrlQuery } from "Utils/UtilsStates";
import { CtdPeriods, isCtdPeriod } from "types";

const query: any = readUrlQuery('odbCur')

interface OdbCurStates {
  period: CtdPeriods
  depthIndex: number
}

export const odbCurrentSlice = createSlice({
  name: "odbCur",
  initialState: {
    period: initString(query, 'period', 'avg', isCtdPeriod),
    depthIndex: 49, //only for share url and default, does not involve in actual function
  } as OdbCurStates,
  reducers: {
    setPeriod: (state, action: PayloadAction<CtdPeriods>) => {
      state.period = action.payload
    },
    setDepthIndex: (state, action: PayloadAction<number>) => {
      //only for share function
      state.depthIndex = action.payload
    },
  }
});
