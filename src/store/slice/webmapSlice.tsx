import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readUrlQuery } from "Utils/UtilsStates";
import { cmemsList, gibsList } from "layout/DataPanel/WebMapLayers/WMTSList";

const query: any = readUrlQuery('webmap')

export interface WmProps {
  opacity?: number
  time?: string
  cmap?: string
  noClamp?: boolean
  inverse?: boolean
  min: number
  max: number
  elevation?: number
}
interface WebMapStates {
  [key: string]: WmProps
}

const initCMEMS = (id: string) => {
  const defaults = cmemsList[id].defaults
  if (query && Object.keys(query)[0] !== '') {
    const converted = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [key, JSON.parse(value as string)])
    )
    const modifiedId = Object.keys(converted)
    const obj = {
      cmap: modifiedId.includes(id) ? converted[id].cmap ?? (defaults?.cmap ?? 'default') : (defaults?.cmap ?? 'default'),
      min: modifiedId.includes(id) ? converted[id].min ?? (defaults?.min ?? 0) : (defaults?.min ?? 0),
      max: modifiedId.includes(id) ? converted[id].max ?? (defaults?.max ?? 1) : (defaults?.max ?? 1),
      opacity: modifiedId.includes(id) ? converted[id].opacity ?? 100 : 100,
      noClamp: modifiedId.includes(id) ? converted[id].noClamp ?? (defaults?.noClamp ?? false) : (defaults?.noClamp ?? false),
      inverse: modifiedId.includes(id) ? converted[id].inverse ?? (defaults?.inverse ?? false) : (defaults?.inverse ?? false),
    }
    return { ...obj }
  } else {
    const obj = {
      cmap: defaults?.cmap ?? 'default',
      min: defaults?.min ?? 0,
      max: defaults?.max ?? 1,
      opacity: 100,
      noClamp: defaults?.noClamp ?? false,
      inverse: defaults?.inverse ?? false,
    }
    return { ...obj }
  }

}
const initGibs = (id: string) => {
  if (query && Object.keys(query)[0] !== '') {
    const converted = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [key, JSON.parse(value as string)])
    )
    const modifiedId = Object.keys(converted)
    const obj = {
      opacity: modifiedId.includes(id) ? converted[id].opacity : 100,
    }
    return { ...obj }
  } else {
    const obj = {
      opacity: 100,
    }
    return { ...obj }
  }
}
export const webmapSlice = createSlice({
  name: "webmap",
  initialState: {
    ...Object.fromEntries(
      Object.entries(cmemsList).map(([id, value]) => [id, initCMEMS(id)])
    ),
    ...Object.fromEntries(
      Object.entries(gibsList).map(([id, value]) => [id, initGibs(id)])
    ),
  } as WebMapStates,
  reducers: {
    setWmProps: (state, action: PayloadAction<{ identifier: string, newWmProps: WmProps }>) => {
      const { identifier, newWmProps } = action.payload
      state[identifier] = { ...newWmProps }
    },
  }
});