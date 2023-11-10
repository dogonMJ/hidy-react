import 'leaflet'
import { Marker, Popup } from "react-leaflet"
import { useEffect, useState } from 'react'
// import ReactDOMServer from 'react-dom/server';
import { renderToString } from 'react-dom/server';
import PopupTemplate from './PopupWeather'
import CloudIcon from '@mui/icons-material/Cloud';
import proj4 from "proj4";
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'

declare const L: any;

interface DataArray {
  [key: string]: Object
}

proj4.defs([
  [
    'EPSG:3821',
    '+title=TWD67 +proj=longlat +towgs84=-752,-358,-179,-.0000011698,.0000018398,.0000009822,.00002329 +ellps=aust_SA +units=度 +no_defs'
    //DON'T use GRS67, use aust_SA
  ],
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
  ],
]);

const trans3821to4326 = (lat: number, lon: number) => {
  return proj4('EPSG:3821', 'EPSG:4326', [lon, lat]).reverse()
}
const icon = new L.divIcon({
  className: "CWB_Sea_icon",
  html: renderToString(<CloudIcon style={{ color: '#38AEDD' }} />)
})

export const CwaWeatherSites = () => {
  const [weatherData, setWeatherData] = useState<DataArray>({})
  const fetchSiteData = () => {
    return fetch(`${process.env.REACT_APP_PROXY_BASE}/data/cwaapi/O-A0001-001/`)
      .then((response) => response.json())
      .then((data) => {
        data.records.location.forEach((location: any) => {
          const { stationId } = location;
          weatherData[stationId] = location
        })
        return weatherData
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      const siteData = await Promise.resolve(
        fetchSiteData(),
      );
      setWeatherData({ ...siteData });
    }
    fetchData()
  }, [])

  return (
    <>
      <MarkerCluster>
        {
          Object.values(weatherData).map((station: any, idx: number) =>
            <Marker key={idx} position={trans3821to4326(Number(station.lat), Number(station.lon)) as [number, number]} icon={icon}>
              <Popup >
                <PopupTemplate weatherData={station} stationId={station.stationId} />
              </Popup>
            </Marker>
          )
        }
      </MarkerCluster>
    </>
  )
}