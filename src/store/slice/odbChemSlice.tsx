import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initStringArray, initNumberArray, readUrlQuery, initNumber } from "Utils/UtilsStates";
import { chemDepthList } from "Utils/UtilsODB";
import { ChemPar, isChemPar, isIsoDate } from "types";

const query: any = readUrlQuery('odbChem')

interface OdbChemStates {
  date: string[]
  lat: number[]
  lon: number[]
  iDepth: number[]
  par: ChemPar[]
  clusterLevel: number
}

export const odbChemSlice = createSlice({
  name: "odbChem",
  initialState: {
    date: initStringArray(query, 'date', ['1988-12-18', '2016-12-31'], isIsoDate),
    lat: initNumberArray(query, 'lat', [3, 33], [3, 33]),
    lon: initNumberArray(query, 'lon', [106, 128], [106, 128]),
    iDepth: initNumberArray(query, 'iDepth', [0, chemDepthList.length - 1], [0, chemDepthList.length - 1]),
    par: initStringArray(query, 'par', [], isChemPar),
    clusterLevel: initNumber(query, 'clusterLevel', 8, [0, 10])
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
    setPar: (state, action: PayloadAction<ChemPar[]>) => {
      state.par = action.payload
    },
    setClusterLevel: (state, action: PayloadAction<number>) => {
      state.clusterLevel = action.payload
    },
  }
});
