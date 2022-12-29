import { useEffect, useState } from "react"
import { useMap } from 'react-leaflet'
import * as geojson from 'geojson';
import { MenuItem, Box, Select, SelectChangeEvent, FormControl, InputLabel } from "@mui/material"
import { useTranslation } from "react-i18next"
//@ts-ignore
import omnivore from '@mapbox/leaflet-omnivore'
import L from 'leaflet'
import { RenderIf } from "components/RenderIf/RenderIf";

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
        weight: 3
      })
      layer.bringToFront()
    },
    'mouseout': () => {
      layer.setStyle(lineStyle)
    }
  })
}

export const HistTrack = (props: { open: boolean }) => {
  const { open } = props
  const map = useMap()
  const { t } = useTranslation()
  const [shipList, setShipList] = useState<any>(undefined)
  const [ship, setShip] = useState('')
  const [year, setYear] = useState('')
  const [kmlLayer, setKmlLayer] = useState<any>(null)
  const url = 'https://odbpo.oc.ntu.edu.tw/ais/getorship/OR1/2003/kml?ucode=cvWpEMrndr--ytIcuOAXiq1Vrxjun8iL'

  const getShips = () => fetch('https://odbpo.oc.ntu.edu.tw/ais/getorshiplist')
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
    if (open) {
      if (kmlLayer) {
        map.removeLayer(kmlLayer)
      }
      const customLayer = L.geoJSON(undefined, {
        style: lineStyle,
        onEachFeature: onEachFeatureKML
      });
      const newLayer = omnivore.kml(`https://localhost:3000/test_files/${ship}_${year}.kml`, null, customLayer)
      newLayer.addTo(map);
      setKmlLayer(newLayer)
    } else {
      if (kmlLayer) {
        map.removeLayer(kmlLayer)
      }
    }
  }, [year, ship, open])
  return (
    <>
      <RenderIf isTrue={open}>
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
      </RenderIf>

    </>
  )
}