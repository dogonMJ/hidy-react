import { ScaleUnitType, StringObject } from 'types'

interface UnitSwitch {
  [index: string]: ScaleUnitType
}
export const unitSwitch: UnitSwitch = {
  'metric': 'nautical',
  'nautical': 'imperial',
  'imperial': 'metric',
}

export const formatOrder: StringObject = {
  'latlon-dd': 'latlon-dm',
  'latlon-dm': 'latlon-dms',
  'latlon-dms': 'latlon-dd',
};

export const defaultURLParams = {
  odb: {
    ctd: {},
    adcp: {},
  }
}

export const readUrlQuery = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  const options = urlParams.get(key)?.split(';').reduce((acc: any, pair) => {
    const [key, value] = pair.split(/:(.*)/s);
    acc[key] = value;
    return acc;
  }, {});
  return options
}