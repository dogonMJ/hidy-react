import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initStringArray, readUrlQuery } from "Utils/UtilsStates";

interface AddFileStates {
  fileList: any[]
}

export const addFileSlice = createSlice({
  name: "addFile",
  initialState: {
    fileList: []
  } as AddFileStates,
  reducers: {
    setFileList: (state, action: PayloadAction<any[]>) => {
      state.fileList = action.payload
    },
  }
});
