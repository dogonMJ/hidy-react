import 'leaflet'
import { Marker, Popup } from "react-leaflet"
import { useEffect, useState } from 'react'
import { renderToString } from 'react-dom/server';
import PopupTemplate from './PopupSea'
import WavesIcon from '@mui/icons-material/Waves';
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'

declare const L: any;

interface DataArray {
  [key: string]: Object
}
interface Station {
  [key: string]: string
}
interface StationObsTime {
  DateTime: string
}
interface SiteData {
  Station: Station
  StationObsTimes: {
    StationObsTime: StationObsTime[]
  }
}
interface SiteInfo {
  Station: Station
}

const icon = new L.divIcon({
  className: "CWB_Sea_icon",
  html: renderToString(<WavesIcon style={{ color: '#ED6C02' }} />)
})

export const CwaSeaSites = () => {
  const [weatherElement, setWeatherElement] = useState<any>({
    'siteInfo': {},
    'siteData': {},
  })
  const fetchSiteData = () => {
    // B0075-001 海象監測-48小時浮標站與潮位站，API擷取json
    // return fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=' + cwbkey + '&format=JSON')
    return fetch(`${process.env.REACT_APP_PROXY_BASE}/data/cwaapi/O-B0075-001/`)
      .then((response) => response.json())
      .then((data) => {
        const weatherData = {} as DataArray;
        data.Records.SeaSurfaceObs.Location.forEach((Location: SiteData) => {
          const { StationID } = Location.Station;
          const stationData = Location.StationObsTimes.StationObsTime;
          const dataTime = stationData.map((StationObsTime: StationObsTime) => new Date(StationObsTime.DateTime).getTime());
          const idxLatestTime = dataTime.indexOf(Math.max(...dataTime)); // 取最近時間點資料
          weatherData[StationID] = stationData[idxLatestTime];
        })
        return weatherData
      })
  }
  const fetchSiteInfo = () => {
    // B0076-001 浮標、潮位站測站資料，資料開放平台json
    // return fetch('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/O-B0076-001?Authorization=' + cwbkey + '&downloadType=WEB&format=JSON')
    return fetch(`${process.env.REACT_APP_PROXY_BASE}/data/cwafile/O-B0076-001/`)
      .then((response) => response.json())
      .then((data) => {
        const stationInfo = {} as DataArray;
        data.cwaopendata.Resources.Resource.Data.SeaSurfaceObs.Location.forEach((location: SiteInfo) => {
          const { StationID, StationLatitude, StationLongitude, StationName, StationNameEN } = location.Station;
          stationInfo[StationID] = {
            StationID,
            StationLatitude,
            StationLongitude,
            StationName,
            StationNameEN,
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

    <MarkerCluster>
      {
        Object.values(weatherElement.siteInfo).map((station: any, idx: number) =>
          <Marker key={idx} position={[Number(station.StationLatitude), Number(station.StationLongitude)]} icon={icon}>
            <Popup >
              <PopupTemplate weatherData={weatherElement.siteData} station={station} />
            </Popup>
          </Marker>
        )
      }
    </MarkerCluster>

  )
}
