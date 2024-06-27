import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
