import { ScaleUnit, StringObject } from 'types'

interface UnitSwitch {
  [index: string]: ScaleUnit
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
    bio: {},
  }
}

export const isCenter = (c: string) => {
  const strArray = c.replace('[', '').replace(']', '').split(',');
  if (strArray.length >= 2) {
    return strArray.slice(0, 2).every((ele: any) => !isNaN(ele))
  } else {
    return false
  }
}