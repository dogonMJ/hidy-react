import * as geojson from 'geojson'
import { AlertColor } from '@mui/material';
import { ReactNode } from 'react';
import { longtermDepths, years } from 'layout/DataPanel/StatisticMean/varList';

export interface MinMax {
    min: number
    max: number
}
export type coor = {
    lat: number;
    lng: number;
}

export interface SliderMarks {
    value: number
    label: string
}

export interface StringObject {
    [key: string]: string
}

export type Positions = "bottomleft" | "bottomright" | "topleft" | "topright"

export interface AlertSlideType {
    open: boolean,
    setOpen: any,
    severity?: AlertColor,
    timeout?: number,
    children?: ReactNode,
    icon?: ReactNode
}

const scaleUnits = ['metric', 'nautical', 'imperial'] as const
export type ScaleUnit = typeof scaleUnits[number]
export const isScaleUnit = (p: any): p is ScaleUnit => scaleUnits.includes(p)

const baseLayers = ['osm', 'EMAP5', 'EMAP8', 'bingmap', 'shaded', 'subice', 'measured']
type BaseLayers = typeof baseLayers[number]
export const isBaseLayer = (p: any): p is BaseLayers => baseLayers.includes(p)

const latlonFormats = ['dd', 'dm', 'dms'] as const
export type LatLonFormat = typeof latlonFormats[number]
export const isLatLonFormat = (p: any): p is LatLonFormat => latlonFormats.includes(p)
//////  wms layers //////

// info list, wms list, local
export const optionList = ["close", "sst", "ssta", "TrueColor", "sla", "adt", "CHL",] as const
export const optionForecast = ["3dinst_thetao", "3dinst_so", "3dwater_velocity", "mlotst", "zos", "bottomT",] as const
export type OptionsWmsLayer = typeof optionList[number]
export type OptionsWmsLayerForecast = typeof optionForecast[number]
export const isOptionsWmsLayer = (x: any): x is OptionsWmsLayer | OptionsWmsLayerForecast => [...optionList, ...optionForecast].includes(x)

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

export interface Legend {
    [key: string]: StringObject
}

export interface ElevationInfo {
    defaultValue: number | undefined
    unit: string | undefined
    values: number[] | undefined
}

export type ServiceType = 'WMTS' | 'WMS'
export const isServiceType = (value: string): value is ServiceType => {
    return value.toUpperCase() === 'WMTS' || value.toUpperCase() === 'WMS';
}

export const CMEMSPaletteList = ["algae", "amp", "balance", "cividis", "cyclic", "delta", "dense", "gray", "haline", "ice", "inferno", "magma", "matter",
    "plasma", "rainbow", "solar", "speed", "tempo", "thermal", "viridis", "ocean", "ternary"] as const
export type CMEMSPalette = typeof CMEMSPaletteList[number];
export const isCMEMSPalette = (p: any): p is CMEMSPalette => CMEMSPaletteList.includes(p)

////// animation //////
export const optionListAnimation = ["close", "madt", "msla"] as const
export type OptionsAnimation = typeof optionListAnimation[number];
export const isOptionsAnimation = (x: any): x is OptionsAnimation => optionListAnimation.includes(x)

////// CWA //////
export const optionListCWA = ['cwaSea', 'cwaWeather', 'cwaRadar'] as const
export type OptionsCWA = typeof optionListCWA[number];
// export const optionListCWAFore = ['close', 'cwasst', 'cwapsu', 'cwasla', 'cwaspd'] as const
export const optionListCWAFore = ['close', 'SST', 'SAL', 'SSH', 'SPD', 'DIR'] as const
export type OptionsCWAFore = typeof optionListCWAFore[number];
export const isOptionsCWAFore = (x: any): x is OptionsCWAFore => optionListCWAFore.includes(x)

export const cwaArrowColors = ['grey', 'black', 'orange'] as const
export type CWAArrowColor = typeof cwaArrowColors[number];
export const iscwaArrowColors = (x: any): x is CWAArrowColor => cwaArrowColors.includes(x)

