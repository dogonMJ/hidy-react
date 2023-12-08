import * as geojson from 'geojson'
import { AlertColor } from '@mui/material';
import { ReactNode } from 'react';
import { periods } from 'Utils/UtilsODB';

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
////// date //////
export const isIsoDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString === date.toISOString().slice(0, 10);
}

////// Chem //////
const validateChemPar = ['none', 'Sal', 'DO', 'NO3', 'NO2', 'PO4', 'SiOx', 'NH4', 'Chl', 'POC', 'PON', 'DOC', 'DIC', 'pH_NBS', 'pH_total', 'Alk',]
export type ChemPar = typeof validateChemPar[number];
export const isChemPar = (x: any): x is ChemPar => validateChemPar.includes(x)

////// Bio //////
export enum BioFilter {
    topic = 'topic',
    taxon = 'taxon'
}
export const isBioFilter = (x: any): x is BioFilter => Object.keys(BioFilter).includes(x)

const validateBioDataset = ["all", "odb", "oca"]
export type BioDataset = typeof validateBioDataset[number];
export const isBioDataset = (x: any): x is BioDataset => validateBioDataset.includes(x)

export interface ComponentList {
    [key: string]: JSX.Element
}

const validateBioTopics = ["demersal fish", "eDNA fish", "larval fish", "macrobenthos", "zooplankton"]
export type BioTopics = typeof validateBioTopics[number];
export const isBioTopics = (x: any): x is BioTopics => validateBioTopics.includes(x)

////// Plastics //////
const validateMPDataset = ["all", "ncei", "oca"]
export type MPDataset = typeof validateMPDataset[number];
export const isMPDataset = (x: any): x is MPDataset => validateMPDataset.includes(x)

const validateMPLevels = ["Very Low", "Low", "Medium", "High", "Very High"]
export type MPLevels = typeof validateMPLevels[number];
export const isMPLevels = (x: any): x is MPLevels => validateMPLevels.includes(x)

////// CTD //////
export const validatePalette = ['plasma', 'viridis', 'magma', 'coolwarm', 'bwr', 'jet', 'YlGnBu', 'YlOrRd']
export type Palette = typeof validatePalette[number];
export const isPalette = (p: any): p is Palette => validatePalette.includes(p)

const validateCtdParameters = ["temperature", "salinity", "density", "fluorescence", "transmission", "oxygen",]
export type CtdParameters = typeof validateCtdParameters[number];
export const isCtdParameter = (p: any): p is CtdParameters => validateCtdParameters.includes(p)

export type CtdPeriods = typeof periods[number]
export const isCtdPeriod = (p: any): p is CtdPeriods => periods.includes(p)


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

export interface AlertSlideType {
    open: boolean,
    setOpen: any,
    severity?: AlertColor,
    timeout?: number,
    children?: ReactNode,
    icon?: ReactNode
}