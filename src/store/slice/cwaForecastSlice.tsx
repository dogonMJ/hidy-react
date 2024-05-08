import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readUrlQuery } from "Utils/UtilsStates";
import { CMEMSPalette } from "types";
const query: any = readUrlQuery('cwaForecast')

interface CWAProps {
  opacity: number
  palette: CMEMSPalette
  inverse: boolean
  mask: boolean
  min: number
  max: number
}

interface CWAStates {
  [key: string]: CWAProps
}

export const CWADefaults: CWAStates = {
  close: {
    opacity: 100,
    palette: 'plasma',
    inverse: false,
    mask: false,
    min: 2,
    max: 30
  },
  SST: {
    opacity: 100,
    palette: 'rainbow',
    inverse: false,
    mask: false,
    min: 2,
    max: 30
  },
  SAL: {
    opacity: 100,
    palette: 'ocean',
    inverse: false,
    mask: false,
    min: 30,
    max: 35
  },
  SSH: {
    opacity: 100,
    palette: 'ternary',
    inverse: false,
    mask: false,
    min: 0,
    max: 2
  },
  SPD: {
    opacity: 100,
    palette: 'matter',
    inverse: false,
    mask: false,
    min: 0,
    max: 2
  },
}

const initCWAStates = () => {
  if (query) {
    const res = { ...CWADefaults }
    Object.keys(query).forEach((key: string) => {
      if (key) {
        const urlObj = JSON.parse(query[key])
        const newObj = { ...CWADefaults[key], ...urlObj }
        res[key] = newObj
      }
    })
    return (res)
  } else {
    return CWADefaults
  }
}
initCWAStates()
export const cwaForecastSlice = createSlice({
  name: "cwaForecast",
  initialState: {
    ...initCWAStates(),
  } as CWAStates,
  reducers: {
    setOpacity: (state, action: PayloadAction<{ identifier: string, opacity: number }>) => {
      const { identifier, opacity } = action.payload
      state[identifier].opacity = opacity
    },
    setPalette: (state, action: PayloadAction<{ identifier: string, palette: CMEMSPalette }>) => {
      const { identifier, palette } = action.payload
      state[identifier].palette = palette
    },
    setIeverse: (state, action: PayloadAction<{ identifier: string, inverse: boolean }>) => {
      const { identifier, inverse } = action.payload
      state[identifier].inverse = inverse
    },
    setMask: (state, action: PayloadAction<{ identifier: string, mask: boolean }>) => {
      const { identifier, mask } = action.payload
      state[identifier].mask = mask
    },
    setRange: (state, action: PayloadAction<{ identifier: string, min?: number, max?: number }>) => {
      const { identifier, min, max } = action.payload
      if (min || min === 0) {
        state[identifier].min = min
      }
      if (max || max === 0) {
        state[identifier].max = max
      }
    },
  }
});