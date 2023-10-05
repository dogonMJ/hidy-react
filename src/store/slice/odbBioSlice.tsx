import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readUrlQuery } from "Utils/UtilsMap";

const query = readUrlQuery('odbBio')

interface OdbBioStates {
  bioDateRange: string[]
}
export const odbBioSlice = createSlice({
  name: "odbBioStates",
  initialState: {
    bioDateRange: [],
  } as OdbBioStates,
  reducers: {
    BioDateRange: (state, action: PayloadAction<string[]>) => {
      state.bioDateRange = action.payload
    },
  }
});
