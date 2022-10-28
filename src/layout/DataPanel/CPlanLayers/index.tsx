import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { IconButton, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import InputAdornment from '@mui/material/InputAdornment';
import { useMap } from 'react-leaflet';
import * as geojson from 'geojson';
import L, { LatLng } from 'leaflet';
import * as iosColors from 'assets/jsons/colors_ios.json'
import CloseIcon from '@mui/icons-material/Close';
import InfoButton from "components/InfoButton";
import { DataTable } from './DataTable';
import { RenderIf } from 'components/RenderIf/RenderIf';

const { colors } = iosColors
interface CplanGeoJSON extends L.GeoJSON {
  layername?: string
}

export const CPlanLayers = () => {
  const map = useMap()
  const [layerList, setLayerList] = useState<any>([])
  const [ckey, setCkey] = useState('')
  const [colorId, setColorId] = useState(0)
  const [renderTable, setRenderTable] = useState(false)
  const [tableData, setTableData] = useState<any>()

  const styleFunc = () => {
    return {
      color: colors[colorId % 8].value,
      fillColor: colors[colorId % 8].value,
      fillOpacity: 1,
      radius: 4,
    }
  }
  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
    return new L.CircleMarker(latlng)
      .bindTooltip(`<span style='color:${colors[colorId % 8].value}'>${feature.properties.name}</span>`, {
        permanent: true,
        direction: 'center',
        className: 'CPlanLabel',
      })
      .bindPopup(`${feature.geometry.coordinates[1].toString()}, ${feature.geometry.coordinates[0].toString()}`)
  }

  const handleChange = (e: any) => {
    setCkey(e.target.value)
  }

  const handleSearch = (e: any) => {
    if (e?.key === 'Enter' || e.type === 'click') {
      const url = `https://odbwms.oc.ntu.edu.tw/odbintl/rasters/getcplan/?name=${ckey}`
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          const jsonLayer: CplanGeoJSON = L.geoJSON(json, {
            style: styleFunc,
            pointToLayer: pointToLayer,
            // onEachFeature: onEachFeature,
          })
          jsonLayer.layername = ckey
          jsonLayer.addTo(map)
          map.fitBounds(jsonLayer.getBounds())
          setLayerList([...layerList, jsonLayer])
          setTableData(jsonLayer)
          setRenderTable(true)
        })
        .catch((e) => alert('請輸入正確C-key。Please Enter Correct C-Key.'))
      setColorId(colorId + 1)
      setCkey('')
    }
  }
  const handleClose = (index: number) => {
    map.removeLayer(layerList[index])
    setLayerList(layerList.filter((data: any, i: number) => i !== index))
    setRenderTable(false)
  }
  const handleFlyTo = (layer: any) => {
    map.fitBounds(layer.getBounds())
    setTableData(layer)
    setRenderTable(true)
  }
  return (
    <>
      <RenderIf isTrue={renderTable}>
        <DataTable data={tableData} setOpen={setRenderTable} />
      </RenderIf>
      {layerList && layerList.map((data: any, index: number) => {
        return (
          <ListItem
            key={`Cplan-${index}`}
            disablePadding
            sx={{
              paddingLeft: 1
            }}
          >
            <ListItemButton role={undefined} onClick={() => handleFlyTo(data)} dense>
              <ListItemText primary={data.layername} />
            </ListItemButton>
            <ListItemIcon>
              <IconButton onClick={() => handleClose(index)}>
                <CloseIcon />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        )
      })}
      <ListItem
        sx={{
          paddingRight: 0
        }}
      >
        <TextField
          label="C-Key"
          size='small'
          value={ckey}
          onKeyDown={handleSearch}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            marginRight: 3
          }}
        />
        <InfoButton dataId='CPlanLayers' />
      </ListItem>
    </>
  )
} 