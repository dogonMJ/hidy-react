import mapList from 'assets/jsons/WebMapsList.json'
import { Api, ElevationInfo } from 'types'
import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { AddWMS } from '../WMSSelector/AddWMS'
import { AddWMTS } from '../WMSSelector/AddWMTS'
import { timeDurations, getElevationInfo } from 'Utils/UtilsURL'
import { CircularProgress, Typography } from '@mui/material'
import { AlertSlide } from 'components/AlertSlide/AlertSlide'
import { useTranslation } from 'react-i18next'
import { DepthMeter } from 'components/DepthlMeter'
import { getMarks } from "Utils/UtilsApi";
import { ShowData } from '../APIlayers/ShowData'
interface LayerProps {
  [key: string]: any
  elevation?: number
}
const tileProps: any[] = []
export const ProcWebMaps = (props: { identifier: string }) => {
  const { t } = useTranslation()
  const { identifier } = { ...props }
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const [layerProps, setLayerProps] = useState<LayerProps>({})
  const [showLayer, setShowLayer] = useState(false)
  const [loadingLayers, setLoadingLayers] = useState(false)
  const [notInTimeRange, setNotInTimeRange] = useState(false)
  const [depthProps, setDepthProps] = useState<ElevationInfo>({ defaultValue: undefined, unit: undefined, values: undefined })
  const depthValueIndex = useSelector((state: RootState) => state.coordInput.depthMeterValue)

  const mapInfo: Api = mapList[identifier as keyof typeof mapList]
  const serviceType = mapInfo.type.toUpperCase()

  const key = `${mapInfo.layer}_${datetime}_${depthValueIndex}`
  const fetchData = useCallback(async () => {
    setNotInTimeRange(false)
    setLoadingLayers(true)
    const query = new URLSearchParams({
      url: mapInfo.url,
      type: serviceType,
      layer: mapInfo.layer
    })
    return fetch(`${process.env.REACT_APP_OGCQUERY}${query}`)
      .then(res => res.json())
      .then(json => {
        const capability = json.capability[0]
        console.log(serviceType, capability)
        const timeInfo = capability.dimension?.time.value
        const [time, inRange] = [...timeDurations(datetime, timeInfo)]
        const elevationObject = capability.dimension?.elevation
        const elevations = (elevationObject && elevationObject.value) ? getElevationInfo(elevationObject) : undefined

        if (inRange) {
          if (elevations && elevations.values && elevations.values.length > 1) {
            setDepthProps(elevations)
            const index = (depthValueIndex === -1 || !elevations.values[depthValueIndex]) ? elevations.values.length - 1 : depthValueIndex
            Object.assign(layerProps, { elevation: elevations.values[index] })
          } else {
            if (layerProps.elevation) { delete layerProps.elevation }
            setDepthProps({ defaultValue: undefined, unit: undefined, values: undefined })
          }
          if (serviceType === 'WMTS') {
            const propsWMTS = {
              key: `${mapInfo.layer}_${datetime}_${depthValueIndex}`,
              url: mapInfo.url,
              layer: mapInfo.layer,
              TileMatrixSet: capability.TileMatrixSet,
              template: capability.template[0],
              format: capability.format[0],
              style: capability.default ? capability.default : capability.example,
              time: time,
            }
            tileProps.push(propsWMTS)
            setLayerProps(propsWMTS)
          } else {
            const propsWMS = {
              ...layerProps,
              key: `${mapInfo.layer}_${datetime}_${depthValueIndex}`,
              url: mapInfo.url,
              layer: mapInfo.layer,
              service: serviceType,
              time: time,
            }
            tileProps.push(propsWMS)
            setLayerProps(propsWMS)
          };

          setShowLayer(true)
        } else {
          setLoadingLayers(false)
          setShowLayer(false)
        }
        setNotInTimeRange(!inRange)
      })
  }, [mapInfo, serviceType, datetime])

  useEffect(() => {
    const propsIndex = tileProps.findIndex((element) => element.key === key)
    console.log(propsIndex)
    if (propsIndex === -1) {
      fetchData()
    } else {
      setLayerProps(tileProps[propsIndex])
    }
    console.log(tileProps)
  }, [fetchData, key])

  const eventHandlers = {
    // tileerror: (e: any) => console.log('ppppp', e),
    // error: () => console.log('error'),
    load: () => setLoadingLayers(false),
    // loading: () => setLoadingLayers(true)
  }

  return (
    <>
      <AlertSlide
        severity='warning'
        open={notInTimeRange}
        setOpen={setNotInTimeRange}
        timeout={3000} >
        <Typography>
          {t('APIlayers.alert.range')}
        </Typography>
      </AlertSlide>
      <AlertSlide
        severity='info'
        open={loadingLayers}
        setOpen={setLoadingLayers}
        icon={<CircularProgress size={15} sx={{ marginTop: 0.5 }} />}
      >
        <Typography>
          {t('APIlayers.alert.loading')}
        </Typography>
      </AlertSlide>
      {depthProps.values !== undefined &&
        <DepthMeter
          values={depthProps.values}
          marks={getMarks(depthProps.unit ? depthProps.unit : 'm', depthProps.values)}
        />}
      {(showLayer && !notInTimeRange && serviceType === 'WMS') && <AddWMS params={layerProps} eventHandlers={eventHandlers} />}
      {(showLayer && !notInTimeRange && serviceType === 'WMTS') && <AddWMTS params={layerProps} eventHandlers={eventHandlers} />}
    </>
  )
}