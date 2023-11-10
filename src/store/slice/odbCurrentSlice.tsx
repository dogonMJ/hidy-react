import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readUrlQuery } from "Utils/UtilsStates";

const query: any = readUrlQuery('odbCur')

interface OdbCurStates {
  period: string
}

export const odbCurrentSlice = createSlice({
  name: "odbCur",
  initialState: {
    period: query && query.period ? query.period : 'avg',
  } as OdbCurStates,
  reducers: {
    setPeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload
    },
  }
});
