import { coor } from 'types'
const sign = (degree: number, direction: string) => {
  if (degree < 0) {
    return direction[0]
  } else {
    return direction[1]
  }
}
const formatLonLat = (degree: number) => {
  const deg = Number(degree)
  const d = Math.trunc(deg);
  const minfloat = Math.abs(deg - d) * 60;
  const m = Math.floor(minfloat);
  const s = Math.round((minfloat - m) * 60);
  const m4 = minfloat.toFixed(2).padStart(5, '0')
  const min = m.toString().padStart(2, '0')
  const sec = s.toString().padStart(2, '0')
  return [m4, Math.abs(d).toString(), min, sec]
}

const toDMS = (degree: number, direction: string) => {
  const dir = sign(degree, direction)
  const [, D, M, S] = [...formatLonLat(degree)]
  return `${D}\u00B0${M}'${S}"${dir}`
}
const toDM = (degree: number, direction: string) => {
  const dir = sign(degree, direction)
  const [M4, D] = [...formatLonLat(degree)]
  return `${D}\u00B0${M4}'${dir}`
}
const toDD = (degree: number) => {
  const D = Number(degree).toFixed(5)
  return `${D}\u00B0`
}


const FormatCoordinate = (props: { coords: coor, format: string }) => {
  const lat = props.coords.lat
  let lon = props.coords.lng
  const mutiple = Math.floor(lon / 360)
  if (mutiple >= 0) {
    lon = lon - 360 * mutiple
  } else if (mutiple < 0) {
    lon = lon + 360 * Math.abs(mutiple)
  }
  if (lon > 180) { lon -= 360 }

  switch (props.format) {
    case 'latlon-dd':
      return <span>{toDD(lat)}, {toDD(lon)}</span>
    case 'latlon-dms':
      return <span>{toDMS(lat, 'SN')}, {toDMS(lon, 'WE')}</span>
    case 'latlon-dm':
      return <span>{toDM(lat, 'SN')}, {toDM(lon, 'WE')}</span>
    default:
      return <span>{toDD(lat)}, {toDD(lon)}</span>
  }
}

export default FormatCoordinate;