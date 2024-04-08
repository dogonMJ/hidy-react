import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initStringArray, initNumberArray, initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { isIsoDate, isMPDataset, isMPLevels } from "types";
import { cmemsList } from "layout/DataPanel/WebMapLayers/cmemsWMTSList";

const query: any = readUrlQuery('wm')

export interface WmProps {
  opacity?: number
  time?: string
  cmap?: string
  mask?: boolean
  inverse?: boolean
  range: { min: number, max: number }
  logScale?: boolean
  elevation?: number
}
interface WebMapStates {
  wmProps: { [key: string]: WmProps }
}

const initWmProps = () => {
  const wmProps: { [key: string]: WmProps } = {}
  Object.keys(cmemsList).forEach(id => {
    wmProps[id] = {
      cmap: cmemsList[id].defaults.cmap,
      range: cmemsList[id].defaults.range,
      opacity: 100,
      mask: false,
      inverse: false,
      logScale: false,
    }
  })
  return wmProps
}

export const webmapSlice = createSlice({
  name: "wm",
  initialState: {
    wmProps: initWmProps(),
  } as WebMapStates,
  reducers: {
    setWmProps: (state, action: PayloadAction<{ identifier: string, newWmProps: WmProps }>) => {
      const { identifier, newWmProps } = action.payload
      const newState = {
        ...state.wmProps,
        [identifier]: { ...newWmProps }
      }
      state.wmProps = newState
    },
  }
});
