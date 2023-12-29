import { Position } from 'geojson';
import { LatLngExpression } from 'leaflet';
const sign = (degree: number, direction: string) => degree < 0 ? direction[0] : direction[1]

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

function isPosition(coords: any): coords is Position {
  return Array.isArray(coords) && coords.length === 2;
}

const FormatCoordinate = (props: { coords: LatLngExpression | Position, format: string }) => {
  const lat = isPosition(props.coords) ? props.coords[1] : props.coords.lat
  let lon = isPosition(props.coords) ? props.coords[0] : props.coords.lng

  const mutiple = Math.floor(lon / 360)
  if (mutiple >= 0) {
    lon = lon - 360 * mutiple
  } else if (mutiple < 0) {
    lon = lon + 360 * Math.abs(mutiple)
  }
  if (lon > 180) { lon -= 360 }
  switch (props.format) {
    case 'dd':
      return <span>{toDD(lat)}, {toDD(lon)}</span>
    case 'dms':
      return <span>{toDMS(lat, 'SN')}, {toDMS(lon, 'WE')}</span>
    case 'dm':
      return <span>{toDM(lat, 'SN')}, {toDM(lon, 'WE')}</span>
    default:
      return <span>{toDD(lat)}, {toDD(lon)}</span>
  }
}

export default FormatCoordinate;