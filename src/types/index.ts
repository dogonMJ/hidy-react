import * as geojson from 'geojson'

export type coor = {
    lat: number;
    lng: number;
}

export interface SliderMarks {
    value: number
    label: string
}

export interface Api {
    type: string
    url: string
    layer: string
    featureinfo: boolean
    duration?: string
    unit?: string
    style?: string
    format?: string
    transparent?: boolean
    crossOrigin?: string
    tileMatrixSet?: string
    formatExt?: string
    elevation?: number
    colorBar?: string
}

export interface StringObject {
    [key: string]: string
}

export interface Legend {
    [key: string]: StringObject
}

export type ServiceType = 'WMTS' | 'WMS'
export type ScaleUnitType = 'metric' | 'nautical' | 'imperial'

export interface ApiParams {
    key: string
    crossOrigin?: Api['crossOrigin']
    opacity?: number
    layers?: Api['layer']
    styles?: Api['style']
    format?: Api['format']
    transparent?: Api['transparent']
    time?: string
    elevation?: number
    featureinfo?: boolean
}

export interface TileProp {
    url: Api['url']
    params: ApiParams,
    type: Api['type']
}

export interface ElevationInfo {
    defaultValue: number | undefined
    unit: string | undefined
    values: number[] | undefined
}

export type Positions = "bottomleft" | "bottomright" | "topleft" | "topright"

// export type BioDataset = "all" | "odb" | "oca"
export enum BioDataset {
    all = "all",
    odb = "odb",
    oca = "oca"
}
// export type BioFilter = "topic" | "taxon"
export enum BioFilter {
    topic = 'topic',
    taxon = 'taxon'
}

export interface ComponentList {
    [key: string]: JSX.Element
}

export type Palette = 'plasma' | 'viridis' | 'magma' | 'coolwarm' | 'bwr' | 'jet' | 'YlGnBu' | 'YlOrRd'
export const isPalette = (p: any): p is Palette => ['plasma', 'viridis', 'magma', 'coolwarm', 'bwr', 'jet', 'YlGnBu', 'YlOrRd'].includes(p)
export type CtdParameters = "temperature" | "salinity" | "density" | "fluorescence" | "transmission" | "oxygen"
export const isCtdParameter = (p: any): p is CtdParameters => ["temperature", "salinity", "density", "fluorescence", "transmission", "oxygen",].includes(p)

export interface VerticalPlotProps {
    lat: number
    lng: number
    mode: string
    parameter: string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface CtdProperties {
    time_period: string
    depth: number
    count?: number
    temperature?: number
    salinity?: number
    density?: number
    fluorescence?: number
    transmission?: number
    oxygen?: number
}

export interface AdcpProperties {
    time_period: string
    depth: number
    count?: number
    u?: number
    v?: number
}

export interface AdcpFeature extends geojson.Feature {
    properties: AdcpProperties
}

export interface CtdFeature extends geojson.Feature {
    properties: CtdProperties
}

