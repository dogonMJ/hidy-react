import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BioDataset, BioFilter, isBioDataset, isBioFilter, isBioTopics, isIsoDate } from "types";
import { readUrlQuery, initNumberArray, initStringArray, initString, initNumber } from "Utils/UtilsStates";
const query = readUrlQuery('odbBio')

interface OdbBioStates {
  dataset: BioDataset
  filter: BioFilter
  dateRange: string[]
  tabNum: 0 | 1
  compGrid: 1 | 2
  latRange: number[]
  lonRange: number[]
  topics: string[]
  taxon: string
  cluster: number
}

export const odbBioSlice = createSlice({
  name: "odbBio",
  initialState: {
    dataset: initString(query, 'dataset', 'all', isBioDataset),
    filter: initString(query, 'filter', 'topic', isBioFilter),
    dateRange: initStringArray(query, 'dateRange', [], isIsoDate),
    tabNum: query && Number(query.tabNum) === 1 ? 1 : 0,
    compGrid: query && Number(query.compGrid) === 2 ? 2 : 1,
    latRange: initNumberArray(query, 'latRange', [10, 40], [10, 40]),
    lonRange: initNumberArray(query, 'lonRange', [109, 135], [109, 135]),
    topics: initStringArray(query, 'topics', [], isBioTopics),
    taxon: initString(query, 'taxon', ''),
    cluster: initNumber(query, 'cluster', 8, [0, 15]),
  } as OdbBioStates,
  reducers: {
    setDataset: (state, action: PayloadAction<BioDataset>) => {
      state.dataset = action.payload
    },
    setFilter: (state, action: PayloadAction<BioFilter>) => {
      state.filter = action.payload
    },
    setDateRange: (state, action: PayloadAction<string[]>) => {
      state.dateRange = action.payload
    },
    switchTab: (state) => {
      state.tabNum = state.tabNum === 0 ? 1 : 0
    },
    switchCompGird: (state) => {
      state.compGrid = state.compGrid === 1 ? 2 : 1
    },
    setLat: (state, action: PayloadAction<number[]>) => {
      state.latRange = action.payload
    },
    setLon: (state, action: PayloadAction<number[]>) => {
      state.lonRange = action.payload
    },
    setTopics: (state, action: PayloadAction<string[]>) => {
      state.topics = action.payload
    },
    setTaxon: (state, action: PayloadAction<string>) => {
      state.taxon = action.payload
    },
    setCluster: (state, action: PayloadAction<number>) => {
      state.cluster = action.payload
    },
  }
});
