import { useTranslation } from "react-i18next"
import { TileLayer, useMap, useMapEvents } from "react-leaflet"
import { TileLayerCanvas } from "../../../components/TileLayerCanvas"
import { FormControl, FormControlLabel, FormLabel, Stack, Radio, RadioGroup, TextField, Button, CircularProgress, Box } from "@mui/material"
import InfoButton from "components/InfoButton"
import { useEffect, useState, useRef } from "react"
import { OpacitySlider } from "../../../components/OpacitySlider"
import { getUrlQuery, checkServiceType } from "Utils/UtilsURL"
import { AlertSlide } from "components/AlertSlide/AlertSlide";
import { ServiceType } from "types"
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks"
import { addWmsLayerSlice } from "store/slice/addWmsLayerSlice"

//https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg
//https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?&service=WMS&request=GetMap&layers=GHRSST_L4_AVHRR-OI_Sea_Surface_Temperature&styles=&format=image%2Fpng&transparent=true&version=1.1.1&time=2019-03-17&width=256&height=256&srs=EPSG%3A3857

interface Params {
  base: string
  params: { [key: string]: any }
}

export const DirectAddLayers = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const map = useMap()
  const ref = useRef<any>(null)
  const url = useAppSelector(state => state.addWmsLayer.url)
  const serviceType = useAppSelector(state => state.addWmsLayer.serviceType)
  const opacity = useAppSelector(state => state.addWmsLayer.opacity)
  const showLayer = useAppSelector(state => state.addWmsLayer.showLayer)
  const [key, setKey] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<Params>({ base: '', params: {} })
  const [openZoomAlert, setOpenZoomAlert] = useState(false)
  const [zoomLevel, setZoomLevel] = useState('')

  useMapEvents({
    'zoomend': () => {
      if (showLayer) {
        setOpenZoomAlert(true)
        setZoomLevel(map.getZoom().toString())
        setTimeout(() => setOpenZoomAlert(false), 3000)
      }
    },
  })

  const handleServiceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setShowLayer(false)
    dispatch(addWmsLayerSlice.actions.setWmsShowLayer(false))
    dispatch(addWmsLayerSlice.actions.setServiceType(event.target.value as ServiceType))
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value
    dispatch(addWmsLayerSlice.actions.setServiceType(checkServiceType(newUrl)))
    dispatch(addWmsLayerSlice.actions.setWmsUrl(newUrl))
  }

  const handleAddLayer = () => {
    if (serviceType === 'WMS') {
      const paramsObject = getUrlQuery(url)
      Object.assign(paramsObject.params, {
        crossOrigin: 'anonymous',
        uppercase: true,
      })
      setParams(paramsObject)
    } else {
      setParams({ base: url, params: {} })
    }
    setKey(new Date().toTimeString())
    dispatch(addWmsLayerSlice.actions.setWmsShowLayer(true))
  }

  const handleOpacity = (event: Event, newValue: number | number[]) => {
    dispatch(addWmsLayerSlice.actions.setWmsOpacity(newValue as number))
  };

  const handleClearLayer = () => {
    dispatch(addWmsLayerSlice.actions.setWmsShowLayer(false))
    setOpenZoomAlert(false)
    setZoomLevel('')
    setLoading(false)
  }

  const eventHandlers = {
    load: () => setLoading(false),
    loading: () => setLoading(true)
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.setOpacity(opacity / 100)
    }
  })

  useEffect(() => {
    if (showLayer) {
      handleAddLayer()
    }
  }, [])
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <TextField
          multiline={true}
          label={t('CustomLayer.serverUrl')}
          value={url}
          onChange={handleUrlChange}
          variant="outlined"
          size="small"
          sx={{
            width: '75%',
            "& label": { fontSize: 14, }
          }}
        />
        <Button variant="contained" onClick={handleAddLayer}>{t('CustomLayer.add')}</Button>
      </Stack>
      <FormControl>
        <Stack direction="row" alignItems="center">
          <FormLabel>{t('CustomLayer.urlType')}</FormLabel>
          <InfoButton dataId="urlType" />
        </Stack>
        <RadioGroup
          row
          name="URL Type"
          value={serviceType}
          onChange={handleServiceType}
        >
          <FormControlLabel value="WMS" control={<Radio />} label="WMS" />
          <FormControlLabel value="WMTS" control={<Radio />} label="WMTS" />
        </RadioGroup>
      </FormControl>
      {loading &&
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
          <CircularProgress />
        </Box>
      }
      {showLayer &&
        <>
          <br />
          <OpacitySlider opacity={opacity} onChange={handleOpacity} />
          <br />
          <Button variant="contained" color={'error'} onClick={handleClearLayer}>{t('CustomLayer.clearLayer')}</Button>
        </>
      }
      {showLayer &&
        <TileLayerCanvas
          type={serviceType}
          ref={ref}
          key={key}
          url={params.base}
          eventHandlers={eventHandlers}
          params={params.params}
        />
      }
      <AlertSlide open={openZoomAlert} setOpen={setOpenZoomAlert} severity='info' > {`TileMatrix (Zoom Level): ${zoomLevel}`} </AlertSlide>
    </>
  )
}