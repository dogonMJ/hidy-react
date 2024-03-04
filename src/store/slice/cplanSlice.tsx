import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initStringArray, readUrlQuery } from "Utils/UtilsStates";

const query: any = readUrlQuery('cplan')

interface CplanStates {
  ckeys: string[]
}

export const cplanSlice = createSlice({
  name: "cplan",
  initialState: {
    ckeys: initStringArray(query, 'ckeys', [])
  } as CplanStates,
  reducers: {
    setCkeys: (state, action: PayloadAction<string[]>) => {
      state.ckeys = action.payload
    },
  }
});
