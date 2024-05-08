import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  OptionsCWAFore, OptionsCWAForeCur, OptionsWmsLayer, OptionsWmsLayerForecast, OptionsAnimation,
  isOptionsCWAFore, isOptionsCWAForeCur, isOptionsWmsLayer, isOptionsAnimation
} from "types";
import { initRadio } from "Utils/UtilsStates";

const urlParams = new URLSearchParams(window.location.search)
const keys = Array.from(urlParams.keys())
const excludeRdio = keys.filter(key => !['cwaSeaForecast', 'cwaSeaForeCur', 'wmsLayer', 'aniCur'].includes(key))

interface OnoffStates {
  checked: string[] //多選
  cwaSeaForecast: OptionsCWAFore
  cwaSeaForeCur: OptionsCWAForeCur
  wmsLayer: OptionsWmsLayer | OptionsWmsLayerForecast
  aniCur: OptionsAnimation
}

export const onoffsSlice = createSlice({
  name: "switches",
  initialState: {
    checked: excludeRdio ?? [],
    cwaSeaForecast: initRadio(urlParams, 'cwaSeaForecast', isOptionsCWAFore),
    cwaSeaForeCur: initRadio(urlParams, 'cwaSeaForeCur', isOptionsCWAForeCur),
    wmsLayer: initRadio(urlParams, 'wmsLayer', isOptionsWmsLayer),
    aniCur: initRadio(urlParams, 'aniCur', isOptionsAnimation),
  } as OnoffStates,
  reducers: {
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload
    },
    setCwaSeaForecast: (state, action: PayloadAction<OptionsCWAFore>) => {
      state.cwaSeaForecast = action.payload
    },
    setCwaSeaForeCur: (state, action: PayloadAction<OptionsCWAForeCur>) => {
      state.cwaSeaForeCur = action.payload
    },
    setWmsLayer: (state, action: PayloadAction<OptionsWmsLayer | OptionsWmsLayerForecast>) => {
      state.wmsLayer = action.payload
    },
    setAniCur: (state, action: PayloadAction<OptionsAnimation>) => {
      state.aniCur = action.payload
    },
  }
});
