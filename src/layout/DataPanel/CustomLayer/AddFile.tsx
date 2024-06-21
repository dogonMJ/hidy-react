import { Box, Button, Input, Table, TableBody, TableCell, TableRow, styled } from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GeoJSON, Tooltip, Popup } from "react-leaflet";
import { flattenObj, getLayerData, importPointToLayer } from "Utils/UtilsImportFiles";
import { useAlert } from "hooks/useAlert";
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { LayerControlPanel } from "./LayerControlPanel";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { addFileSlice } from "store/slice/addFileSlice";
import FormatCoordinate from "components/FormatCoordinate";
import parse from 'html-react-parser'
import DOMPurify from "dompurify";
import Spectral_10 from "assets/jsons/Spectral_10.json"
import { Feature, Geometry } from 'geojson';


const { colors } = Spectral_10
const CustomTabelCell = styled(TableCell)({
  borderBottom: 'none',
  paddingInline: 4,
  paddingBlock: 0
})

export const AddFile = () => {
  const ref = useRef<any[]>([])
  const inputRef = useRef<any>()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { openAlert, setOpenAlert, alertMessage, setMessage, severity, setSeverity } = useAlert()
  const latlonFormat = useAppSelector(state => state.map.latlonformat)
  const [dataList, setDataList] = useState<any[]>([])
  const [initColorIndex, setInitColorIndex] = useState(0)
  const [mouseoverData, setMouseoverData] = useState<any>()
  const [popupData, setPopupData] = useState<any>()
  const [layerColors, setLayerColors] = useState<any[]>([]);
  const [layerOpacities, setLayerOpacities] = useState<any[]>([]);
  const fileList = useAppSelector(state => state.addFile.fileList)

  const handleFileChange = async (event: any) => {
    const files = [...event.target.files]
    const data = await getLayerData(files)
    dispatch(addFileSlice.actions.setFileList(data))
  };

  const handleButtonClick = () => {
    //可input相同檔案
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const importStyleFunc = (feature: Feature<Geometry, any> | undefined, index: number) => {
    const type = feature?.geometry.type
    const color = layerColors[index]
    const opacity = layerOpacities[index] / 100 ?? 1
    if (type === 'Point' || type === 'MultiPoint') {
      return {
        radius: 5,
        opacity: opacity,
        color: '#000000',
        stroke: true,
        weight: 0.2,
        fillColor: color,
        fillOpacity: opacity,
      };
    } else {
      return {
        radius: 5,
        opacity: opacity,
        color: color,
        stroke: true,
        weight: 2,
      }
    }
  }

  const renderDefaultPopupContent = (properties: any) => {
    if (Object.getOwnPropertyNames(properties).length === 0) {
      return parse(`<i>${t('CustomLayer.alert.noPropertyJson')}</i>`);
    }
    const flattenedProperties = flattenObj(properties, null);

    if (Object.keys(flattenedProperties).length === 0) {
      return parse(`<i>${t('CustomLayer.alert.noProperty')}</i>`)
    } else {
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
  }

  const renderKMLPopupContent = (properties: any) => {
    if (!properties) {
      return parse(`<i>${t('CustomLayer.alert.noProperty')}</i>`);
    }
    const { name, description } = properties;

    return (
      <div>
        {name && !description && <div>{name}</div>}
        {description &&
          <div>
            {parse(DOMPurify.sanitize(description.value))}
          </div>
        }
      </div>
    );
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
      setLayerColors(dataList.map(data => data.color))
      setLayerOpacities(dataList.map(data => data.opacity))
    }
  }, [dataList]);

  useEffect(() => {
    //配合drag drop, 分開file list(geojson)和data list(加入顏色選項)
    if (fileList.length > 0) {
      const firstColorIndex = initColorIndex + dataList.length ?? initColorIndex + 1;
      const color = Array.from({ length: fileList.length + dataList.length }, (_, i) => firstColorIndex + i)
        .map(i => colors[i % 10].value);

      setLayerColors([...layerColors, ...color]);
      setInitColorIndex(firstColorIndex);
      const dataObject = fileList.filter(file => typeof file !== 'string').map((data, i) => {
        return {
          ...data,
          color: color[i],
          opacity: 100
        }
      })
      setDataList([...dataList, ...dataObject])
    }
  }, [fileList])

  useEffect(() => {
    return () => {
      dispatch(addFileSlice.actions.setFileList([]))
    }
  }, [])

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
        <LayerControlPanel
          layerList={dataList}
          setLayerList={setDataList}
          isOpacity={true}
          isColorSelect={true}
          isDispatch={false}
          clickName='fitBounds'
          fitBoundLayers={ref.current}
        />}
      {dataList &&
        dataList.map((data, index) => {
          if (typeof data.data === 'string') {
            return null
          }
          else {
            return (
              <Fragment key={`${data.name}_${index}`}>
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