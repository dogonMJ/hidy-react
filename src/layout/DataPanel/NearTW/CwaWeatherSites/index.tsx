import 'leaflet'
import { Marker, Popup } from "react-leaflet"
import { useEffect, useRef, useState } from 'react'
// import ReactDOMServer from 'react-dom/server';
import { renderToString } from 'react-dom/server';
import PopupTemplate from './PopupWeather'
import CloudIcon from '@mui/icons-material/Cloud';
//@ts-ignore
import MarkerCluster from '@changey/react-leaflet-markercluster'
import { Box, Divider, Slider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

declare const L: any;

interface DataArray {
  [key: string]: Object
}

const icon = new L.divIcon({
  className: "CWB_Sea_icon",
  html: renderToString(<CloudIcon style={{ color: '#38AEDD' }} />)
})

export const CwaWeatherSites = () => {
  const refCluster = useRef<any>()
  const { t } = useTranslation()
  const [clusterLevel, setClusterLevel] = useState<number>(11)
  const [weatherData, setWeatherData] = useState<DataArray>({})

  const handleClusterLevelChange = (event: Event, newValue: number | number[]) => {
    const layers = refCluster.current.getLayers()
    setClusterLevel(newValue as number)
    refCluster.current.options.disableClusteringAtZoom = newValue
    refCluster.current.clearLayers()
    refCluster.current.addLayers(layers)
  }

  const fetchSiteData = () => {
    return fetch(`${process.env.REACT_APP_PROXY_BASE}/data/cwaapi/O-A0001-001/`)
      .then((response) => response.json())
      .then((data) => {
        data.records.Station.forEach((location: any) => {
          const { StationId } = location;
          weatherData[StationId] = location
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
      <Divider variant="middle" />
      <Box sx={{ margin: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('clusterLevel')}
        </Typography>
        <Slider
          value={clusterLevel}
          onChange={handleClusterLevelChange}
          min={8}
          max={13}
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
          Object.values(weatherData).map((station: any, idx: number) => {
            const wgs84Coordinate = station.GeoInfo.Coordinates.find((coordinate: any) => coordinate.CoordinateName === 'WGS84');
            const lat = wgs84Coordinate.StationLatitude
            const lng = wgs84Coordinate.StationLongitude
            return (
              <Marker key={idx} position={{ lat, lng }} icon={icon}>
                <Popup>
                  <PopupTemplate weatherData={station} />
                </Popup>
              </Marker>
            )
          }
          )
        }
      </MarkerCluster>
    </>
  )
}