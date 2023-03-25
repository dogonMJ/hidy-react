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
    duration: string
    unit: string
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

export type ScaleUnitType = 'metric' | 'nautical' | 'imperial'