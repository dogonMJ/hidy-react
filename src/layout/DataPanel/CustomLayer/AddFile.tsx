import { Box, Button, IconButton, Input, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, styled } from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMap, GeoJSON, Tooltip, Popup } from "react-leaflet";
import { flattenObj, getLayerData, getLeafletLayer, importPointToLayer } from "Utils/UtilsImportFiles";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { LayerControlPanel } from "./LayerControlPanel";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { addFileSlice } from "store/slice/addFileSlice";
import FormatCoordinate from "components/FormatCoordinate";
import parse from 'html-react-parser'
import DOMPurify from "dompurify";
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { ColorSelect } from "components/ColorSelect/ColorSelect";
import Spectral_10 from "assets/jsons/Spectral_10.json"
import { Feature, GeometryObject, Point, FeatureCollection, Geometry } from 'geojson';


const { colors } = Spectral_10
const CustomTabelCell = styled(TableCell)({
  borderBottom: 'none',
  paddingInline: 4,
  paddingBlock: 0
})

const renderDefaultPopupContent = (properties: any) => {
  if (Object.getOwnPropertyNames(properties).length === 0) {
    return parse('<i>empty properties or .dbf not provided with .shp</i>');
  }
  const flattenedProperties = flattenObj(properties, null);
  return (
    <Table size="small">
      <TableBody>
        {
          Object.keys(flattenedProperties).map((key) => (
            <TableRow key={key}>
              <CustomTabelCell>{key}</CustomTabelCell>
              <CustomTabelCell>{flattenedProperties[key]}</CustomTabelCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

const renderKMLPopupContent = (properties: any) => {
  if (!properties) {
    return parse('<i>empty properties</i>');
  }
  const { name, description } = properties;
  return (
    <div>
      {name && !description && <div>{name}</div>}
      {description &&
        <div>
          {parse(DOMPurify.sanitize(properties.description.value))}
        </div>
      }
    </div>
  );
}

export const AddFile = () => {
  const ref = useRef<any[]>([])
  const inputRef = useRef<any>()
  const map = useMap()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openAlert, setOpenAlert, alertMessage, setMessage, severity, setSeverity } = useAlert()
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  // const [dataList, setDataList] = useState<any[]>([])
  const [initColorIndex, setInitColorIndex] = useState(0)
  const [mouseoverData, setMouseoverData] = useState<any>()
  const [popupData, setPopupData] = useState<any>()
  const [layerColors, setLayerColors] = useState<any[]>([]);
  const dataList = useAppSelector(state => state.addFile.fileList)

  const handleFileChange = async (event: any) => {
    const files = [...event.target.files]
    if (files) {
      const data = await getLayerData(files)
      dispatch(addFileSlice.actions.setFileList(data))
    }
  };

  const handleButtonClick = () => {
    //可input相同檔案
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleColorChange = (index: number, newColor: string) => {
    const layer = ref.current[index]
    layerColors[index] = newColor
    setLayerColors([...layerColors])
    layer.setStyle({
      color: newColor,
    })
  };

  const importStyleFunc = (feature: Feature<Geometry, any> | undefined, index: number) => {
    const type = feature?.geometry.type
    const color = layerColors[index]
    if (type === 'Point' || type === 'MultiPoint') {
      return {
        radius: 5,
        opacity: 1,
        color: '#000000',
        stroke: true,
        weight: 0.2,
        fillColor: color,
        fillOpacity: 1,
      };
    } else {
      return {
        radius: 5,
        opacity: 1,
        color: color,
        stroke: true,
        weight: 2,
      }
    }
  }

  const renderGPXPopupContent = useCallback((feature: any) => {
    const { geometry, properties } = feature
    if (geometry.type === 'Point') {
      const [lng, lat, ele] = [...geometry.coordinates]
      return (
        <Table size="small">
          <TableBody>
            <TableRow>
              <CustomTabelCell>{t('lat')}</CustomTabelCell>
              <CustomTabelCell>{lat}</CustomTabelCell>
            </TableRow>
            <TableRow>
              <CustomTabelCell>{t('lng')}</CustomTabelCell>
              <CustomTabelCell>{lng}</CustomTabelCell>
            </TableRow>
            <TableRow>
              <CustomTabelCell>{t('elevation')}</CustomTabelCell>
              <CustomTabelCell>{ele}</CustomTabelCell>
            </TableRow>
            {
              Object.keys(properties).map(key => (
                <TableRow key={key}>
                  <CustomTabelCell>{key}</CustomTabelCell>
                  <CustomTabelCell>{properties[key]}</CustomTabelCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      )
    } else {
      return (
        <Table size="small">
          <TableBody>
            {
              Object.keys(properties).map(key => {
                if ((typeof properties[key] === 'string' || typeof properties[key] === 'number') && key !== '_gpxType') {
                  return (
                    <TableRow key={key}>
                      <CustomTabelCell>{key}</CustomTabelCell>
                      <CustomTabelCell>{properties[key]}</CustomTabelCell>
                    </TableRow>
                  )
                } else {
                  return null
                }
              })
            }
          </TableBody>
        </Table>
      )
    }
  }, [t])

  useEffect(() => {
    if (ref.current.length > 0 && dataList.length > 0) {
      const lastLayer = ref.current[ref.current.length - 1];
      if (lastLayer) {
        map.fitBounds(lastLayer.getBounds())
      }
    }
    if (ref.current.length > 0 && dataList.length > 0) {
      const firstColorIndex = initColorIndex + dataList.length ?? initColorIndex + 1
      const color = Array.from({ length: dataList.length }, (_, i) => firstColorIndex + i).map(i => colors[i % 10].value)
      setLayerColors([...layerColors, ...color])
      setInitColorIndex(firstColorIndex)
    }
  }, [dataList])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Input
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          inputProps={{
            ref: inputRef,
            multiple: true,
            accept: ["application/json", '.kml', '.shp', '.dbf', '.gpx', '.zip']
          }}
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" onClick={handleButtonClick}>
            {t(`CustomLayer.selectFile`)}
          </Button>
        </label>
      </Box>
      <AlertSlide open={openAlert} setOpen={setOpenAlert} severity={severity} >{alertMessage}</AlertSlide>
      {dataList &&
        dataList.map((data, index) => {
          if (typeof data === 'string') {
            return null
          }
          else {
            return (
              <Fragment key={`${data.name}_${index}`}>
                <Box sx={{ border: 1, padding: 1, marginTop: 1, borderRadius: 1, borderColor: '#C0C0C0' }}>
                  <Button
                    style={{ textTransform: 'none' }}
                    onClick={() => {
                      const thisLayer = ref.current[index];
                      if (thisLayer) {
                        map.fitBounds(thisLayer.getBounds())
                      }
                    }}>
                    <Typography sx={{ maxWidth: '100%', wordWrap: 'break-word', textAlign: 'left', }}>{data.name}</Typography>
                  </Button>
                  <Stack direction={'row'} alignItems={'center'} sx={{ paddingTop: 1 }}>
                    <IconButton
                      color={'error'}
                      onClick={() => {
                        // setDataList(dataList.filter((_, i) => i !== index))
                        dispatch(addFileSlice.actions.setFileList(dataList.filter((_, i) => i !== index)))
                        setLayerColors(layerColors.filter((_, i) => i !== index))
                        ref.current = ref.current.filter((_, i) => i !== index)
                      }}
                    >
                      <LayersClearIcon />
                    </IconButton>
                    <ColorSelect
                      color={layerColors[index]}
                      setColor={(newColor: string) => handleColorChange(index, newColor)}
                    />
                  </Stack>
                </Box>
                <GeoJSON
                  ref={(layer) => {
                    if (layer) {
                      const layerId = layer.getLayerId(layer)
                      const isLayerExist = ref.current.some(layer => layer.getLayerId(layer) === layerId)
                      if (!isLayerExist) {
                        ref.current[index] = layer
                      }
                    }
                  }}
                  data={data.data}
                  style={(feature) => importStyleFunc(feature, index)}
                  pointToLayer={importPointToLayer}
                  eventHandlers={{
                    mouseover: (e) => {
                      setMouseoverData(e.sourceTarget.feature)
                    },
                    click: (e) => {
                      setPopupData(e.sourceTarget.feature)
                    }
                  }}
                >
                  {mouseoverData &&
                    <Tooltip >
                      {mouseoverData.properties.name ?? null}
                      {mouseoverData.properties.name && <br />}
                      {(mouseoverData.properties.times || mouseoverData.properties.time) ?? null}
                      {(mouseoverData.properties.times || mouseoverData.properties.time) && <br />}
                      {mouseoverData.geometry.type === 'Point' ?
                        <FormatCoordinate coords={{ lat: mouseoverData.geometry.coordinates[1], lng: mouseoverData.geometry.coordinates[0] }} format={latlonFormat} />
                        : null
                      }
                    </Tooltip>
                  }
                  {
                    !['gpx', 'kml'].includes(data.type) && popupData &&
                    <Popup>
                      {renderDefaultPopupContent(popupData.properties)}
                    </Popup>
                  }
                  {
                    data.type === 'gpx' && popupData &&
                    <Popup>{renderGPXPopupContent(popupData)}</Popup>
                  }
                  {
                    data.type === 'kml' && popupData &&
                    <Popup>
                      {renderKMLPopupContent(popupData.properties)}
                    </Popup>
                  }
                </GeoJSON >
              </Fragment>
            )
          }
        })}
    </>
  );
}