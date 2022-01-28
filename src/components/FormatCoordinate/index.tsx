import { coor } from 'types'
const formatLonLat = (degree: number) => {
  const deg = Number(degree)
  const d = Math.trunc(deg);
  const minfloat = Math.abs(deg - d) * 60;
  const m = Math.floor(minfloat);
  const s = Math.round((minfloat - m) * 60);
  const m4 = minfloat.toFixed(2).padStart(5, '0')
  const min = m.toString().padStart(2, '0')
  const sec = s.toString().padStart(2, '0')
  return [deg.toFixed(5), m4, d.toString(), min, sec]
}

const toDMS = (degree: number) => {
  const [D5, M4, D, M, S] = [...formatLonLat(degree)]
  return `${D}\u00B0${M}'${S}"`
}
const toDM = (degree: number) => {
  const [D5, M4, D] = [...formatLonLat(degree)]
  return `${D}\u00B0${M4}'`
}
const toDD = (degree: number) => {
  const D = Number(degree).toFixed(5)
  return `${D}\u00B0`
}

interface Format {
  [key: string]: string
}
const formatOrder: Format = {
  'latlon-dd': 'latlon-dm',
  'latlon-dm': 'latlon-dms',
  'latlon-dms': 'latlon-dd',
};

const formatCoordinate = (coords: coor, format: string) => {
  const lat = coords.lat
  let lon = coords.lng
  const mutiple = Math.floor(lon / 360)
  if (mutiple >= 0) {
    lon = lon - 360 * mutiple
  } else if (mutiple < 0) {
    lon = lon + 360 * Math.abs(mutiple)
  }
  if (lon > 180) { lon -= 360 }

  switch (format) {
    case 'latlon-dd':
      return `${toDD(lat)}, ${toDD(lon)}`
    case 'latlon-dms':
      return `${toDMS(lat)}, ${toDMS(lon)}`
    case 'latlon-dm':
      return `${toDM(lat)}, ${toDM(lon)}`
    default:
      return `${toDD(lat)}, ${toDD(lon)}`
  }
}

export default formatCoordinate;