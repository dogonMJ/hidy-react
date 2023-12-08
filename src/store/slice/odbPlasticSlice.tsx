import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initStringArray, initNumberArray, initNumber, initString, readUrlQuery } from "Utils/UtilsStates";
import { isIsoDate, isMPDataset, isMPLevels } from "types";

const query: any = readUrlQuery('odbMP')

interface OdbMPStates {
  dataset: string
  date: string[]
  levels: string[]
  lat: number[]
  lon: number[]
  clusterLevel: number
}

export const odbPlasticSlice = createSlice({
  name: "odbMP",
  initialState: {
    dataset: initString(query, 'dataset', 'all', isMPDataset),
    date: initStringArray(query, 'date', [], isIsoDate),
    levels: initStringArray(query, 'levels', [], isMPLevels),
    lat: initNumberArray(query, 'lat', [10, 40], [-90, 90]),
    lon: initNumberArray(query, 'lon', [109, 135], [-180, 180]),
    clusterLevel: initNumber(query, 'clusterLevel', 8, [0, 10])
  } as OdbMPStates,
  reducers: {
    setDataset: (state, action: PayloadAction<string>) => {
      state.dataset = action.payload
    },
    setDate: (state, action: PayloadAction<string[]>) => {
      state.date = action.payload
    },
    setLevels: (state, action: PayloadAction<string[]>) => {
      state.levels = action.payload
    },
    setLat: (state, action: PayloadAction<number[]>) => {
      state.lat = action.payload
    },
    setLon: (state, action: PayloadAction<number[]>) => {
      state.lon = action.payload
    },
    setClusterLevel: (state, action: PayloadAction<number>) => {
      state.clusterLevel = action.payload
    },
  }
});
