import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readUrlQuery } from "Utils/UtilsStates";

const query: any = readUrlQuery('odbMP')

interface OdbMPStates {
  dataset: string
}

export const odbCurrentSlice = createSlice({
  name: "odbMP",
  initialState: {
    dataset: query && (query.dataset ?? 'all'),
  } as OdbMPStates,
  reducers: {
    setPeriod: (state, action: PayloadAction<string>) => {
      state.dataset = action.payload
    },
  }
});
