import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initStringArray, initNumberArray, readUrlQuery } from "Utils/UtilsStates";
import { chemDepthList } from "Utils/UtilsODB";
import { isChemPar, isIsoDate } from "types";

const query: any = readUrlQuery('odbChem')

interface OdbChemStates {
  date: string[]
  lat: number[]
  lon: number[]
  iDepth: number[]
  par: string[]
}

export const odbChemSlice = createSlice({
  name: "odbChem",
  initialState: {
    date: initStringArray(query, 'date', ['1988-12-18', '2016-12-31'], isIsoDate),
    lat: initNumberArray(query, 'lat', [3, 33], [3, 33]),
    lon: initNumberArray(query, 'lon', [106, 128], [106, 128]),
    iDepth: initNumberArray(query, 'iDepth', [0, chemDepthList.length - 1], [0, chemDepthList.length - 1]),
    par: initStringArray(query, 'par', ['none'], isChemPar),
  } as OdbChemStates,
  reducers: {
    setDate: (state, action: PayloadAction<string[]>) => {
      state.date = action.payload
    },
    setLat: (state, action: PayloadAction<number[]>) => {
      state.lat = action.payload
    },
    setLon: (state, action: PayloadAction<number[]>) => {
      state.lon = action.payload
    },
    setIDpeth: (state, action: PayloadAction<number[]>) => {
      state.iDepth = action.payload
    },
    setPar: (state, action: PayloadAction<string[]>) => {
      state.par = action.payload
    },
  }
});
