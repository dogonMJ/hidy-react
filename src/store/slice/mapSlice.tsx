import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { coor } from "types";

interface Format {
  [key: string]: string
}
const formatOrder: Format = {
  'latlon-dd': 'latlon-dm',
  'latlon-dm': 'latlon-dms',
  'latlon-dms': 'latlon-dd',
};

const d = new Date()
export interface inputstate {
  active: boolean
  inputLat: number
  inputLon: number
  markers: Array<Array<number | null>>//[(number | null)[]]
  latlonformat: string
  datetime: string
  animateIdent: string
  depthMeterValue: number
  elevations: number[]
  OdbCurSelection: string
  OdbCtdSelection: string
}
export const coordInputSlice = createSlice({
  name: "coordInput",
  initialState: {
    active: false,
    inputLat: 23.5,
    inputLon: 121,
    markers: [[null, null]],
    latlonformat: 'latlon-dd',
    datetime: d.toISOString(),
    animateIdent: "close",
    depthMeterValue: -1,
    elevations: [-5727.9169921875, -5274.7841796875, -4833.291015625, -4405.22412109375, -3992.48388671875, -3597.031982421875, -3220.820068359375, -2865.702880859375, -2533.3359375, -2225.077880859375, -1941.8929443359375, -1684.2840576171875, -1452.2509765625, -1245.291015625, -1062.43994140625, -902.3392944335938, -763.3331298828125, -643.5667724609375, -541.0889282226562, -453.9377136230469, -380.2130126953125, -318.1274108886719, -266.0403137207031, -222.47520446777344, -186.12559509277344, -155.85069274902344, -130.66600036621094, -109.72930145263672, -92.3260726928711, -77.85385131835938, -65.80726623535156, -55.76428985595703, -47.37369155883789, -40.344051361083984, -34.43415069580078, -29.444730758666992, -25.211410522460938, -21.598819732666016, -18.495559692382812, -15.810070037841797, -13.467140197753906, -11.404999732971191, -9.572997093200684, -7.92956018447876, -6.440614223480225, -5.078224182128906, -3.8194949626922607, -2.6456689834594727, -1.5413750410079956, -0.49402499198913574],
    OdbCurSelection: 'avg',
    OdbCtdSelection: 't',
  } as inputstate,
  reducers: {
    switchActive: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload
    },
    changeLat: (state, action: PayloadAction<number>) => {
      state.inputLat = action.payload
    },
    changeLon: (state, action: PayloadAction<number>) => {
      state.inputLon = action.payload
    },
    changeMarkers: (state, action: PayloadAction<Array<Array<number | null>>>) => {
      state.markers = action.payload
    },
    switchFormat: (state, action: PayloadAction<string>) => {
      state.latlonformat = formatOrder[action.payload]
    },
    changeDatetime: (state, action: PayloadAction<string>) => {
      state.datetime = action.payload
    },
    animateIdentifier: (state, action: PayloadAction<string>) => {
      state.animateIdent = action.payload
    },
    depthMeterValue: (state, action: PayloadAction<number>) => {
      state.depthMeterValue = action.payload
    },
    elevations: (state, action: PayloadAction<number[]>) => {
      state.elevations = action.payload
    },
    OdbCurSelection: (state, action: PayloadAction<string>) => {
      state.OdbCurSelection = action.payload
    },
    OdbCtdSelection: (state, action: PayloadAction<string>) => {
      state.OdbCtdSelection = action.payload
    },
  }
});
