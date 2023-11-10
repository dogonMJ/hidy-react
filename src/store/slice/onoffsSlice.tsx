import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const urlParams = new URLSearchParams(window.location.search)
const keys = Array.from(urlParams.keys())

interface OnoffStates {
  checked: string[]
  cwaForecast1: string[]

}

export const onoffsSlice = createSlice({
  name: "switches",
  initialState: {
    checked: keys ? keys : [],
  } as OnoffStates,
  reducers: {
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload
    },
  }
});
