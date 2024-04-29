import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initBoolean, initString, readUrlQuery } from "Utils/UtilsStates";
import { CTDPalette, isPalette } from "types";
import { optionListCWAFore } from "types";
const query: any = readUrlQuery('webmap')

interface CWAProps {
  opacity: number
  palette: string
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
  }
}

// const initCWA = (id: string) => {
//   const defaults = CWADefaults
//   if (query && Object.keys(query)[0] !== '') {
//     const converted = Object.fromEntries(
//       Object.entries(query).map(([key, value]) => [key, JSON.parse(value as string)])
//     )
//     const modifiedId = Object.keys(converted)
//     const obj = {
//       cmap: modifiedId.includes(id) ? converted[id].cmap ?? (defaults?.cmap ?? 'default') : (defaults?.cmap ?? 'default'),
//       min: modifiedId.includes(id) ? converted[id].min ?? (defaults?.min ?? 0) : (defaults?.min ?? 0),
//       max: modifiedId.includes(id) ? converted[id].max ?? (defaults?.max ?? 1) : (defaults?.max ?? 1),
//       opacity: modifiedId.includes(id) ? converted[id].opacity ?? 100 : 100,
//       noClamp: modifiedId.includes(id) ? converted[id].noClamp ?? (defaults?.noClamp ?? false) : (defaults?.noClamp ?? false),
//       inverse: modifiedId.includes(id) ? converted[id].inverse ?? (defaults?.inverse ?? false) : (defaults?.inverse ?? false),
//     }
//     return { ...obj }
//   } else {
//     const obj = {
//       cmap: defaults?.cmap ?? 'default',
//       min: defaults?.min ?? 0,
//       max: defaults?.max ?? 1,
//       opacity: 100,
//       noClamp: defaults?.noClamp ?? false,
//       inverse: defaults?.inverse ?? false,
//     }
//     return { ...obj }
//   }

// }
export const cwaForecastSlice = createSlice({
  name: "cwaForecast",
  initialState: {
    ...CWADefaults
  } as CWAStates,
  reducers: {
    setOpacity: (state, action: PayloadAction<{ identifier: string, opacity: number }>) => {
      const { identifier, opacity } = action.payload
      state[identifier].opacity = opacity
    },
    setPalette: (state, action: PayloadAction<{ identifier: string, palette: CTDPalette }>) => {
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