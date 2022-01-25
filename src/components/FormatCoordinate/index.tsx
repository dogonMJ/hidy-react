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

interface  Props {
    position: coor;
}

const FormatCoordinate = (props:Props) => {
    const lat = props.position.lat
    let lon = props.position.lng
    const mutiple = Math.floor(lon / 360)
    if (mutiple > 0) {
      lon = lon - 360 * mutiple
    } else if (mutiple < 0) {
      lon = lon + 360 * Math.abs(mutiple)
    }
    if (lon > 180) { lon -= 360 }
  
    const [latD5, latM4, latD, latM, latS] = [...formatLonLat(lat)]
    const [lonD5, lonM4, lonD, lonM, lonS] = [...formatLonLat(lon)]
    return (
      <tbody>
        <tr >
          <td>Latitude</td>
          <td>,</td>
          <td>Longitude{"\u00A0"}</td>
        </tr>
        <tr>
          <td>{latD + "\u00B0" + latM + "'" + latS + '"'}</td>
          <td>,</td>
          <td>{lonD + "\u00B0" + lonM + "'" + lonS + '"'}</td>
        </tr>
        <tr>
          <td>{latD + "\u00B0" + latM4 + "'"}</td>
          <td>, </td>
          <td>{lonD + "\u00B0" + lonM4 + "'"}</td>
        </tr>
        <tr>
          <td>{latD5 + "\u00B0"}</td>
          <td>, </td>
          <td>{lonD5 + "\u00B0"}</td>
        </tr>
      </tbody>
    )
  }
  
export default FormatCoordinate;