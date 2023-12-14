import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsCWAFore, OptionsCWAForeCur, OptionsWmsLayer, OptionsWmsLayerForecast, isOptionsCWAFore, isOptionsWmsLayer, isOptionsAnimation, OptionsAnimation } from "types";
import { initRadio } from "Utils/UtilsStates";

const urlParams = new URLSearchParams(window.location.search)
const keys = Array.from(urlParams.keys())

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
    checked: keys ? keys : [],
    cwaSeaForecast: initRadio(urlParams, 'cwaSeaForecast', isOptionsCWAFore),
    cwaSeaForeCur: initRadio(urlParams, 'cwaSeaForeCur', isOptionsCWAFore),
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
