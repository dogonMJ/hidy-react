import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface inputstate {
  active: boolean
}
export const inputActiveSlice = createSlice({
  name: "inputActive",
  initialState: {
    active: false
  } as inputstate,
  reducers: {
    switchActive: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload
    },
  },
});
