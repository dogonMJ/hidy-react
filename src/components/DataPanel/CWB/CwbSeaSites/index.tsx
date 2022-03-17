import 'leaflet'
import { Marker, Popup } from "react-leaflet"
import { useEffect, useState } from 'react'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PopupTemplate from './PopupSea'
import WavesIcon from '@mui/icons-material/Waves';
import ReactDOMServer from 'react-dom/server';

declare const L: any;

interface DataArray {
  [key: string]: Object
}
interface Station {
  [key: string]: string
}
interface StationObsTime {
  dataTime: string
}
interface SiteData {
  station: Station
  stationObsTimes: {
    stationObsTime: StationObsTime[]
  }
}
interface SiteInfo {
  station: Station
}

const icon = new L.divIcon({
  className: "CWB_Sea_icon",
  html: ReactDOMServer.renderToString(<WavesIcon sx={{ color: '#ed6c02' }} />)
})

const CwbSeaSites = () => {
  const [weatherElement, setWeatherElement] = useState<any>({
    'siteInfo': {},
    'siteData': {},
  })
  const cwbkey = process.env.REACT_APP_CWB_KEY
  const fetchSiteData = () => {
    // B0075-001 海象監測-48小時浮標站與潮位站，API擷取json
    return fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=' + cwbkey + '&format=JSON')
      .then((response) => response.json())
      .then((data) => {
        const weatherData = {} as DataArray;
        data.records.seaSurfaceObs.location.forEach((location: SiteData) => {
          const { stationID } = location.station;
          const stationData = location.stationObsTimes.stationObsTime;
          const dataTime = stationData.map((stationObsTime: StationObsTime) => new Date(stationObsTime.dataTime).getTime());
          const idxLatestTime = dataTime.indexOf(Math.max(...dataTime)); // 取最近時間點資料
          weatherData[stationID] = stationData[idxLatestTime];
        })
        return weatherData
      })
  }
  const fetchSiteInfo = () => {
    // B0076-001 浮標、潮位站測站資料，資料開放平台json
    return fetch('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/O-B0076-001?Authorization=' + cwbkey + '&downloadType=WEB&format=JSON')
      .then((response) => response.json())
      .then((data) => {
        const stationInfo = {} as DataArray;
        data.cwbdata.resources.resource.data.seaSurfaceObs.location.forEach((location: SiteInfo) => {
          const { stationID, stationLatitude, stationLongitude, stationName, stationNameEN } = location.station;
          stationInfo[stationID] = {
            stationID,
            stationLatitude,
            stationLongitude,
            stationName,
            stationNameEN,
          };
        })
        return stationInfo
      })
  }
  useEffect(() => {
    const fetchData = async () => {
      const [siteInfo, siteData] = await Promise.all([
        fetchSiteInfo(),
        fetchSiteData(),
      ]);
      setWeatherElement({
        'siteInfo': { ...siteInfo },
        'siteData': { ...siteData },
      });
    }
    fetchData()
  }, [])
  return (
    <>
      <MarkerClusterGroup>
        {
          Object.values(weatherElement.siteInfo).map((station: any, idx: number) =>
            <Marker key={idx} position={[Number(station.stationLatitude), Number(station.stationLongitude)]} icon={icon}>
              <Popup >
                <PopupTemplate weatherData={weatherElement.siteData} station={station} />
              </Popup>
            </Marker>
          )
        }
      </MarkerClusterGroup>
    </>
  )
}
export default CwbSeaSites