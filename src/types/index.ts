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