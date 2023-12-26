import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initBoolean, initString, readUrlQuery } from "Utils/UtilsStates";
import { LongtermPar, LongtermPeriod, isLongtermDepth, isLongtermParameter, isLongtermPeriod, isLongtermYear, isMonth } from "types";

const query: any = readUrlQuery('longterm')

interface LongtermStates {
  par: LongtermPar
  monthly: boolean
  profile: boolean
  depth: number
  year: string
  month: string
  period: LongtermPeriod
  coord: string
}

const formatMonthNumber = (monthNumber: string) => Number(monthNumber) < 10 ? `0${Number(monthNumber)}` : `${monthNumber}`
const isCoord = (coordStr: string) => {
  const coord = Number(coordStr)
  if (coord % 25 === 0) {
    return (coord >= 200 && coord <= 3500) || (coord >= 10500 && coord <= 13500) ? true : false
  } else {
    return false
  }
}

export const longtermSlice = createSlice({
  name: "longterm",
  initialState: {
    par: initString(query, 'par', 'close', isLongtermParameter),
    monthly: initBoolean(query, 'monthly'),
    profile: initBoolean(query, 'profile'),
    depth: query && query.depth && isLongtermDepth(Number(query.depth)) ? Number(query.depth) : 0,
    year: initString(query, 'year', '1993', isLongtermYear),
    month: query && query.month && isMonth(query.month) ? formatMonthNumber(query.month) : '01',
    period: initString(query, 'period', 'mean', isLongtermPeriod),
    coord: initString(query, 'coord', '', isCoord)
  } as LongtermStates,
  reducers: {
    setPar: (state, action: PayloadAction<LongtermPar>) => {
      state.par = action.payload
    },
    setMonthly: (state, action: PayloadAction<boolean>) => {
      state.monthly = action.payload
    },
    setProfile: (state, action: PayloadAction<boolean>) => {
      state.profile = action.payload
    },
    setDepth: (state, action: PayloadAction<number>) => {
      state.depth = action.payload
    },
    setYear: (state, action: PayloadAction<string>) => {
      state.year = action.payload
    },
    setMonth: (state, action: PayloadAction<string>) => {
      state.month = action.payload
    },
    setPeriod: (state, action: PayloadAction<LongtermPeriod>) => {
      state.period = action.payload
    },
    setCoord: (state, action: PayloadAction<string>) => {
      state.coord = action.payload
    },
  }
});
