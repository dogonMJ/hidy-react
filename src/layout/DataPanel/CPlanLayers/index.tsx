import { useEffect, useRef, useState } from 'react';
import { IconButton, ListItem, ListItemButton, ListItemText, ListItemIcon, TextField, InputAdornment } from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useMap } from 'react-leaflet';
import * as geojson from 'geojson';
import L, { LatLng } from 'leaflet';
import iosColors from 'assets/jsons/colors_ios.json'
import InfoButton from "components/InfoButton";
import { DataTable } from './DataTable';
import { RenderIf } from 'components/RenderIf/RenderIf';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { cplanSlice } from 'store/slice/cplanSlice';
import { onoffsSlice } from 'store/slice/onoffsSlice';
import { useSingleComponentCheck } from 'hooks/useSingleComponentCheck';

const { colors } = iosColors
interface CplanGeoJSON extends L.GeoJSON {
  layername?: string
}

export const CPlanLayers = () => {
  const { addCheckedComponent, removeCheckedComponent } = useSingleComponentCheck()
  const dispatch = useAppDispatch()
  const map = useMap()
  const colorId = useRef(0);
  const ckeys = useAppSelector(state => state.cplan.ckeys)
  const [layerList, setLayerList] = useState<any>([])
  const [ckey, setCkey] = useState('')
  const [renderTable, setRenderTable] = useState(false)
  const [tableData, setTableData] = useState<any>()


  const styleFunc = () => {
    return {
      color: colors[colorId.current].value,
      fillColor: colors[colorId.current].value,
      fillOpacity: 1,
      radius: 4,
    }
  }
  const pointToLayer = (feature: geojson.Feature<geojson.Point, any>, latlng: LatLng) => {
    return new L.CircleMarker(latlng)
      .bindTooltip(`<span style='color:${colors[colorId.current].value}'>${feature.properties.name}</span>`, {
        permanent: true,
        direction: 'center',
        className: 'CPlanLabel',
      })
      .bindPopup(`${feature.geometry.coordinates[1].toString()}, ${feature.geometry.coordinates[0].toString()}`)
  }

  const handleChange = (e: any) => {
    setCkey(e.target.value)
  }

  const handleSearch = async (key: string) => {
    const url = `https://odbwms.oc.ntu.edu.tw/odbintl/rasters/getcplan/?name=${key}`
    await fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const jsonLayer: CplanGeoJSON = L.geoJSON(json, {
          style: styleFunc,
          pointToLayer: pointToLayer,
        })
        if (!ckeys.includes(key)) {
          dispatch(cplanSlice.actions.setCkeys([...ckeys, key]))
        }
        jsonLayer.layername = key
        jsonLayer.addTo(map)
        map.fitBounds(jsonLayer.getBounds())
        setLayerList((prevLayerList: any) => [...prevLayerList, jsonLayer]);
        setTableData(jsonLayer)
        setRenderTable(true)
        addCheckedComponent('cplan')
      })
      .catch((e) => alert('請輸入正確C-key。Please Enter Correct C-Key.'))
    setCkey('')
    colorId.current = (colorId.current + 1) % 8
  }
  const handleClose = (index: number) => {
    dispatch(cplanSlice.actions.setCkeys([...ckeys].filter(key => key !== ckeys[index])))
    layerList.length === 1 && removeCheckedComponent('cplan')
    map.removeLayer(layerList[index])
    setLayerList(layerList.filter((data: any, i: number) => i !== index))
    setRenderTable(false)
  }
  const handleFlyTo = (layer: any) => {
    map.fitBounds(layer.getBounds())
    setTableData(layer)
    setRenderTable(true)
  }

  useEffect(() => {
    if (ckeys.length > 0) {
      ckeys.forEach(async (key) => {
        await handleSearch(key)
      })
    }
  }, [])
  return (
    <>
      <RenderIf isTrue={renderTable}>
        <DataTable data={tableData} setOpen={setRenderTable} />
      </RenderIf>
      <ListItem sx={{ paddingRight: 0 }}>
        <TextField
          label="C-Key"
          size='small'
          value={ckey}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(ckey)}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleSearch(ckey)}>
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginRight: 3 }}
        />
        <InfoButton dataId='CPlanLayers' />
      </ListItem>
      {layerList && layerList.map((data: any, index: number) => {
        return (
          <ListItem
            key={`Cplan-${index}`}
            disablePadding
            sx={{ paddingLeft: 1 }}
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
    </>
  )
} 