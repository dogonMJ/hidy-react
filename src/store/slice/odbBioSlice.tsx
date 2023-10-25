import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BioDataset, BioFilter } from "types";
import { str2List, readUrlQuery } from "Utils/UtilsStates";
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

const isBioFilter = (x: any): x is BioFilter => Object.keys(BioFilter).includes(x)
const isBioDataset = (x: any): x is BioDataset => Object.keys(BioDataset).includes(x)

export const odbBioSlice = createSlice({
  name: "odbBio",
  initialState: {
    dataset: query && isBioDataset(query.dataset) ? query.dataset : 'all',
    filter: query && isBioFilter(query.filter) ? query.filter : 'topic',
    dateRange: query && query.dateRange ? str2List(query.dateRange) : [],
    tabNum: query && Number(query.tabNum) === 1 ? 1 : 0,
    compGrid: query && Number(query.compGrid) === 2 ? 2 : 1,
    latRange: query && query.latRange && !str2List(query.latRange, Number).some(isNaN) ? str2List(query.latRange, Number) : [10, 40],
    lonRange: query && query.lonRange && !str2List(query.lonRange, Number).some(isNaN) ? str2List(query.lonRange, Number) : [109, 135],
    topics: query && query.topics ? str2List(query.topics) : [],
    taxon: query && query.taxon ? query.taxon : '',
    cluster: query && Number(query.cluster) <= 15 ? Number(query.cluster) : 8,
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
