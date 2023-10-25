import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const urlParams = new URLSearchParams(window.location.search)
const keys = Array.from(urlParams.keys())

interface OnoffStates {
  checkedOdb: string[]
}

export const onoffsSlice = createSlice({
  name: "switches",
  initialState: {
    checkedOdb: keys ? keys.filter((key) => key.startsWith('odb')) : [],
  } as OnoffStates,
  reducers: {
    setOdbChecked: (state, action: PayloadAction<string[]>) => {
      state.checkedOdb = action.payload
    },
  }
});
