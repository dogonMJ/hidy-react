import { useEffect, useRef, useState } from "react"
import { useMap, GeoJSON } from 'react-leaflet'
import * as geojson from 'geojson';
import { MenuItem, Box, Select, SelectChangeEvent, FormControl, InputLabel } from "@mui/material"
import { useTranslation } from "react-i18next"
// @ts-ignore
import toGeoJSON from '@mapbox/togeojson'


const lineStyle = {
  color: '#3388FF',
  weight: 2
}

const onEachFeatureKML = (feature: geojson.Feature<geojson.GeometryObject, any>, layer: any) => {
  const cruiseId = feature.properties?.name.split('_')
  layer.bindTooltip(`${cruiseId[0]}-${cruiseId[1]}`, { sticky: true });
  layer.on({
    'mouseover': () => {
      layer.setStyle({
        color: 'white',
        weight: 4
      })
      layer.bringToFront()
    },
    'mouseout': () => {
      layer.setStyle(lineStyle)
    },
    'click': () => {
      window.open(`https://cruise.oc.ntu.edu.tw/csr/${cruiseId[0]}${cruiseId[1]}`, '_blank')
    }
  })
}

export const HistTrack = () => {
  const map = useMap()
  const ref = useRef<any>()
  const { t } = useTranslation()
  const [shipList, setShipList] = useState<any>(undefined)
  const [ship, setShip] = useState('')
  const [year, setYear] = useState('')
  const [json, setJson] = useState<any>(null)

  const getShips = () => fetch(`${process.env.REACT_APP_PROXY_BASE}/data/shiplist/getorshiplist`)
    .then(response => response.json())
    .then(json => setShipList(json[0]))

  const handleShip = (event: SelectChangeEvent) => {
    const oldYear = year
    const newShip = event.target.value
    shipList[newShip].includes(oldYear) ? setYear(oldYear) : setYear('')
    setShip(newShip);
    map.scrollWheelZoom.enable()
    map.dragging.enable()
  }
  const handleYear = (event: SelectChangeEvent) => {
    setYear(event.target.value);
    map.scrollWheelZoom.enable()
    map.dragging.enable()
  }

  useEffect(() => {
    getShips()
  }, [])

  useEffect(() => {
    ref.current.clearLayers()
    if (year) {
      fetch(`${process.env.REACT_APP_PROXY_BASE}/data/histship?ship=${ship}&year=${year}`, {
        credentials: 'include'
      })
        .then(response => response.text())
        .then(text => {
          const kml = new DOMParser().parseFromString(text, "text/xml");
          const json = toGeoJSON.kml(kml)
          setJson(json)
          ref.current.addData(json)
        })
    }
  }, [year, ship])
  return (
    <>
      <Box sx={{ pb: 1, pl: 2 }}>
        <FormControl variant="standard" sx={{ ml: 1, minWidth: 90 }}>
          <InputLabel>{t('ShipTrack.ship')}</InputLabel>
          <Select
            label='Ship'
            value={ship}
            onChange={handleShip}
            size="small"
          >
            {shipList &&
              Object.keys(shipList).map(ship => <MenuItem key={ship} value={ship}>{ship}</MenuItem>)
            }
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ ml: 2, minWidth: 90 }}>
          <InputLabel>{t('ShipTrack.year')}</InputLabel>
          <Select
            label='Year'
            value={year}
            onChange={handleYear}
            size="small"
          >
            {ship && ship !== '' &&
              shipList[ship].map((yr: string) => <MenuItem key={yr} value={yr}>{yr}</MenuItem>)
            }
          </Select>
        </FormControl>
      </Box >
      <GeoJSON ref={ref} data={json} onEachFeature={onEachFeatureKML} style={lineStyle}></GeoJSON>
    </>
  )
}