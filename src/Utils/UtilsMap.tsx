import { LatLonFormat, ScaleUnit } from 'types'

export const unitSwitch: { [key in ScaleUnit]: ScaleUnit } = {
  'metric': 'nautical',
  'nautical': 'imperial',
  'imperial': 'metric',
}

export const formatSwitch: { [key in LatLonFormat]: LatLonFormat } = {
  'dd': 'dm',
  'dm': 'dms',
  'dms': 'dd',
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