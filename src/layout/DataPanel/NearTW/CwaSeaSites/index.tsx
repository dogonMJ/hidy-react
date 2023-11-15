import 'leaflet'
import { Marker, Popup } from "react-leaflet"
import { useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server';
import PopupTemplate from './PopupSea'
import WavesIcon from '@mui/icons-material/Waves';
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'
import { Box, Divider, Slider, Typography } from '@mui/material';
import { StringObject } from 'types';
import { useTranslation } from 'react-i18next';

declare const L: any;

interface DataArray {
  [key: string]: Object
}

interface StationObsTime {
  DateTime: string
}
interface SiteInfo {
  Station: StringObject
}
interface SiteData extends SiteInfo {
  StationObsTimes: {
    StationObsTime: StationObsTime[]
  }
}

const icon = new L.divIcon({
  className: "CWB_Sea_icon",
  html: renderToString(<WavesIcon style={{ color: '#ED6C02' }} />)
})

export const CwaSeaSites = () => {
  const { t } = useTranslation()
  const refCluster = useRef<any>()
  const [clusterLevel, setClusterLevel] = useState<number>(8)
  const [weatherElement, setWeatherElement] = useState<any>({
    'siteInfo': {},
    'siteData': {},
  })
  const fetchSiteData = () => {
    // B0075-001 海象監測-48小時浮標站與潮位站，API擷取json
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

  const handleClusterLevelChange = (event: Event, newValue: number | number[]) => {
    const layers = refCluster.current.getLayers()
    setClusterLevel(newValue as number)
    refCluster.current.options.disableClusteringAtZoom = newValue
    refCluster.current.clearLayers()
    refCluster.current.addLayers(layers)
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
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('clusterLevel')}
        </Typography>
        <Slider
          value={clusterLevel}
          onChange={handleClusterLevelChange}
          min={5}
          max={12}
          valueLabelDisplay="auto"
          marks
          track={false}
          sx={{ width: '85%', marginLeft: 2.1 }}
        />
      </Box>
      <Divider variant="middle" />
      <MarkerCluster
        ref={refCluster}
        disableClusteringAtZoom={clusterLevel}
        maxClusterRadius={60}
      >
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
    </>
  )
}