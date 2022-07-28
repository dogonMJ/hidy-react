export interface NasaColors {
  id: string
  maps: Map[]
}

export interface Map {
  type: string
  entries: Entries
  legend: Legend
  title: string
}

export interface Entries {
  type: string
  colors: string[]
  refs: string[]
  values: number[][]
  title: string
}

export interface Legend {
  colors: string[]
  type: string
  tooltips: string[]
  ticks: number[]
  refs: string[]
  title: string
  id: string
  minLabel: string
  maxLabel: string
  units: string
}