export const optionListCWAForeCur = ['close', 'cwacur', 'cwadir'] as const
export type OptionsCWAForeCur = typeof optionListCWAForeCur[number];
export const isOptionsCWAForeCur = (x: any): x is OptionsCWAForeCur => optionListCWAForeCur.includes(x)



export interface ComponentList {
    [key: string | OptionsCWA]: JSX.Element
}
////// date //////
export const isIsoDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === date.toISOString().slice(0, 10);
}

////// Chem //////
const validateChemPar = ['Sal', 'DO', 'NO3', 'NO2', 'PO4', 'SiOx', 'NH4', 'Chl', 'POC', 'PON', 'DOC', 'DIC', 'pH_NBS', 'pH_total', 'Alk'] as const
export type ChemPar = typeof validateChemPar[number];
export const isChemPar = (x: any): x is ChemPar => validateChemPar.includes(x)

////// Bio //////
export enum BioFilter {
    topic = 'topic',
    taxon = 'taxon'
}
export const isBioFilter = (x: any): x is BioFilter => Object.keys(BioFilter).includes(x)

const validateBioDataset = ["all", "odb", "oca"] as const
export type BioDataset = typeof validateBioDataset[number];
export const isBioDataset = (x: any): x is BioDataset => validateBioDataset.includes(x)

const validateBioTopics = ["demersal fish", "eDNA fish", "larval fish", "macrobenthos", "zooplankton"] as const
export type BioTopics = typeof validateBioTopics[number];
export const isBioTopics = (x: any): x is BioTopics => validateBioTopics.includes(x)

////// Plastics //////
const validateMPDataset = ["all", "ncei", "oca"] as const
export type MPDataset = typeof validateMPDataset[number];
export const isMPDataset = (x: any): x is MPDataset => validateMPDataset.includes(x)

const validateMPLevels = ["Very Low", "Low", "Medium", "High", "Very High"] as const
export type MPLevels = typeof validateMPLevels[number];
export const isMPLevels = (x: any): x is MPLevels => validateMPLevels.includes(x)

export type PlasticConcentration = {
    [key in MPLevels]: {
        color: string,
        concentration: string
    }
}
////// CTD //////
export const validatePalette = ['plasma', 'viridis', 'magma', 'coolwarm', 'bwr', 'jet', 'YlGnBu', 'YlOrRd'] as const
export type CTDPalette = typeof validatePalette[number];
export const isCTDPalette = (p: any): p is CTDPalette => validatePalette.includes(p)

export const validateCtdParameters = ["temperature", "salinity", "density", "fluorescence", "transmission", "oxygen",] as const
export type CtdParameters = typeof validateCtdParameters[number];
export const isCtdParameter = (p: any): p is CtdParameters => validateCtdParameters.includes(p)

export const validatePeriods = ['avg', 'NE', 'SW', 'spring', 'summer', 'fall', 'winter'] as const
export type CtdPeriods = typeof validatePeriods[number]
export const isCtdPeriod = (p: any): p is CtdPeriods => validatePeriods.includes(p)

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

////// long-term //////

export const validateLongtermPars = ['close', 't', 's', 'o', 'i', 'p', 'n', 'c', 'k', 'm', 'h', 'w', 'u', 'v'] as const
export type LongtermPar = typeof validateLongtermPars[number]
export const isLongtermParameter = (p: any): p is LongtermPar => validateLongtermPars.includes(p)

export const validateLongtermPeriods = ['mean', 'winter', 'spring', 'summer', 'fall', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',] as const
export type LongtermPeriod = typeof validateLongtermPeriods[number]
export const isLongtermPeriod = (p: any): p is LongtermPeriod => validateLongtermPeriods.includes(p)

export const isMonth = (p: any): p is number => Number.isInteger(Number(p)) && p > 0 && p < 13

export const isLongtermYear = (p: any): p is string => years.includes(p)
export const isLongtermDepth = (p: any): p is number => longtermDepths.includes(p)

////// webmaps //////
