import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readUrlQuery } from "Utils/UtilsMap";

const query = readUrlQuery('odbBio')

interface OdbBioStates {
  bioDateRange: string[]
  tabNum: 0 | 1
  compGrid: 1 | 2
}
export const odbBioSlice = createSlice({
  name: "odbBio",
  initialState: {
    bioDateRange: [],
    tabNum: query && query.tabNum ? Number(query.tabNum) : 0,
    compGrid: query && query.grid ? Number(query.grid) : 1,
  } as OdbBioStates,
  reducers: {
    BioDateRange: (state, action: PayloadAction<string[]>) => {
      state.bioDateRange = action.payload
    },
    switchTab: (state) => {
      state.tabNum = state.tabNum === 0 ? 1 : 0
    },
    switchCompGird: (state) => {
      state.compGrid = state.compGrid === 1 ? 2 : 1
    },
  }
});
