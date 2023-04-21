import mapList from 'assets/jsons/WebMapsList.json'
import { Api, TileProp } from 'types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import { AddWMS } from '../WMSSelector/AddWMS'
import { AddWMTS } from '../WMSSelector/AddWMTS'
import { timeDurations } from 'Utils/UtilsURL'
import { CircularProgress, Stack, Typography } from '@mui/material'
import { RenderIf } from 'components/RenderIf/RenderIf'
import { AlertSlide } from 'components/AlertSlide/AlertSlide'
import { useTranslation } from 'react-i18next'


export const ProcWebMaps = (props: { identifier: string }) => {
  const { t } = useTranslation()
  const { identifier } = { ...props }
  const datetime = useSelector((state: RootState) => state.coordInput.datetime);
  const [layerProps, setLayerProps] = useState({})
  const [showLayer, setShowLayer] = useState(false)
  const [loadingLayers, setLoadingLayers] = useState(false)
  const [notInTimeRange, setNotInTimeRange] = useState(false)
  const mapInfo: Api = mapList[identifier as keyof typeof mapList]
  const serviceType = mapInfo.type.toUpperCase()


  useEffect(() => {
    const query = new URLSearchParams({
      url: mapInfo.url,
      type: serviceType,
      layer: mapInfo.layer
    })
    const fetchData = () => {
      setNotInTimeRange(false)
      setLoadingLayers(true)
      return fetch(`${process.env.REACT_APP_PROXY_BASE}${query}`)
        .then(res => res.json())
        .then(json => {
          const capability = json.capability[0]
          console.log(serviceType, capability)
          const timeInfo = capability.dimension?.time.value
          const [time, inRange] = [...timeDurations(datetime, timeInfo)]
          console.log(time, inRange)
          if (inRange) {
            if (serviceType === 'WMTS') {
              setLayerProps({
                url: mapInfo.url,
                layer: mapInfo.layer,
                TileMatrixSet: capability.TileMatrixSet,
                template: capability.template[0],
                format: capability.format[0],
                style: capability.default ? capability.default : capability.example,
                time: time
              })
            } else {
              setLayerProps({
                url: mapInfo.url,
                layer: mapInfo.layer,
                service: serviceType,
                time: time
              })
            };
            setShowLayer(true)
          } else {
            setLoadingLayers(false)
            setShowLayer(false)
          }
          setNotInTimeRange(!inRange)
        })
    }
    fetchData()
  }, [mapInfo, serviceType, datetime])


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
      {(showLayer && !notInTimeRange && serviceType === 'WMS') && <AddWMS params={layerProps} eventHandlers={eventHandlers} />}
      {(showLayer && !notInTimeRange && serviceType === 'WMTS') && <AddWMTS params={layerProps} eventHandlers={eventHandlers} />}
    </>
  )
}