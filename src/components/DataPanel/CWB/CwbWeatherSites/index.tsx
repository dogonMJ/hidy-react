import 'leaflet'
import { Marker, Popup } from "react-leaflet"
import { useEffect, useState } from 'react'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import ReactDOMServer from 'react-dom/server';
import PopupTemplate from './PopupWeather'
import CloudIcon from '@mui/icons-material/Cloud';
import proj4 from "proj4";

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
  html: ReactDOMServer.renderToString(<CloudIcon sx={{ color: '#38AEDD' }} />)
})

const CwbWeatherSites = () => {
  const [weatherData, setWeatherData] = useState<DataArray>({})
  const fetchSiteData = () => {
    const cwbkey = process.env.REACT_APP_CWB_KEY as string
    return fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=' + cwbkey)
      .then((response) => response.json())
      .then((data) => {
        // const weatherData = {} as DataArray;
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
      <MarkerClusterGroup>
        {
          Object.values(weatherData).map((station: any, idx: number) =>
            <Marker key={idx} position={trans3821to4326(Number(station.lat), Number(station.lon)) as [number, number]} icon={icon}>
              <Popup >
                <PopupTemplate weatherData={station} stationId={station.stationId} />
              </Popup>
            </Marker>
          )
        }
      </MarkerClusterGroup>
    </>
  )
}
export default CwbWeatherSites