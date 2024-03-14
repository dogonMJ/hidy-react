import { LatLonFormat, ScaleUnit } from 'types'
import proj4 from "proj4"

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

export const customRound = <T extends number | string>(
  n: number | string,
  digit: number,
  returnType?: 'number' | 'string'
): T => {
  if (!Number.isInteger(digit)) {
    throw new Error('digit must be an integer');
  }

  if (typeof n === 'number') {
    const multiplier = Math.pow(10, digit);
    const roundedNumber = Math.round(Number(n) * multiplier) / multiplier;
    return returnType === 'string' ? roundedNumber.toFixed(digit) as T : roundedNumber as T;
  } else if (typeof n === 'string' && !isNaN(parseFloat(n))) {
    const roundedNumber = parseFloat(n).toFixed(digit);
    const padLength = digit - roundedNumber.length + n.toString().indexOf('.') + 1;
    const paddedNumber = padLength > 0 ? roundedNumber.padEnd(roundedNumber.length + padLength, '0') : roundedNumber;
    return returnType === 'string' ? paddedNumber as T : parseFloat(paddedNumber) as T;
  } else {
    throw new Error('Invalid input for n');
  }
}

proj4.defs([
  [
    "EPSG:3825", "+proj=tmerc +lat_0=0 +lon_0=119 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
  ],
  [
    "EPSG:3826", "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
  ],
  [
    "EPSG:3827", "+proj=tmerc +lat_0=0 +lon_0=119 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +units=m +no_defs +type=crs"
  ],
  [
    "EPSG:3828", "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +units=m +no_defs +type=crs"
  ],
  [
    "EPSG:32650", "+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs +type=crs"
  ],
  [
    "EPSG:32651", "+proj=utm +zone=51 +datum=WGS84 +units=m +no_defs +type=crs"
  ]
]);