import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initString, readUrlQuery } from "Utils/UtilsStates";
import { CtdPeriods, isCtdPeriod } from "types";

const query: any = readUrlQuery('odbCur')

interface OdbCurStates {
  period: CtdPeriods
}

export const odbCurrentSlice = createSlice({
  name: "odbCur",
  initialState: {
    period: initString(query, 'period', 'avg', isCtdPeriod),
  } as OdbCurStates,
  reducers: {
    setPeriod: (state, action: PayloadAction<CtdPeriods>) => {
      state.period = action.payload
    },
  }
});
